//process.env.NODE_ENV = "prod";
process.env.NODE_ENV = "dev";

//Requiring node modules.
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');
const menu = new Menu();
const url = require('url');
const path = require('path');

//app.disableHardwareAcceleration();

app.on("ready", function () {

    let window = new BrowserWindow({
        titleBarStyle: 'Beat Defence',
        frame: false,
        width: 1280,
        height: 720,
        show: false,
        minHeight: 600,
        minWidth: 800
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'components/main.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.webContents.setFrameRate(144);

    if (process.env.NODE_ENV == 'dev') {
        window.webContents.openDevTools();
    }

    window.on('ready-to-show', function () {
        window.show();
        window.webContents.send('home');
    });

    ipcMain.on('playGame', function (e, gameOptions) {
        window.webContents.send('game');
        ipcMain.on('sendOptions', function () {
            gameOptions.menu = menu;
            window.webContents.send('gameOptions', gameOptions);

        });
    });

});

//IDEA

// Make it so to destroy the missile you have to deploy the shield, which only activates for 1 beat. So you have to time it pretty well.
// The missiles can still be destroyed if the beat is slightly missed (maybe missile length/killability offbeat is determined by player selected difficulty.)