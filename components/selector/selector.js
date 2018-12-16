var selectorContainer = document.getElementById('selector-list-container');
var selectorGameOptions = document.getElementById('selector-game-options');
var selectorPlaceholder = document.getElementById('selector-options-placeholder');
var selectorSongName = document.getElementById('song-name');

var allSongs = fs.readdirSync(url.format({
  pathname: '../music/',
  protocol: 'file:',
  slashes: true
}));
var selectedSong;
var sketch;
var song;
var songVolume;

db.getSettings(function (settings) {
  songVolume = settings.musicVolume / 100;
});

allSongs.forEach(function (songName) {
  var newLi = document.createElement('li');
  newLi.className = 'collection-item';
  newLi.innerText = songName;
  //newLi.setAttribute('onclick', 'selectorClicked(' + songName + ')');
  newLi.onclick = function () {
    sketch = null;
    if (song) {
      song.stop();
    }
    song = null;
    console.log('clicked!');
    sketch = function (p) {
      p.setup = function () {
        p.createCanvas(1, 1);
        song = p.loadSound('../music/' + songName, function () {
          song.setVolume(songVolume);
          song.loop();
        });
      }

      p.draw = function () {

      }
    }

    new p5(sketch, document.getElementById('preview'));
    selectedSong = songName;
    showOptions(songName);

  };
  selectorContainer.appendChild(newLi);

});

function selectorBack() {
  sketch = null;
  if (song) {
    song.stop();
  }
  song = null;
  changePage('home');
}

function playGame() {
  var gameOptions = {};

  sketch = null;
  if (song) {
    song.stop();
  }
  song = null;

  gameOptions.song = selectedSong;

  ipcRenderer.send('playGame', gameOptions);
}

function showOptions(songName) {
  selectorGameOptions.style.display = 'inherit';
  selectorPlaceholder.style.display = 'none';

  selectorSongName.innerText = songName;
}