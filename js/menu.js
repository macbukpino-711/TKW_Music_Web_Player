const todayArt = document.getElementById("todayArt");
const todayTitle = document.getElementById("todayTitle");
const todayArtist = document.getElementById("todayArtist");
const playerArt = document.getElementById("playerArt");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const songRow = document.getElementById("songRow");
const queueList = document.getElementById("queueList");
const queuePanel = document.getElementById("queuePanel");
const queueToggle = document.getElementById("queueToggle");
const queueClose = document.getElementById("queueClose");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const repeatButton = document.getElementById("repeatButton");
const lyricsButton = document.getElementById("lyricsButton");
const progressInput = document.getElementById("progressInput");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const audioPlayer = document.getElementById("audioPlayer");

let songs = [];
let currentSongIndex = 0;
let repeatOne = false;

async function loadSongs() {
  const response = await fetch("song.json");

  if (!response.ok) {
    throw new Error("Could not load song.json");
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("song.json is empty or invalid");
  }

  return data;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function paintArt(element, art) {
  element.style.background = art;
}

function paintProgress(value) {
  const percentage = `${value}%`;
  progressInput.style.setProperty(
    "--progress-background",
    `linear-gradient(90deg, #7d7cff 0%, #4d8dff ${percentage}, rgba(255, 255, 255, 0.18) ${percentage}, rgba(255, 255, 255, 0.18) 100%)`
  );
}

function renderSongCards() {
  if (songs.length === 0) {
    songRow.innerHTML = "";
    return;
  }

  songRow.innerHTML = songs.map((song, index) => `
    <article class="song-card ${index === currentSongIndex ? "is-active" : ""}" data-song-index="${index}">
      <div class="song-card-art" style="background:${song.art}"></div>
      <strong class="song-card-title">${song.title}</strong>
      <span class="song-card-artist">${song.artist}</span>
    </article>
  `).join("");
}

function renderQueue() {
  if (songs.length === 0) {
    queueList.innerHTML = "";
    return;
  }

  queueList.innerHTML = songs.map((song, index) => `
    <div class="queue-item ${index === currentSongIndex ? "is-active" : ""}">
      <div class="queue-thumb" style="background:${song.art}"></div>
      <div>
        <strong>${song.title}</strong>
        <span>${song.artist}</span>
      </div>
    </div>
  `).join("");
}

function syncCurrentSong() {
  if (songs.length === 0) {
    return;
  }

  const song = songs[currentSongIndex];

  todayTitle.textContent = song.title;
  todayArtist.textContent = song.artist;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  paintArt(todayArt, song.art);
  paintArt(playerArt, song.art);

  audioPlayer.src = song.src;
  renderSongCards();
  renderQueue();
}

function playSong(index) {
  if (songs.length === 0) {
    return;
  }

  currentSongIndex = index;
  syncCurrentSong();
  audioPlayer.play();
}

function togglePlayback() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    return;
  }

  audioPlayer.pause();
}

function setQueueOpen(isOpen) {
  queuePanel.classList.toggle("is-open", isOpen);
  queuePanel.setAttribute("aria-hidden", String(!isOpen));
}

songRow.addEventListener("click", (event) => {
  const card = event.target.closest(".song-card");

  if (!card) {
    return;
  }

  playSong(Number(card.dataset.songIndex));
});

queueToggle.addEventListener("click", () => {
  setQueueOpen(!queuePanel.classList.contains("is-open"));
});

queueClose.addEventListener("click", () => {
  setQueueOpen(false);
});

playButton.addEventListener("click", togglePlayback);

prevButton.addEventListener("click", () => {
  if (songs.length === 0) {
    return;
  }

  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
});

nextButton.addEventListener("click", () => {
  if (songs.length === 0) {
    return;
  }

  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

repeatButton.addEventListener("click", () => {
  repeatOne = !repeatOne;
  audioPlayer.loop = repeatOne;
  repeatButton.classList.toggle("is-active", repeatOne);
});

lyricsButton.addEventListener("click", () => {
  if (songs.length === 0) {
    return;
  }

  const song = songs[currentSongIndex];
  window.alert(`Lyrics for ${song.title} by ${song.artist} will be added here.`);
});

progressInput.addEventListener("input", () => {
  if (!audioPlayer.duration) {
    return;
  }

  const nextTime = (Number(progressInput.value) / 100) * audioPlayer.duration;
  audioPlayer.currentTime = nextTime;
  paintProgress(Number(progressInput.value));
});

audioPlayer.addEventListener("play", () => {
  playButton.classList.add("is-playing");
});

audioPlayer.addEventListener("pause", () => {
  playButton.classList.remove("is-playing");
});

audioPlayer.addEventListener("loadedmetadata", () => {
  durationTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audioPlayer.currentTime);

  if (audioPlayer.duration) {
    const progressValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressInput.value = String(progressValue);
    paintProgress(progressValue);
  }
});

audioPlayer.addEventListener("ended", () => {
  if (repeatOne) {
    return;
  }

  if (songs.length === 0) {
    return;
  }

  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

async function initPlayer() {
  try {
    songs = await loadSongs();
    currentSongIndex = 0;
    syncCurrentSong();
    paintProgress(0);
  } catch (error) {
    console.error(error);
    songRow.innerHTML = "<p style='color:#a3a9c9'>Khong the tai du lieu bai hat tu song.json.</p>";
    queueList.innerHTML = "";
  }
}

initPlayer();
