var cease;
var gamePause;
var gameUnpause;
var gamePaused = false;
var generatePeaks;
var loadSong;
var subSong;
var mainSong;
var fft, amplitude;
var subAmplitude, mainAmplitude;
var lastAmp = 0;
var amps = [];
var speed;
var prevTime, nowTime, deltaTime;
var canSpace = true;
var newMissile;
var missiles = [];
var distance;
var sketch, gameAdd;
var earthRatio = 15;
var shieldRatio = 25;
var shieldAngleSize = Math.PI / 4;
var shieldSound;
var missileRatio = 95;
var missileSpeedRatio = 50; //in Ratio of Minimum Dimension per second;
var missileLengthRatio = 10;
var missileSecsToShield = (missileRatio + missileLengthRatio - shieldRatio) / missileSpeedRatio;
var missileSecsBetween = 0.05;
var minDim = (window.innerHeight - 64 > window.innerWidth ? window.innerWidth : window.innerHeight - 64);

console.log('It worked!')

function classicInitialise() {
    var spacePressed = false;

    sketch = function (p) {
        cease = function () {
            p.remove();
        };

        gamePause = function () {
            gamePaused = true;
            subSong.pause();
            mainSong.pause();
        }

        gameUnpause = function () {
            gamePaused = false;
            subSong.play();
            mainSong.play();
        }

        loadSong = function (songName) {

            shieldSound = p.loadSound("../assets/sound/drumkick.wav");
            shieldSound.setVolume(effectVolume / 100);
            shieldSound.playMode('restart');

            subSong = p.loadSound('../music/' + songName, function () {

                mainSong = p.loadSound('../music/' + songName, function () {

                    startSongs();
                    //generatePeaks();

                });
            });
        }

        function startSongs() {
            fft.setInput(subSong);
            //subSong.connect(subAmplitude);
            //subSong.setVolume();
            subSong.play();
            subSong.disconnect();

            setTimeout(function () {
                mainAmplitude.setInput(mainSong);
                mainSong.setVolume(musicVolume / 100);
                mainSong.play();
            }, missileSecsToShield * 1000);
        }

        // function generatePeaks() {
        //     mainSong.processPeaks(function (peaks) {

        //         peaks.sort(function (a, b) {
        //             return a - b
        //         });
        //         console.log(peaks);

        //         //song.addCue(peaks[0] - missileSecsToShield, newMissile)

        //         peaks.forEach(function (peakTime) {
        //             //console.log(peakTime);
        //             mainSong.addCue(peakTime - missileSecsToShield, newMissile);
        //         });
        //         mainSong.setVolume(musicVolume / 100);
        //         mainSong.play();
        //     }, 0.9, 0.01, 1000);

        // }



        p.setup = function () {
            p.createCanvas(window.innerWidth, window.innerHeight - 70);
            fft = new p5.FFT();
            //amplitude = new p5.Amplitude();
            subAmplitude = new p5.Amplitude();
            mainAmplitude = new p5.Amplitude();
        }

        p.draw = function () {
            //minDim = minDim + p.map(Math.pow(mainAmplitude * (p.map(musicVolume / 100, 0, 1, 1.22, 1)), 3), 0, Math.pow(255, 3), -10, 0);
            
            //console.log(p.getAudioContext());
            //console.log(subAmplitude.getLevel());
            var spectrum = fft.analyze(64);

            var specAvg = 0;
            for(var i = 0;i < spectrum.length;i++){
                specAvg = specAvg + spectrum[i];
            }
            specAvg = p.map(specAvg / spectrum.length, 0, 255, 0, 1);

            //console.log(specAvg);

            var ampdt = 0;

            for(var i = 0;i<amps.length;i++){
                ampdt = ampdt + amps[i];
            }
            if(amps.length > 0){
                ampdt = ampdt / amps.length;
            }
            //console.log(amps);

            console.log(specAvg - lastAmp);
            if((specAvg - lastAmp) > (10 * ampdt)){
                newMissile();
            }

            if(specAvg != 0 || ampdt != 0){
                amps.push(specAvg - lastAmp);
            }

            lastAmp = specAvg;
            //console.log(lastAmp);

            //amps.push(specAvg);
            // var sum = 0;
            // amps.forEach(function (a) {
            //     sum = sum + a;
            // });
            // var avg = sum / amps.length;
            // console.log('average - ' + avg);

            p.background('#111111')
            nowTime = new Date();
            p.translate(p.width / 2, p.height / 2);
            //Drawing the earth, Shield Rotation Radius and the Missile Launch Radius.
            //Earth
            p.noStroke();
            p.fill('#afeeee');
            p.ellipse(0, 0, (earthRatio / 100) * minDim);

            //shield radius
            p.noFill();
            p.strokeWeight(2);
            p.stroke('#EEEEEE');
            p.ellipse(0, 0, (shieldRatio / 100) * minDim);

            //missile radius
            p.stroke('#FFFFFF');
            p.ellipse(0, 0, (missileRatio / 100) * minDim);

            p.strokeWeight(5);

            if(spacePressed){
                p.stroke('#e85c5c');
            }

            p.arc(0, 0, (shieldRatio / 100) * minDim, (shieldRatio / 100) * minDim, findAngle(p.mouseX, p.mouseY) - shieldAngleSize, findAngle(p.mouseX, p.mouseY) + shieldAngleSize);

            missiles.forEach(function (m) {
                if (!gamePaused) {
                    m.update();
                    if(spacePressed){
                        m.checkDestroy();
                    }
                }
                m.draw();
            });

            prevTime = nowTime;
        }

        newMissile = function () {
            //console.log('missile made');
            //var newM = new Missile(p.random(0, 2 * Math.PI));
            var newM = new Missile(0);
            missiles.push(newM);
        }

        function findAngle(x, y) {
            var relativeX = x - (p.width / 2);
            var relativeY = y - (p.height / 2);

            var mAngle = Math.atan(relativeY / relativeX) - (x < (p.width / 2) ? Math.PI : 0);
            return mAngle;
            //console.log(mAngle + " - " + relativeX + ", " + relativeY + " - " + relativeY/relativeX);

        }

        function missileHit(m) {
            //console.log('hit');
            missiles.splice(missiles.indexOf(m), 1);
        }

        function missileDestroy(m) {
            console.log('destroy');
            missiles.splice(missiles.indexOf(m), 1);
        }

        function Missile(angle) {
            this.angle = angle;
            this.lenRatio = missileLengthRatio;
            this.distRatio = missileRatio;
            this.speedRatio = missileSpeedRatio;

            this.update = function () {
                if (prevTime) {
                    deltaTime = (nowTime.getTime() - prevTime.getTime()) / 1000;
                } else {
                    deltaTime = 0;
                }


                this.distRatio -= this.speedRatio * deltaTime;

                if (this.distRatio - this.lenRatio <= earthRatio) {
                    missileHit(this);
                }
            };

            this.draw = function () {
                p.push();
                p.rotate(this.angle - (Math.PI / 2));
                p.strokeWeight(5);
                p.stroke('#e85c5c');
                p.line(0, (this.distRatio / 200) * minDim, 0, ((this.distRatio - this.lenRatio) / 200) * minDim);
                p.pop();
            };

            this.checkDestroy = function () {
                if (this.distRatio >= shieldRatio && this.distRatio - missileLengthRatio <= shieldRatio) {
                    if (this.angle >= findAngle(p.mouseX, p.mouseY) - shieldAngleSize && this.angle <= findAngle(p.mouseX, p.mouseY) + shieldAngleSize) {
                        if(shieldSound){
                            shieldSound.play();
                        }
                        missileDestroy(this);
                    }
                }
            };

        }

        p.keyTyped = function () {
            if (!gamePaused && !spacePressed && canSpace) {
                if (p.key == "s") {
                    spacePressed = true;
                    p.stroke('#e85c5c');
                    canSpace = false;
                    setTimeout(function() {
                        spacePressed = false;
                        setTimeout(function() {
                            canSpace = true;
                        }, missileSecsBetween * 1000);
                    }, missileSecsBetween * 1000);
                } else {
                    spacePressed = false;
                }
            }
        }

        p.windowResized = function () {
            p.resizeCanvas(p.windowWidth, p.windowHeight - 64);
            minDim = (window.innerHeight - 64 > window.innerWidth ? window.innerWidth : window.innerHeight - 64);
        }
    };

    new p5(sketch, document.getElementById('game-view'));
    //console.log('called');
}