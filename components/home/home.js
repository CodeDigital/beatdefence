allSongs = fs.readdirSync(url.format({
    pathname: '../music/',
    protocol: 'file:',
    slashes: true
  }));

console.log(allSongs);
var song;
var fft, amplitude;
var freqs = 64;
var reps = 3;
var dAngle = (Math.PI) / (reps*freqs);
var weight = 2;

function menuClicked(newPage){
    song.onended(function() {

    });
    song.stop();
    changePage(newPage);
}


var sketch1 = function(p) {

    p.setup = function() {
        fft = new p5.FFT();
        amplitude = new p5.Amplitude();
        p.createCanvas(p.windowWidth/4,p.windowHeight - 70);
        newSong();
    }

    p.draw = function() {
        p.background("#111111");
        p.translate(p.width,p.height/1.75);
        //p.translate(p.width/2,p.height/2);

        var amps = fft.analyze(freqs);
        //console.log(amps);
        var amp = amplitude.getLevel();
        var total = p.map(amp,0,1,(p.height/4)-10,(p.height/4)+10);
        //p.noStroke();
        //p.ellipse(0,0,2*total);
        p.rotate(Math.PI);
       // p.push();
        p.stroke("#db7093");

        for(var a = 0;a<reps;a++){
        for (var i = 0; i < freqs; i++){
            p.rotate(-1 * dAngle);
            p.strokeWeight(weight);

            if(amps[i] > 100){
            var y = p.map(amps[i],100,255,0,50);
            }else if(amps[i] > 50){
            var y = p.map(amps[i],50,255,0,50);
            }else{
            var y = p.map(amps[i],0,255,0,50);
            }

            //console.log(y);
            p.line(0,total-(y/2),0,(y + total));
            //p.line(0,total,0,(y + total));
        }
    }

        //p.rotate(Math.PI);

        // for (var i = 0; i < freqs; i++){
        //     p.rotate(dAngle);
        //     p.strokeWeight(10);
            
        //     if(amps[i] > 100){
        //         var y = p.map(amps[i],100,255,0,100);
        //         }else if(amps[i] > 50){
        //         var y = p.map(amps[i],50,255,0,100);
        //         }else{
        //         var y = p.map(amps[i],0,255,0,100);
        //         }
    
        //     //console.log(y);

        //     p.line(0,total,0,(y + total));
        // }

        //p.noStroke();
        p.noFill();
        p.ellipse(0,0,2*total);

        //p.pop();
        
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth/4,p.windowHeight - 70);
    }

    function newSong(){
        var nSong = p.random(allSongs);

        var menuSong = document.getElementById('menu-song');
        console.log(menuSong);
        menuSong.innerText = 'Now Playing "' + nSong + '"';

        song = p.loadSound('../music/' + nSong, function() {
            song.play();
            song.onended(function(){
                newSong();
            });
        });
    }
    
}

var sketch2 = function(p) {

    p.setup = function() {
        fft = new p5.FFT();
        amplitude = new p5.Amplitude();
        p.createCanvas(p.windowWidth/4,p.windowHeight - 70);
        //newSong();
    }

    p.draw = function() {
        p.background("#111111");
        p.translate(0,p.height/1.75);
        //p.translate(p.width/2,p.height/2);

        var amps = fft.analyze(freqs);
        //console.log(amps);
        var amp = amplitude.getLevel();
        var total = p.map(amp,0,1,(p.height/4)-10,(p.height/4)+10);

        changeMenu(total);

        //p.noStroke();
        //p.ellipse(0,0,2*total);
        p.rotate(Math.PI);
        //p.rotate(2*dAngle);
       // p.push();
        p.stroke("#db7093");

        for(var a = 0;a<reps;a++){
        for (var i = 0; i < freqs; i++){
            p.rotate(dAngle);
            p.strokeWeight(weight);

            if(amps[i] > 100){
            var y = p.map(amps[i],100,255,0,50);
            }else if(amps[i] > 50){
            var y = p.map(amps[i],50,255,0,50);
            }else{
            var y = p.map(amps[i],0,255,0,50);
            }

            //console.log(y);

            p.line(0,total-(y/2),0,(y + total));
            //p.line(0,total,0,(y + total));

        }
    }

        //p.rotate(Math.PI);

        // for (var i = 0; i < freqs; i++){
        //     p.rotate(dAngle);
        //     p.strokeWeight(10);
            
        //     if(amps[i] > 100){
        //         var y = p.map(amps[i],100,255,0,100);
        //         }else if(amps[i] > 50){
        //         var y = p.map(amps[i],50,255,0,100);
        //         }else{
        //         var y = p.map(amps[i],0,255,0,100);
        //         }
    
        //     //console.log(y);

        //     p.line(0,total,0,(y + total));
        // }

        //p.noStroke();
        p.noFill();
        p.ellipse(0,0,2*total);

        //p.pop();
        
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth/4,p.windowHeight - 70);
    }

    function newSong(){
        var nSong = p.random(allSongs);

        song = p.loadSound('../music/' + nSong, function() {
            song.play();
            song.onended(function(){
                newSong();
            });
        });
    }
    
}

function changeMenu(disp){
    var menu = document.getElementById('menu');
    menu.style.marginTop = "calc(" + 3*disp + "px - 60vh)";
}

new p5(sketch2, document.getElementById('main-canvas'));
new p5(sketch1, document.getElementById('canvas1'));