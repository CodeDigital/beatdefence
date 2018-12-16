ipcRenderer.send('sendOptions');

ipcRenderer.on('gameOptions', function (e, gameOptions) {
    console.log(gameOptions);
});