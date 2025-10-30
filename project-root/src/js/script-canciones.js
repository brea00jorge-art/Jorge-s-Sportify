// 🎵 Datos de canciones
const songs = [
    {
        id: 1,
        title: "Veneka",
        artist: "Rawayana",
        duration: 454,
        caratula: "img/veneka.webp",
        src: "assets/mp3/veneka.mp3"
    }
];

const resentSongs = [
    {
        id: 2,
        title: "The Cypher Effect Mic Check Session",
        artist: "Neutro",
        duration: 317,
        caratula: "img/neutro.webp",
        src: "assets/mp3/neutro.mp3"
    }
];

// 🎚️ Estado del reproductor
let currentSong = null,
    isPlaying = false,
    currentTime = 0,
    duration = 0,
    volumen = 0.7,
    isShuffle = false,
    isRepeat = false,
    playInterval = null;

// 🎶 Crear tarjetas de canciones
function createCard(song, containerId) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-image" style="background-image:url('${song.caratula}')">
            <div class="play-button" onclick="playSong(${song.id})">
                <i class="fa-solid fa-play"></i>
            </div>
        </div>
        <div class="card-title">${song.title}</div>
        <div class="card-subtitle">${song.artist}</div>
    `;
    document.getElementById(containerId).appendChild(card);
}

// 🧱 Cargar canciones
songs.forEach(song => createCard(song, 'mainGrid'));
resentSongs.forEach(song => createCard(song, 'recentGrid'));

// ▶️ Reproducir canción
function playSong(id) {
    const allSongs = [...songs, ...resentSongs];
    const song = allSongs.find(s => s.id === id);
    if (!song) return;

    if (currentSong?.id === id && isPlaying) {
        pausePlayBack();
        return;
    }

    currentSong = song;
    duration = song.duration;
    currentTime = 0;

    updatePlayerUI();
    startPlayBack();
}

// 🧩 Actualizar la vista del reproductor
function updatePlayerUI() {
    if (!currentSong) return;
    document.getElementById('playerTitle').textContent = currentSong.title;
    document.getElementById('playerArtist').textContent = currentSong.artist;
    document.getElementById('playerImage').style.backgroundImage = `url('${currentSong.caratula}')`;
    document.getElementById('totalTime').textContent = formatTime(duration);
}

// ▶️ Iniciar reproducción simulada
function startPlayBack() {
    isPlaying = true;
    document.querySelector('#playPauseBtn i').className = 'fa fa-pause';

    if (playInterval) clearInterval(playInterval);

    playInterval = setInterval(() => {
        currentTime++;
        updateProgress();
        if (currentTime >= duration) {
            clearInterval(playInterval);
            if (isRepeat) playSong(currentSong.id);
            else nextSong();
        }
    }, 1000);
}

// ⏸️ Pausar reproducción
function pausePlayBack() {
    isPlaying = false;
    document.querySelector('#playPauseBtn i').className = 'fa fa-play';
    if (playInterval) clearInterval(playInterval);
}

// 🔁 Progreso
function updateProgress() {
    const progress = (currentTime / duration) * 100;
    document.getElementById('progressBarFill').style.width = progress + '%';
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

// ⏱️ Formato de tiempo
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ⏭️ Siguiente canción
function nextSong() {
    const allSongs = [...songs, ...resentSongs];
    let currentIndex = allSongs.findIndex(s => s.id === currentSong?.id);
    currentIndex = isShuffle
        ? Math.floor(Math.random() * allSongs.length)
        : (currentIndex + 1) % allSongs.length;
    playSong(allSongs[currentIndex].id);
}

// ⏮️ Canción anterior
function prevSong() {
    if (currentTime > 3) {
        currentTime = 0;
        updateProgress();
        return;
    }
    const allSongs = [...songs, ...resentSongs];
    let currentIndex = allSongs.findIndex(s => s.id === currentSong?.id);
    currentIndex = currentIndex <= 0 ? allSongs.length - 1 : currentIndex - 1;
    playSong(allSongs[currentIndex].id);
}

// 🎛️ Controles del reproductor
document.getElementById('playPauseBtn').addEventListener('click', () => {
    if (!currentSong) return playSong(songs[0].id);
    if (isPlaying) pausePlayBack();
    else startPlayBack();
});

document.getElementById('nextBtn').addEventListener('click', nextSong);
document.getElementById('prevBtn').addEventListener('click', prevSong);

document.getElementById('shuffleBtn').addEventListener('click', function () {
    isShuffle = !isShuffle;
    this.style.color = isShuffle ? 'var(--color-Spotify)' : 'var(--text-secondary)';
});

document.getElementById('repeatBtn').addEventListener('click', function () {
    isRepeat = !isRepeat;
    this.style.color = isRepeat ? 'var(--color-Spotify)' : 'var(--text-secondary)';
});

// 🎚️ Barra de progreso
document.getElementById('progressBar').addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    currentTime = percent * duration;
    updateProgress();
});

// 🔊 Control de volumen
document.getElementById('volumenBar').addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    volumen = (e.clientX - rect.left) / rect.width;
    updateVolumen();
});

function updateVolumen() {
    document.getElementById('volumenBarFill').style.width = (volumen * 100) + '%';
    const volumeIcon = document.querySelector('#volumenBtn i');
    if (volumen === 0) volumeIcon.className = 'fas fa-volume-mute';
    else if (volumen < 0.5) volumeIcon.className = 'fas fa-volume-down';
    else volumeIcon.className = 'fas fa-volume-up';
}

// 🔇 Botón de mute
document.getElementById('volumenBtn').addEventListener('click', function () {
    if (volumen > 0) {
        this.dataset.lastVolume = volumen;
        volumen = 0;
    } else volumen = parseFloat(this.dataset.lastVolume) || 0.7;
    updateVolumen();
});

// busqueda
document.getElementById('searchInput').addEventListener('input',
    function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const allSongs = [...songs, ...resentSongs];
        const filtered = allSongs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );

        // Limpiar contenedor
        const grid = document.getElementById('mainGrid');
        grid.innerHTML = '';

        // Si hay texto, muestra filtrados; si no, muestra todos
        const results = searchTerm ? filtered : allSongs;
        results.forEach(song => createCard(song, 'mainGrid'));
    });
