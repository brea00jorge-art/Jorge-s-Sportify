const songs = // creacion de cancion
    [
        {
            id: 1,
            title: "Veneka",
            artist: "rawayana",
            duration: 454,
            caratula: "img/veneka.webp",
            src: "assets\mp3\veneka.mp3"
        }
    ];
const resentSongs = // cancion sonando
    [
        {
            id: 2,
            title: "The Cypher Effect Mic Check Session",
            artist: "neutro",
            duration: 317,
            caratula: "img/neutro.webp",
            src: "assets\mp3\neutro.mp3"
        }
    ];

// estado del reproductor
let currentSong = null,
    isPaying = false,
    currentTime = 0,
    duration = 0,
    volumen = 0.7,
    isShuffle = false,
    isRepeat = false,
    playInterval = null;

function createCard(songs, contineId) { //  creacion de card para la cancion
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-image" style="background-image:url('${songs.caratula}')">
            <div class="play-button" onclick="playSong(${songs.id})">
                <i class="fa-solid fa-play"></i>
            </div>
        </div>
        <div class="card-title">${songs.title}</div>
        <div class="card-subtitle">${songs.artist}</div>
    `
    document.getElementById(contineId).appendChild(card);
}

songs.forEach(song => createCard(song, 'mainGrid'));

