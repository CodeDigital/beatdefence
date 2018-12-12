var startHome = function (a) {

    a.setup() = function(){
        var c = a.createCanvas(1000, 1000);
        c.parent('main-canvas');
    }

    a.draw() = function(){
        a.background(200, 100, 0);
        a.ellipse(10, 10, 100, 2000);
        a.print('hi');
    }

};