
const songs = [
    {
        id: 1,
        title: "Veneka",
        artist: "Rawayana",
        duration: 454,
        caratula: "../src/assets/images/veneka.webp",
        src: "../src/assets/audio/veneka.audio"
    },
    {
        id: 2,
        title: "Veneka",
        artist: "Rawayana",
        duration: 454,
        caratula: "../src/assets/images/veneka.webp",
        src: "../src/assets/audio/veneka.audio"
    }
];

const resentSongs = [
    {
        id: 2,
        title: "The Cypher Effect Mic Check Session",
        artist: "Neutro",
        duration: 317,
        caratula: "../src/assets/images/neutro.webp",
        src: "../src/assets/audio/neutro.audio"
    }
];

// estado del reproductor
let currentSong = null,
    isPlaying = false,
    currentTime = 0,
    duration = 0,
    volumen = 0.7,
    isShuffle = false,
    isRepeat = false,
    playInterval = null;

function createCard(song, contineId) {
    const card = $('<div>', {
        class: 'card',
        html: `
            <div class="card-image" style="background-image:url('${song.caratula}')">
                <div class="play-button" onclick="playSong(${song.id})">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <div class="card-title">${song.title}</div>
            <div class="card-subtitle">${song.artist}</div>
        `
    });
    $('#' + contineId).append(card);
}

// Inicializar con jQuery
$(document).ready(function () {
    songs.forEach(song => createCard(song, 'mainGrid'));
    resentSongs.forEach(song => createCard(song, 'recentGrid'));
});

// funcion de reproductor 
function playSong(id) {
    const allSongs = [...songs, ...resentSongs]
    const songfilter = allSongs.find(s => s.id === id);
    if (!songfilter) return;
    // si la cancion que mandamos a play es igual que la cancion sonada
    if (currentSong?.id === id && isPlaying) {
        pausePlayBack();
        return;
    }
    //le damos valor de curent a la cancion y atributos
    currentSong = songfilter;
    duration = songfilter.duration;
    currentTime = 0;
    //funciones de refresca las cards y comienza una cancion de nuevo
    updatePlayerUI();
    startPlayBack();
}
// funcion para actualizar la vista del reproductor
function updatePlayerUI() {
    if (!currentSong) return;
    $('#playerTitle').text(currentSong.title);
    $('#playerArtist').text(currentSong.artist);
    $('#playerImage').text(currentSong.caratula);
    $('#totalTime').text(formaTime(duration));
}
// funcion para empezar de nuevo
function startPlayBack() {
    isPlaying = true;
    $('#playPauseBtn i').attr('class', 'fa fa-pause');

    if (playInterval) clearInterval(playInterval);

    playInterval = setInterval(() => {
        currentTime++;
        updateProgress();
        if (currentTime >= duration) isRepeat ? currentSong = 0 : nextSong();
    }, 1000);
}
function pausePlayBack() {
    isPaying = false;
    $('#playPauseBtn i').attr('class', 'fa fa-play');
    if (playInterval) clearInterval(playInterval);
}
function updateProgress() {
    const progress = (currentTime / duration) * 100;
    $('#progressBarFill').css('width', progress + '%');
    $('#currentTime').text(formatTime(currentTime));
}
function formatime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `$:{mins}:${secs.toString().padStart(2, '0')}`
}
function nextSong() {
    const allSongs = [...songs, ...resentSongs];
    let currentIndex = allSongs.findIndex(s => s.id === currentSong?.id);
      if(isShuffle){
        currentIndex = Math.floor(Math.random()*allSongs.length);
    }else currentIndex = (currentIndex + 1) % allSongs.length;
}