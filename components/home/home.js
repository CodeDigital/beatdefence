p5.disableFriendlyErrors = true; // disables FES

var menu = document.getElementById('menu');

var allSongs = fs.readdirSync(url.format({
    pathname: '../music/',
    protocol: 'file:',
    slashes: true
}));

var song;
var fft, amplitude;
var freqs = 64;
var reps = 3;
var dAngle = (Math.PI) / (reps * freqs);
var weight = 2;
var musicVolume;
var volumeRatio = 1;
var sk1, sk2;
var minDim = (window.innerHeight > window.innerWidth ? window.innerWidth / 2 : window.innerHeight);
var cease1 = function () {};
var cease2 = function () {};

function menuClicked(newPage) {
    cease1();
    cease2();
    sketch1 = null;
    sketch2 = null;
    sk1 = null;
    sk2 = null;
    //song.pause();
    song.onended(function () {
        console.log('ended');
    });
    song.stop();
    song = null;
    changePage(newPage);
}


var sketch1 = function (p) {

    cease1 = function () {
        song.onended(function() {
            console.log('song ended');
        });
        song.stop();
        p.remove();
    }

    p.setup = function () {
        fft = new p5.FFT();
        amplitude = new p5.Amplitude();
        p.createCanvas(window.innerWidth / 4, window.innerHeight - 70);

        newSong();
    }

    p.draw = function () {
        p.frameRate(144);
        p.background("#111111");
        p.translate(p.width, p.height / 1.82);

        var amps = fft.analyze(freqs);

        var amp = amplitude.getLevel();
        var total = p.map(amp, 0, 1, (minDim / 4) - 10, (minDim / 4) + 10);

        p.rotate(Math.PI);
        p.stroke("#db7093");

        for (var a = 0; a < reps; a++) {
            for (var i = 0; i < freqs; i++) {
                p.rotate(-1 * dAngle);
                p.strokeWeight(weight);

                // if (amps[i] > 100) {
                //     var y = p.map(amps[i], 100, 255, 0, 50);
                // } else if (amps[i] > 50) {
                //     var y = p.map(amps[i], 50, 255, 0, 50);
                // } else {
                //     var y = p.map(amps[i], 0, 255, 0, 50);
                // }

                y = p.map(Math.pow(amps[i] * (p.map(volumeRatio, 0, 1, 1.22, 1)), 3), 0, Math.pow(255, 3), 0, minDim / 10);

                p.line(0, total - (y / 2), 0, (y + total));;
            }
        }
        p.noFill();
        p.ellipse(0, 0, 2 * total);
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth / 4, p.windowHeight - 70);
        minDim = (window.innerHeight > window.innerWidth ? window.innerWidth / 2 : window.innerHeight);
    }

    function newSong() {
        var nSong = p.random(allSongs);
        console.log('loaded new Song');
        var menuSong = document.getElementById('menu-song');
        menuSong.innerText = 'Now Playing "' + nSong + '"';

        song = p.loadSound('../music/' + nSong, function () {
            volumeRatio = musicVolume / 100;
            song.setVolume(volumeRatio);
            song.play();
            song.onended(function () {
                newSong();
            });
        });
    }

}

var sketch2 = function (p) {

    cease2 = function () {
        p.remove();
    }

    p.resizeCanvas(p.windowWidth / 4, p.windowHeight - 70);

    p.setup = function () {
        fft = new p5.FFT();
        amplitude = new p5.Amplitude();
        p.createCanvas(window.innerWidth / 4, window.innerHeight - 70);
    }

    p.draw = function () {
        p.frameRate(144);
        p.background("#111111");
        p.translate(0, p.height / 1.82);

        var amps = fft.analyze(freqs);
        var amp = amplitude.getLevel();
        var total = p.map(amp, 0, 1, (minDim / 4) - 10, (minDim / 4) + 10);

        changeMenu(amp);

        p.rotate(Math.PI);
        p.stroke("#db7093");

        for (var a = 0; a < reps; a++) {
            for (var i = 0; i < freqs; i++) {
                p.rotate(dAngle);
                p.strokeWeight(weight);

                // if (amps[i] > 100) {
                //     var y = p.map(amps[i], 100, 255, 0, 50);
                // } else if (amps[i] > 50) {
                //     var y = p.map(amps[i], 50, 255, 0, 50);
                // } else {
                //     var y = p.map(amps[i], 0, 255, 0, 50);
                // }

                y = p.map(Math.pow(amps[i] * (p.map(volumeRatio, 0, 1, 1.22, 1)), 3), 0, Math.pow(255, 3), 0, minDim / 10);

                p.line(0, total - (y / 2), 0, (y + total));
            }
        }

        p.noFill();
        p.ellipse(0, 0, 2 * total);
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth / 4, p.windowHeight - 70);
        minDim = (window.innerHeight > window.innerWidth ? window.innerWidth / 2 : window.innerHeight);
    }

}

function changeMenu(disp) {
    menu.style.marginTop = "calc(" + -5 * disp + "vh + 4vh)";
}

db.getSettings(function (settings) {

    musicVolume = settings.musicVolume;
    sk1 = new p5(sketch2, document.getElementById('main-canvas'));
    sk2 = new p5(sketch1, document.getElementById('canvas1'));

});