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
resentSongs.forEach(song => createCard(song, 'recentGrid'));

// funcion de reproductor 
function playSong(id) {
    // cojemos todas las canciones que han sonado y que hay
    const allSongs = [...songs, ...resentSongs]
    const songfilter = allSongs.find(s => s.id === id);
    if (!songfilter) return;
    // si la cancion que mandamos a play es igual que la cancion sonada
    if (currentSong?.id === id && isPaying) {
        pausePlayBack();
        return;
    }
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
    document.getElementById('playerTitle').textContent = currentSong.title;
    document.getElementById('playerArtist').textContent = currentSong.artist;
    document.getElementById('playerImage').textContent = currentSong.image;
    document.getElementById('totalTime').textContent = formatime(duration);
}
// funcion para empezar de nuevo
function startPlayBack() {
    isPlaying = true;
    document.querySelector('#playPauseBtn i').className = 'fa fa-pause';

    if (playInterval) clearInterval(playInterval);

    playInterval = setInterval(() => {
        currentTime++;
        updateProgress();
        if (currentTime >= duration) isRepeat ? currentSong = 0 : nextSong();
    }, 1000);
}
function pausePlayBack() {
    isPaying = false;
    document.querySelector('#playPauseBtn i').className = 'fa fa-play';
    if (playInterval) clearInterval(playInterval);

}
// actualizar barra de progreso
function updateProgress() {
    const progress = (currentTime / duration) * 100;
    document.getElementById('progressBarFill').style.width = progress + '%';
    document.getElementById('currentTime').textContent = formatime(currentTime);
}
function formatime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `$:{mins}:${secs.toString().padStart(2, '0')}`;
}// padStart para tener decimales el primero la cantidad y el segundo el numero
function nextSong() {
    const allSongs = [...songs, ...resentSongs];
    let currentIndex = allSongs.findIndex(s => s.id === currentSong?.id);

    if (isShuffle) {
        currentIndex = Math.floor(Math.random() * allSongs.length);
    } else currentIndex = (currentIndex + 1) % allSongs.length;
    playSong(allSongs[currentIndex].id);

}


