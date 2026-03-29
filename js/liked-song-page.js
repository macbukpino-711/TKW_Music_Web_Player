const appShell = document.getElementById("appShell");
const lyricView = document.getElementById("lyricView");
const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const likedList = document.getElementById("likedList");
const likedEmpty = document.getElementById("likedEmpty");
const likedCount = document.getElementById("likedCount");
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
const likeButton = document.getElementById("likeButton");
const lyricLikeButton = document.getElementById("lyricLikeButton");
const queueToggle = document.getElementById("queueToggle");
const queueClose = document.getElementById("queueClose");
const audioPlayer = document.getElementById("audioPlayer");

let allSongs = [];
let likedQueue = []; // songs currently in liked list
let currentIndex = 0;
let repeatOne = false;

const fallbackSongs = window.fallbackSongs ?? [];

async function loadAllSongs() {
  try {
    const response = await fetch("../json/song.json");
    if (!response.ok) throw new Error("Could not load song.json");
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Empty");
    return data.map((song, i) => ({
      ...fallbackSongs[i],
      ...song,
      lyrics: song.lyrics ?? fallbackSongs[i]?.lyrics ?? ["Lyrics chưa được thêm cho bài này."],
      lyricTimestamps: song.lyricTimestamps ?? fallbackSongs[i]?.lyricTimestamps ?? []
    }));
  } catch {
    return fallbackSongs;
  }
}

