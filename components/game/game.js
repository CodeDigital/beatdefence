var pauseMenu = document.getElementById('pause-menu');
var pauseSong = document.getElementById('pause-song');
var isPaused = false;

ipcRenderer.send('sendOptions');

ipcRenderer.on('gameOptions', function (e, gameOptions) {
    console.log(gameOptions);
    pauseSong.innerText = 'Now Playing "' + gameOptions.song + '"';
});

mtrap.bind('esc', function() {
    if(isPaused){
        unpause();
        isPaused = !isPaused;
    }else{
        pause();
        isPaused = !isPaused;
    }
});

function unpause() {
    pauseMenu.style.display = 'none';
}

function pause() {
    pauseMenu.style.display = 'block';
}