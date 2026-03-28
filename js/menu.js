const appShell = document.getElementById("appShell");
const lyricView = document.getElementById("lyricView");
const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const songRow = document.getElementById("songRow");
const todayArt = document.getElementById("todayArt");
const todayTitle = document.getElementById("todayTitle");
const todayArtist = document.getElementById("todayArtist");
const playerArt = document.getElementById("playerArt");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const progressInput = document.getElementById("progressInput");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const repeatButton = document.getElementById("repeatButton");
const queueToggle = document.getElementById("queueToggle");
const queueClose = document.getElementById("queueClose");
const audioPlayer = document.getElementById("audioPlayer");

let songs = [];
let currentSongIndex = 0;
let repeatOne = false;

const fallbackSongs = window.fallbackSongs ?? [];

async function loadSongs() {
  try {
    const response = await fetch("../json/song.json");
    if (!response.ok) {
      throw new Error("Could not load song.json");
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("song.json is empty or invalid");
    }

    return data.map((song, index) => ({
      ...fallbackSongs[index],
      ...song,
      lyrics: song.lyrics ?? fallbackSongs[index]?.lyrics ?? ["Lyrics chưa được thêm cho bài này."],
      lyricTimestamps: song.lyricTimestamps ?? fallbackSongs[index]?.lyricTimestamps ?? []
    }));
  } catch (error) {
    console.warn("song.json could not be loaded, using fallback song data.", error);
    return fallbackSongs;
  }
}

function getCurrentSong() {
  return songs[currentSongIndex];
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
  const gradient = `linear-gradient(90deg, #7d7cff 0%, #4d8dff ${percentage}, rgba(255,255,255,0.18) ${percentage}, rgba(255,255,255,0.18) 100%)`;
  progressInput.style.setProperty("--progress-background", gradient);
}

function renderSongCards() {
  songRow.innerHTML = songs.map((song, index) => `
    <article class="song-card ${index === currentSongIndex ? "is-active" : ""}" data-song-index="${index}">
      <div class="song-card-art" style="background:${song.art}"></div>
      <strong class="song-card-title">${song.title}</strong>
      <span class="song-card-artist">${song.artist}</span>
    </article>
  `).join("");
}

function renderQueue() {
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
  const song = getCurrentSong();
  if (!song) return;

  todayTitle.textContent = song.title;
  todayArtist.textContent = song.artist;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  paintArt(todayArt, song.art);
  paintArt(playerArt, song.art);

  audioPlayer.src = song.src || "";
  renderSongCards();
  renderQueue();
  window.syncLyricView?.(song);
}

function syncPlaybackButtons() {
  const isPlaying = !audioPlayer.paused;
  playButton.classList.toggle("is-playing", isPlaying);
  window.syncLyricPlaybackButtons?.(isPlaying);
}

function syncRepeatButtons() {
  repeatButton.classList.toggle("is-active", repeatOne);
  window.syncLyricRepeatButtons?.(repeatOne);
}

function syncProgressDisplays(progressValue = 0) {
  const now = formatTime(audioPlayer.currentTime);
  const total = formatTime(audioPlayer.duration);
  currentTime.textContent = now;
  durationTime.textContent = total;
  progressInput.value = String(progressValue);
  paintProgress(progressValue);
  window.syncLyricProgressDisplays?.({
    progressValue,
    currentTimeText: now,
    durationText: total
  });
}

function playSong(index) {
  if (!songs.length) return;
  currentSongIndex = index;
  syncCurrentSong();
  if (audioPlayer.src) {
    audioPlayer.play();
  }
}

function togglePlayback() {
  if (!songs.length) return;
  if (!audioPlayer.src) {
    syncCurrentSong();
  }

  if (audioPlayer.paused) {
    if (audioPlayer.src) {
      audioPlayer.play();
    }
    return;
  }

  audioPlayer.pause();
}

function changeTrack(step) {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex + step + songs.length) % songs.length;
  playSong(currentSongIndex);
}

function setRepeatState(nextRepeatState) {
  repeatOne = nextRepeatState;
  audioPlayer.loop = repeatOne;
  syncRepeatButtons();
}

function setQueueOpen(isOpen) {
  queuePanel.classList.toggle("is-open", isOpen);
  queuePanel.setAttribute("aria-hidden", String(!isOpen));
}

function seekToProgress(value) {
  if (!audioPlayer.duration) return;
  audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
  syncProgressDisplays(value);
}

songRow.addEventListener("click", (event) => {
  const card = event.target.closest(".song-card");
  if (!card) return;
  playSong(Number(card.dataset.songIndex));
});

queueToggle.addEventListener("click", () => setQueueOpen(!queuePanel.classList.contains("is-open")));
queueClose.addEventListener("click", () => setQueueOpen(false));

playButton.addEventListener("click", togglePlayback);
prevButton.addEventListener("click", () => changeTrack(-1));
nextButton.addEventListener("click", () => changeTrack(1));
repeatButton.addEventListener("click", () => setRepeatState(!repeatOne));
progressInput.addEventListener("input", () => seekToProgress(Number(progressInput.value)));

audioPlayer.addEventListener("play", syncPlaybackButtons);
audioPlayer.addEventListener("pause", syncPlaybackButtons);
audioPlayer.addEventListener("loadedmetadata", () => syncProgressDisplays(0));
audioPlayer.addEventListener("timeupdate", () => {
  const progressValue = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0;
  syncProgressDisplays(progressValue);
});
audioPlayer.addEventListener("ended", () => {
  if (repeatOne || !songs.length) return;
  changeTrack(1);
});

window.rondoPlayer = {
  appShell,
  lyricView,
  queuePanel,
  audioPlayer,
  getCurrentSong,
  getSongs: () => songs,
  isRepeatOne: () => repeatOne,
  isQueueOpen: () => queuePanel.classList.contains("is-open"),
  changeTrack,
  togglePlayback,
  seekToProgress,
  setQueueOpen,
  setRepeatState,
  syncCurrentSong,
  syncPlaybackButtons,
  syncRepeatButtons,
  syncProgressDisplays
};

async function initPlayer() {
  songs = await loadSongs();
  syncCurrentSong();
  syncPlaybackButtons();
  syncRepeatButtons();
  syncProgressDisplays(0);
}

initPlayer();
