const appShell = document.getElementById("appShell");
const lyricView = document.getElementById("lyricView");
const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const songRow = document.getElementById("songRow");
const popularSongs = document.getElementById("popularSongs");
const popularArtists = document.getElementById("popularArtists");
const songSearch = document.getElementById("songSearch");
const searchSummary = document.getElementById("searchSummary");
const todayArt = document.getElementById("todayArt");
const todayArtCover = document.getElementById("todayArtCover");
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

const audioPlayer = document.getElementById("audioPlayer");
const likeButton = document.getElementById("likeButton");
const lyricLikeButton = document.getElementById("lyricLikeButton");

let songs = [];
let currentSongIndex = 0;
let repeatOne = false;
let searchQuery = "";
let lastPlaybackRecordedSongId = null;

const fallbackSongs = window.fallbackSongs ?? [];

async function loadSongs() {
  try {
    const response = await fetch("../song.json");
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

function normalizeText(value) {
  return (value ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getFilteredSongs() {
  if (!searchQuery) {
    return songs;
  }

  const normalizedQuery = normalizeText(searchQuery);
  return songs.filter((song) => {
    const titleMatch = normalizeText(song.title).includes(normalizedQuery);
    const artistMatch = normalizeText(song.artist).includes(normalizedQuery);
    return titleMatch || artistMatch;
  });
}

function getPopularSongs() {
  return songs.slice(0, 5);
}

function getPopularArtists() {
  const artistMap = new Map();

  songs.forEach((song, index) => {
    const existing = artistMap.get(song.artist);
    if (existing) {
      existing.count += 1;
      return;
    }

    artistMap.set(song.artist, {
      name: song.artist,
      count: 1,
      art: song.art,
      firstIndex: index
    });
  });

  return [...artistMap.values()]
    .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex)
    .slice(0, 6);
}

function updateSearchSummary(filteredSongs) {
  if (!searchSummary) {
    return;
  }

  if (!searchQuery) {
    searchSummary.textContent = `Tất cả bài hát (${songs.length})`;
    return;
  }

  searchSummary.textContent = `Tìm thấy ${filteredSongs.length} kết quả cho "${searchQuery}"`;
}

function renderSongCards() {
  const filteredSongs = getFilteredSongs();
  updateSearchSummary(filteredSongs);

  if (!filteredSongs.length) {
    songRow.innerHTML = '<div class="empty-state">Không tìm thấy bài hát hoặc nghệ sĩ phù hợp.</div>';
    return;
  }

  songRow.innerHTML = filteredSongs.map((song) => {
    const index = songs.findIndex((item) => item.id === song.id);
    return `
      <article class="song-card ${index === currentSongIndex ? "is-active" : ""}" data-song-index="${index}">
        <div class="song-card-art" style="background:${song.art}"></div>
        <strong class="song-card-title">${song.title}</strong>
        <span class="song-card-artist">${song.artist}</span>
      </article>
    `;
  }).join("");
}

function renderPopularSongs() {
  if (!popularSongs) {
    return;
  }

  popularSongs.innerHTML = getPopularSongs().map((song, index) => {
    const songIndex = songs.findIndex((item) => item.id === song.id);
    return `
      <button class="popular-song" type="button" data-song-index="${songIndex}">
        <span class="popular-rank">${index + 1}</span>
        <div class="popular-song-art" style="background:${song.art}"></div>
        <div class="popular-song-meta">
          <strong>${song.title}</strong>
          <span>${song.artist}</span>
        </div>
        <span class="popular-song-chip">Top ${index + 1}</span>
      </button>
    `;
  }).join("");
}

function renderPopularArtists() {
  if (!popularArtists) {
    return;
  }

  popularArtists.innerHTML = getPopularArtists().map((artist) => {
    const isActive = searchQuery && normalizeText(searchQuery) === normalizeText(artist.name);
    return `
      <button class="artist-card ${isActive ? "is-active" : ""}" type="button" data-artist-name="${artist.name.replace(/"/g, "&quot;")}">
        <div class="artist-avatar" style="background:${artist.art}"></div>
        <div>
          <strong>${artist.name}</strong>
          <span>${artist.count} bài hát</span>
        </div>
      </button>
    `;
  }).join("");
}

function renderQueue() {
  if (window.renderFilteredQueue) {
    window.renderFilteredQueue();
    return;
  }

  queueList.innerHTML = songs.map((song, index) => `
    <div class="queue-item ${index === currentSongIndex ? "is-active" : ""}" data-song-index="${index}">
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

  if (song.id !== lastPlaybackRecordedSongId) {
    lastPlaybackRecordedSongId = null;
  }

  todayTitle.textContent = song.title;
  todayArtist.textContent = song.artist;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  paintArt(todayArtCover, song.art);
  paintArt(playerArt, song.art);

  audioPlayer.src = song.src || "";
  renderSongCards();
  renderQueue();
  window.syncLyricView?.(song);
  window.likedSongs?.syncLikeButton(song.id);
  syncLyricLikeButton(song.id);
  window.dispatchEvent(new CustomEvent("songchange", { detail: { song } }));
}

function syncPlaybackButtons() {
  const isPlaying = !audioPlayer.paused;
  playButton.classList.toggle("is-playing", isPlaying);
  todayArt.classList.toggle("is-playing", isPlaying);
  todayArt.classList.toggle("is-paused", !isPlaying);
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
  if (!songs.length || index < 0 || index >= songs.length) return;
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

function navigateTrack(step) {
  window.rondoPlayer?.changeTrack(step);
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

function syncLyricLikeButton(songId) {
  if (!lyricLikeButton) return;
  const liked = window.likedSongs?.isLiked(songId);
  lyricLikeButton.className = liked
    ? "fa-solid fa-heart like-icon like-icon--filled"
    : "fa-regular fa-heart like-icon like-icon--empty";
}

window.syncLyricLikeButton = syncLyricLikeButton;

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

popularSongs?.addEventListener("click", (event) => {
  const button = event.target.closest(".popular-song");
  if (!button) return;
  playSong(Number(button.dataset.songIndex));
});

popularArtists?.addEventListener("click", (event) => {
  const button = event.target.closest(".artist-card");
  if (!button) return;
  searchQuery = button.dataset.artistName ?? "";
  if (songSearch) {
    songSearch.value = searchQuery;
  }
  renderSongCards();
  renderPopularArtists();
});

songSearch?.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim();
  renderSongCards();
  renderPopularArtists();
});

queueToggle.addEventListener("click", () => setQueueOpen(!queuePanel.classList.contains("is-open")));
playButton.addEventListener("click", togglePlayback);
prevButton.addEventListener("click", () => navigateTrack(-1));
nextButton.addEventListener("click", () => navigateTrack(1));
repeatButton.addEventListener("click", () => setRepeatState(!repeatOne));
progressInput.addEventListener("input", () => seekToProgress(Number(progressInput.value)));

likeButton.addEventListener("click", () => {
  const song = getCurrentSong();
  if (!song) return;
  window.likedSongs?.toggleLike(song.id);
  window.likedSongs?.syncLikeButton(song.id);
  syncLyricLikeButton(song.id);
  window.refreshLikedView?.();
});

if (lyricLikeButton) {
  lyricLikeButton.addEventListener("click", () => {
    const song = getCurrentSong();
    if (!song) return;
    window.likedSongs?.toggleLike(song.id);
    window.likedSongs?.syncLikeButton(song.id);
    syncLyricLikeButton(song.id);
    window.refreshLikedView?.();
  });
}

audioPlayer.addEventListener("play", syncPlaybackButtons);
audioPlayer.addEventListener("play", () => {
  const song = getCurrentSong();
  if (!song || lastPlaybackRecordedSongId === song.id) return;
  window.recentlyPlayed?.push(song.id);
  lastPlaybackRecordedSongId = song.id;
});
audioPlayer.addEventListener("pause", syncPlaybackButtons);
audioPlayer.addEventListener("loadedmetadata", () => syncProgressDisplays(0));
audioPlayer.addEventListener("timeupdate", () => {
  const progressValue = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0;
  syncProgressDisplays(progressValue);
});
audioPlayer.addEventListener("ended", () => {
  if (repeatOne || !songs.length) return;
  if (window.queueNavigationManaged) return;
  if (window.likedOnlyActive?.()) return;
  navigateTrack(1);
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
  playSong,
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
  renderPopularSongs();
  renderPopularArtists();
  syncCurrentSong();
  window.refreshRecentlyPlayedView?.();
  syncPlaybackButtons();
  syncRepeatButtons();
  syncProgressDisplays(0);
}

initPlayer().then(() => {
  const hashMap = {
    "#liked":    "navLiked",
    "#recent":   "navRecent",
    "#discover": "navDiscover",
  };
  const navId = hashMap[location.hash];
  if (navId) document.getElementById(navId)?.click();
});
