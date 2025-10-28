const songs = [
    {
        id: 1,
        title: "Veneka",
        artist: "rawayana",
        duration: 454,
        caratula: "../src/assets/images/veneka.webp",
        src: "../src/assets/audio/veneka.audio"
    },
    {
        id: 2,
        title: "Veneka",
        artist: "rawayana",
        duration: 454,
        caratula: "../src/assets/images/veneka.webp",
        src: "../src/assets/audio/veneka.audio"
    }
];

const resentSongs = [
    {
        id: 2,
        title: "The Cypher Effect Mic Check Session",
        artist: "neutro",
        duration: 317,
        caratula: "images/neutro.webp",
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
});