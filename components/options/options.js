const db = require('../database/database.js');

var musicVolumeSlider = document.getElementById('music-volume');
var musicVolumeValue = document.getElementById('music-volume-value');

document.onload = function() {
    db.getSettings(function() {

    });
};

function saveSettings(){
    
}

musicVolumeSlider.onmousemove = function() {
    console.log(musicVolumeSlider.value);
    musicVolumeValue.innerText = "Music Volume: " + musicVolumeSlider.value;
};

musicVolumeSlider.onchange = function() {
    console.log(musicVolumeSlider.value);
};
console.log(musicVolumeSlider.value);
