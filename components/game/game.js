var pauseMenu = document.getElementById('pause-menu');
var pauseSong = document.getElementById('pause-song');
var pauseScripts = document.getElementById('scripts');
var gameView = document.getElementById('game-view');
var isPaused = false;
var musicVolume;
var effectVolume;

ipcRenderer.once('gameOptions', function (e, gameOptions) {
    //console.log('gameoption');
    db.getSettings(function (settings) {

        musicVolume = settings.musicVolume;
        effectVolume = settings.effectVolume;
        console.log(gameOptions);
        pauseSong.innerText = 'Now Playing "' + gameOptions.song + '"';
        
        switch (gameOptions.gamemode) {
            case 'classic':
                classicInitialise();
                break;
        
            default:
                classicInitialise();
                break;
        }

        loadSong(gameOptions.song);
    });
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
    gameUnpause();
    pauseMenu.style.display = 'none';
    gameView.style.filter = 'none';
}

function pause() {
    gamePause();
    pauseMenu.style.display = 'block';
    gameView.style.filter = 'blur(10px)';
}

function returnHome() {
    if(song){
        song.stop();
    }else{
        mainSong.stop();
        subSong.stop();
    }
    
    cease();
    sketch = null;
    gameAdd = null;
    gameView.innerHTML = '';
    $('#game-view').empty();
    changePage('home');
}