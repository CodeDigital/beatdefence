var cease;
var gamePause;
var gameUnpause;
var generatePeaks;
var loadSong;
var song;
var fft, amplitude;
var speed;
var prevTime, nowTime, deltaTime;
var newMissile;
var missiles = [];
var distance;
var sketch, gameAdd;
var earthRatio = 15;
var shieldRatio = 25;
var shieldAngleSize = Math.PI / 4;
var missileRatio = 95;
var missileSpeedRatio = 50; //in Ratio of Minimum Dimension per second;
var missileLengthRatio = shieldRatio - earthRatio;
var missileSecsToShield = (missileRatio + missileLengthRatio - shieldRatio) / missileSpeedRatio;
var minDim = (window.innerHeight - 64 > window.innerWidth ? window.innerWidth : window.innerHeight - 64);

console.log('It worked!')

function classicInitialise() {
    var spacePressed = false;

    sketch = function (p) {
        cease = function () {
            p.remove();
        };

        gamePause = function () {
            song.pause();
        }

        gameUnpause = function () {
            song.play();
        }

        loadSong = function (songName) {
            song = p.loadSound('../music/' + songName, function () {
                generatePeaks();
            });
        }

        function generatePeaks() {
            song.processPeaks(function (peaks) {

                peaks.sort(function(a, b){return a - b});
                console.log(peaks);

                //song.addCue(peaks[0] - missileSecsToShield, newMissile)

                peaks.forEach(function (peakTime) {
                    //console.log(peakTime);
                    song.addCue(peakTime - missileSecsToShield, newMissile);
                });
                song.setVolume(musicVolume / 100);
                song.play();
            }, 0.9, 0.22, 1000);

        }

        p.setup = function () {
            p.createCanvas(window.innerWidth, window.innerHeight - 70);
        }

        p.draw = function () {
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
            p.ellipse(0,0, (shieldRatio/100) * minDim);

            //missile radius
            p.stroke('#FFFFFF');
            p.ellipse(0,0,(missileRatio/100) * minDim);

            p.strokeWeight(5);
            if(p.keyIsDown(32)){
                spacePressed = true;
                p.stroke('#e85c5c');
            }else{
                spacePressed = false;
            }
            p.arc(0,0,(shieldRatio/100) * minDim,(shieldRatio/100) * minDim, findAngle(p.mouseX,p.mouseY) - shieldAngleSize, findAngle(p.mouseX,p.mouseY) + shieldAngleSize);

            missiles.forEach(function(m) {
                m.update();
                m.draw();
            });

            prevTime = nowTime;
        }

        newMissile = function () {
            console.log('missile made');
            //var newM = new Missile(p.random(0, 2 * Math.PI));
            var newM = new Missile(0);
            missiles.push(newM);
        }

        function findAngle(x,y) {
            var relativeX = x - (p.width/2);
            var relativeY = y - (p.height/2);

            var mAngle = Math.atan(relativeY / relativeX) - (x < (p.width/2) ? Math.PI:0);
            return mAngle;
            //console.log(mAngle + " - " + relativeX + ", " + relativeY + " - " + relativeY/relativeX);

        }

        function missileHit(m) {
            console.log('hit');
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

                if (this.distRatio <= shieldRatio) {
                    missileHit(this);
                }
            };

            this.draw = function () {
                p.push();
                p.rotate(this.angle - (Math.PI/2));
                p.strokeWeight(5);
                p.stroke('#e85c5c');
                p.line(0, (this.distRatio / 200) * minDim, 0, ((this.distRatio - this.lenRatio)/200) * minDim);
                p.pop();
            };

            this.checkDestroy = function() {
                if(this.distRatio >= shieldRatio && this.distRatio - missileLengthRatio <= shieldRatio){
                    if(this.angle >= findAngle(p.mouseX,p.mouseY) - shieldAngleSize && this.angle <= findAngle(p.mouseX,p.mouseY) + shieldAngleSize){
                        missileDestroy(this); 
                    }
                }
            };

        }

        p.keyTyped = function(){
            console.log(p.key);
            console.log('key typed');
            missiles.forEach(function (m) {
               m.checkDestroy(); 
            });
        }

        p.windowResized = function () {
            p.resizeCanvas(p.windowWidth, p.windowHeight - 64);
            minDim = (window.innerHeight - 64 > window.innerWidth ? window.innerWidth : window.innerHeight - 64);
        }
    };

    new p5(sketch, document.getElementById('game-view'));
    //console.log('called');
}