function getCurrentSong() {
  return likedQueue[currentIndex];
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function paintArt(element, art) {
  element.style.background = art;
}

function paintProgress(value) {
  const pct = `${value}%`;
  progressInput.style.setProperty(
    "--progress-background",
    `linear-gradient(90deg, #7d7cff 0%, #4d8dff ${pct}, rgba(255,255,255,0.18) ${pct}, rgba(255,255,255,0.18) 100%)`
  );
}

function renderLikedList() {
  const ids = window.likedSongs.getLikedIds();
  likedQueue = allSongs.filter((s) => ids.includes(s.id));

  const count = likedQueue.length;
  likedCount.textContent = `${count} bài hát`;

  if (count === 0) {
    likedEmpty.hidden = false;
    likedList.querySelectorAll(".liked-item").forEach((el) => el.remove());
    renderQueue();
    return;
  }

  likedEmpty.hidden = true;

  // rebuild list
  likedList.querySelectorAll(".liked-item").forEach((el) => el.remove());
  likedQueue.forEach((song, index) => {
    const item = document.createElement("article");
    item.className = `liked-item ${index === currentIndex ? "is-active" : ""}`;
    item.dataset.likedIndex = index;
    item.innerHTML = `
      <div class="liked-item-art" style="background:${song.art}"></div>
      <div class="liked-item-meta">
        <h2>${song.title}</h2>
        <p>${song.artist}</p>
      </div>
      <button class="liked-item-unlike" data-song-id="${song.id}" aria-label="Unlike">
        <i class="fa-solid fa-heart"></i>
      </button>
    `;
    likedList.appendChild(item);
  });

  renderQueue();
}

function renderQueue() {
  queueList.innerHTML = likedQueue.map((song, index) => `
    <div class="queue-item ${index === currentIndex ? "is-active" : ""}">
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
  if (!song) {
    playerTitle.textContent = "–";
    playerArtist.textContent = "–";
    playerArt.style.background = "rgba(255,255,255,0.06)";
    audioPlayer.src = "";
    return;
  }

  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  paintArt(playerArt, song.art);
  audioPlayer.src = song.src || "";

  // highlight active item
  likedList.querySelectorAll(".liked-item").forEach((el, i) => {
    el.classList.toggle("is-active", i === currentIndex);
  });

  renderQueue();
  window.syncLyricView?.(song);
  syncLikeButtonUI(song.id);
}

function syncLikeButtonUI(songId) {
  const liked = window.likedSongs.isLiked(songId);
  likeButton.classList.toggle("is-liked", liked);
  if (lyricLikeButton) {
    lyricLikeButton.className = liked
      ? "fa-solid fa-heart like-icon like-icon--filled"
      : "fa-regular fa-heart like-icon like-icon--empty";
  }
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
  window.syncLyricProgressDisplays?.({ progressValue, currentTimeText: now, durationText: total });
}

function playSong(index) {
  if (!likedQueue.length) return;
  currentIndex = index;
  syncCurrentSong();
  if (audioPlayer.src) audioPlayer.play();
}

function togglePlayback() {
  if (!likedQueue.length) return;
  if (!audioPlayer.src) { syncCurrentSong(); return; }
  audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
}

function changeTrack(step) {
  if (!likedQueue.length) return;
  currentIndex = (currentIndex + step + likedQueue.length) % likedQueue.length;
  playSong(currentIndex);
}

function setRepeatState(next) {
  repeatOne = next;
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

// --- Event listeners ---
likedList.addEventListener("click", (e) => {
  // unlike button
  const unlikeBtn = e.target.closest(".liked-item-unlike");
  if (unlikeBtn) {
    const songId = Number(unlikeBtn.dataset.songId);
    window.likedSongs.toggleLike(songId);
    const wasPlaying = !audioPlayer.paused;
    const prevSong = getCurrentSong();
    renderLikedList();
    // if removed song was playing, stop or move to next
    if (prevSong && prevSong.id === songId) {
      if (likedQueue.length === 0) {
        audioPlayer.pause();
        audioPlayer.src = "";
        syncCurrentSong();
      } else {
        currentIndex = Math.min(currentIndex, likedQueue.length - 1);
        syncCurrentSong();
        if (wasPlaying && audioPlayer.src) audioPlayer.play();
      }
    }
    return;
  }

  // play song
  const item = e.target.closest(".liked-item");
  if (!item) return;
  playSong(Number(item.dataset.likedIndex));
});

queueToggle.addEventListener("click", () => setQueueOpen(!queuePanel.classList.contains("is-open")));
queueClose.addEventListener("click", () => setQueueOpen(false));
playButton.addEventListener("click", togglePlayback);
prevButton.addEventListener("click", () => changeTrack(-1));
nextButton.addEventListener("click", () => changeTrack(1));
repeatButton.addEventListener("click", () => setRepeatState(!repeatOne));
progressInput.addEventListener("input", () => seekToProgress(Number(progressInput.value)));

likeButton.addEventListener("click", () => {
  const song = getCurrentSong();
  if (!song) return;
  window.likedSongs.toggleLike(song.id);
  renderLikedList();
  // keep currentIndex valid
  currentIndex = Math.min(currentIndex, Math.max(likedQueue.length - 1, 0));
  syncLikeButtonUI(song.id);
});

if (lyricLikeButton) {
  lyricLikeButton.addEventListener("click", () => {
    const song = getCurrentSong();
    if (!song) return;
    window.likedSongs.toggleLike(song.id);
    renderLikedList();
    currentIndex = Math.min(currentIndex, Math.max(likedQueue.length - 1, 0));
    syncLikeButtonUI(song.id);
  });
}

audioPlayer.addEventListener("play", syncPlaybackButtons);
audioPlayer.addEventListener("pause", syncPlaybackButtons);
audioPlayer.addEventListener("loadedmetadata", () => syncProgressDisplays(0));
audioPlayer.addEventListener("timeupdate", () => {
  const val = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0;
  syncProgressDisplays(val);
});
audioPlayer.addEventListener("ended", () => {
  if (repeatOne || !likedQueue.length) return;
  changeTrack(1);
});

// expose for lyric.js
window.rondoPlayer = {
  appShell,
  lyricView,
  queuePanel,
  audioPlayer,
  getCurrentSong,
  getSongs: () => likedQueue,
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

async function init() {
  allSongs = await loadAllSongs();
  renderLikedList();
  syncCurrentSong();
  syncPlaybackButtons();
  syncRepeatButtons();
  syncProgressDisplays(0);
}

init();
