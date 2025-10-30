const songs = [
    {
        id: 1,
        title: "Veneka",
        artist: "Rawayana",
        duration: 454,
        caratula: "../src/assets/images/veneka.webp",
        src: "../src/assets/audio/veneka.mp3"
    },
    {
        id: 2,
        title: "The Cypher Effect Mic Check Session",
        artist: "Neutro",
        duration: 317,
        caratula: "../src/assets/images/neutro.webp",
        src: "../src/assets/audio/neutro.mp3"
    }
];

let currentSong = null,
    isPlaying = false,
    currentTime = 0,
    duration = 0,
    volumen = 0.7,
    isShuffle = false,
    isRepeat = false,
    playInterval = null;

function createCard(song, containerId) {
    const card = $(`
        <div class="card">
            <div class="card-image" style="background-image:url('${song.caratula}')">
                <div class="play-button" onclick="playSong(${song.id})">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <div class="card-title">${song.title}</div>
            <div class="card-subtitle">${song.artist}</div>
        </div>
    `);
    $('#' + containerId).append(card);
}

$(document).ready(function () {
    songs.forEach(song => createCard(song, 'mainGrid'));
});

function playSong(id) {
    const song = songs.find(s => s.id === id);
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

function updatePlayerUI() {
    if (!currentSong) return;
    $('#playerTitle').text(currentSong.title);
    $('#playerArtist').text(currentSong.artist);
    $('#playerImage').css('background-image', `url('${currentSong.caratula}')`);
    $('#totalTime').text(formatTime(duration));
}

function startPlayBack() {
    isPlaying = true;
    $('#playPauseBtn i').attr('class', 'fa fa-pause');
    if (playInterval) clearInterval(playInterval);
    playInterval = setInterval(() => {
        currentTime++;
        updateProgress();
        if (currentTime >= duration) nextSong();
    }, 1000);
}

function pausePlayBack() {
    isPlaying = false;
    $('#playPauseBtn i').attr('class', 'fa fa-play');
    if (playInterval) clearInterval(playInterval);
}

function updateProgress() {
    const progress = (currentTime / duration) * 100;
    $('#progressBarFill').css('width', progress + '%');
    $('#currentTime').text(formatTime(currentTime));
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function nextSong() {
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex].id);
}

function prevSong() {
    if (currentTime > 3) {
        currentTime = 0;
        updateProgress();
        return;
    }
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    playSong(songs[prevIndex].id);
}

$('#playPauseBtn').on('click', () => {
    if (!currentSong) return playSong(songs[0].id);
    if (isPlaying) pausePlayBack();
    else startPlayBack();
});

$('#nextBtn').on('click', nextSong);
$('#prevBtn').on('click', prevSong);
$('#shuffleBtn').on('click', function () {
    isShuffle = !isShuffle;
    this.style.color = isShuffle ? 'var(--color-Spotify)' : 'var(--text-secondary)';
});
$('#repeatBtn').on('click', function () {
    isRepeat = !isRepeat;
    this.style.color = isRepeat ? 'var(--color-Spotify)' : 'var(--text-secondary)';
});

$('#progressBar').on('click', function (e) {
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    currentTime = percent * duration;
    updateProgress();
});

$('#volumenBar').on('click', function (e) {
    const rect = this.getBoundingClientRect();
    volumen = (e.clientX - rect.left) / rect.width;
    updateVolumen();
});

function updateVolumen() {
    $('#volumenBarFill').css('width', (volumen * 100) + '%');
    const icon = $('#volumenBtn i');
    if (volumen === 0) icon.attr('class', 'fas fa-volume-mute');
    else if (volumen < 0.5) icon.attr('class', 'fas fa-volume-down');
    else icon.attr('class', 'fas fa-volume-up');
}

// busqueda
$('#searchInput').on('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const allSongs = [...songs, ...resentSongs];
    const filtered = allSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm)
    );

    $('#mainGrid').empty();

    const results = searchTerm ? filtered : allSongs;
    results.forEach(song => createCard(song, 'mainGrid'));
});
