var musicVolumeSlider = document.getElementById('music-volume');
var musicVolumeValue = document.getElementById('music-volume-value');
var effectVolumeSlider = document.getElementById('effect-volume');
var effectVolumeValue = document.getElementById('effect-volume-value');
var newSettings;

db.getSettings(function (settings) {
    newSettings = settings;

    musicVolumeSlider.value = settings.musicVolume;
    musicVolumeValue.innerText = "Music Volume: " + musicVolumeSlider.value;

    effectVolumeSlider.value = settings.effectVolume;
    effectVolumeValue.innerText = "Effect Volume: " + effectVolumeSlider.value;
});

function saveSettings() {
    newSettings.musicVolume = parseInt(musicVolumeSlider.value);
    newSettings.effectVolume = parseInt(effectVolumeSlider.value);

    db.setSettings(newSettings);
}

musicVolumeSlider.onmousemove = function () {
    musicVolumeValue.innerText = "Music Volume: " + musicVolumeSlider.value;
};

effectVolumeSlider.onmousemove = function () {
    effectVolumeValue.innerText = "Effect Volume: " + effectVolumeSlider.value;
};