// Queue Filter - chỉ phát liked songs khi bật
const toggleBtn = document.getElementById("toggleLikedSongs");
const queueListEl = document.getElementById("queueList");

const QUEUE_ORDER_KEY = "rondo_queue_order";

let likedOnlyMode = false;
let draggingQueueSongId = null;

window.likedOnlyActive = () => likedOnlyMode;
window.queueNavigationManaged = true;

function getStoredQueueOrderIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(QUEUE_ORDER_KEY)) || [];
    return Array.isArray(ids) ? ids.filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

function saveQueueOrderIds(ids) {
  localStorage.setItem(QUEUE_ORDER_KEY, JSON.stringify(ids));
}

function getOrderedQueueSongs(allSongs) {
  const songsById = new Map(allSongs.map((song) => [song.id, song]));
  const storedIds = getStoredQueueOrderIds();
  const ordered = storedIds
    .map((id) => songsById.get(id))
    .filter(Boolean);

  const missingSongs = allSongs.filter((song) => !storedIds.includes(song.id));
  const nextSongs = [...ordered, ...missingSongs];
  const nextIds = nextSongs.map((song) => song.id);

  if (nextIds.length !== storedIds.length || nextIds.some((id, index) => id !== storedIds[index])) {
    saveQueueOrderIds(nextIds);
  }

  return nextSongs;
}

function moveQueueSong(songId, targetIndex) {
  const allSongs = window.rondoPlayer.getSongs();
  const ids = getOrderedQueueSongs(allSongs).map((song) => song.id);
  const fromIndex = ids.indexOf(songId);
  if (fromIndex === -1) return false;

  const boundedTargetIndex = Math.max(0, Math.min(targetIndex, ids.length - 1));
  if (fromIndex === boundedTargetIndex) return false;

  ids.splice(fromIndex, 1);
  ids.splice(boundedTargetIndex, 0, songId);
  saveQueueOrderIds(ids);
  return true;
}

function getActivePlaylist() {
  const allSongs = window.rondoPlayer.getSongs();
  if (likedOnlyMode) {
    return window.likedSongs.getOrderedLikedSongs(allSongs);
  }
  return getOrderedQueueSongs(allSongs);
}

function renderFilteredQueue() {
  const allSongs = window.rondoPlayer.getSongs();
  const playlist = getActivePlaylist();
  const currentSong = window.rondoPlayer.getCurrentSong();

  if (likedOnlyMode && playlist.length === 0) {
    queueListEl.innerHTML = '<div class="queue-empty">Chưa có bài hát nào được thích</div>';
    return;
  }

  queueListEl.innerHTML = playlist.map((song, index) => {
    const globalIndex = allSongs.indexOf(song);
    const isActive = currentSong && song.id === currentSong.id;

    return `
      <div class="queue-item ${isActive ? "is-active" : ""}" data-song-index="${globalIndex}" data-song-id="${song.id}" draggable="true">
        <button class="queue-drag-handle" type="button" aria-label="Kéo để đổi vị trí">
          <i class="fa-solid fa-grip-vertical"></i>
        </button>
        <div class="queue-thumb" style="background:${song.art}"></div>
        <div class="queue-copy">
          <strong>${song.title}</strong>
          <span>${song.artist}</span>
        </div>
      </div>
    `;
  }).join("");
}

window.renderFilteredQueue = renderFilteredQueue;

function navigateInPlaylist(step) {
  const playlist = getActivePlaylist();
  if (!playlist.length) return;

  const allSongs = window.rondoPlayer.getSongs();
  const currentSong = window.rondoPlayer.getCurrentSong();
  let currentIndexInPlaylist = playlist.findIndex((song) => song.id === currentSong?.id);

  if (currentIndexInPlaylist === -1) {
    const fallbackSong = step >= 0 ? playlist[0] : playlist[playlist.length - 1];
    const fallbackIndex = allSongs.indexOf(fallbackSong);
    if (fallbackIndex !== -1) {
      window.rondoPlayer.playSong(fallbackIndex);
    }
    return;
  }

  const nextInPlaylist = playlist[(currentIndexInPlaylist + step + playlist.length) % playlist.length];
  const nextGlobalIndex = allSongs.indexOf(nextInPlaylist);
  window.rondoPlayer.playSong(nextGlobalIndex);
}

function setLikedOnlyMode(enabled) {
  likedOnlyMode = enabled;
  toggleBtn.classList.toggle("is-active", enabled);

  if (enabled) {
    const playlist = getActivePlaylist();
    const currentSong = window.rondoPlayer.getCurrentSong();
    const isCurrentInPlaylist = playlist.some((song) => song.id === currentSong?.id);

    if (!isCurrentInPlaylist && playlist.length > 0) {
      const allSongs = window.rondoPlayer.getSongs();
      const firstIndex = allSongs.indexOf(playlist[0]);
      window.rondoPlayer.playSong(firstIndex);
      return;
    }
  }

  renderFilteredQueue();
}

const originalChangeTrack = window.rondoPlayer.changeTrack;
window.rondoPlayer.changeTrack = function (step) {
  const playlist = getActivePlaylist();
  if (!playlist.length) {
    originalChangeTrack(step);
    return;
  }

  navigateInPlaylist(step);
};

document.getElementById("audioPlayer").addEventListener("ended", () => {
  if (window.rondoPlayer.isRepeatOne()) return;
  navigateInPlaylist(1);
});

const originalToggleLike = window.likedSongs.toggleLike;
window.likedSongs.toggleLike = function (songId) {
  const result = originalToggleLike(songId);
  if (likedOnlyMode) {
    const playlist = getActivePlaylist();
    const currentSong = window.rondoPlayer.getCurrentSong();

    if (playlist.length > 0 && !playlist.some((song) => song.id === currentSong?.id)) {
      const allSongs = window.rondoPlayer.getSongs();
      const firstIndex = allSongs.indexOf(playlist[0]);
      if (firstIndex !== -1) {
        window.rondoPlayer.playSong(firstIndex);
        return result;
      }
    }
  }

  renderFilteredQueue();
  return result;
};

window.addEventListener("likedsongschanged", () => {
  renderFilteredQueue();
});

queueListEl.addEventListener("click", (event) => {
  const item = event.target.closest(".queue-item[data-song-index]");
  if (!item || event.target.closest(".queue-drag-handle")) return;
  window.rondoPlayer.playSong(Number(item.dataset.songIndex));
});

queueListEl.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".queue-item");
  if (!item) return;

  draggingQueueSongId = Number(item.dataset.songId);
  item.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggingQueueSongId));
});

queueListEl.addEventListener("dragover", (event) => {
  const item = event.target.closest(".queue-item");
  if (!item || draggingQueueSongId === null) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  queueListEl.querySelectorAll(".queue-item.is-drop-target").forEach((element) => {
    element.classList.remove("is-drop-target");
  });

  if (Number(item.dataset.songId) !== draggingQueueSongId) {
    item.classList.add("is-drop-target");
  }
});

queueListEl.addEventListener("drop", (event) => {
  const item = event.target.closest(".queue-item");
  if (!item || draggingQueueSongId === null) return;

  event.preventDefault();
  const targetSongId = Number(item.dataset.songId);
  if (targetSongId !== draggingQueueSongId) {
    const playlist = getActivePlaylist();
    const targetIndex = playlist.findIndex((song) => song.id === targetSongId);

    if (likedOnlyMode) {
      window.likedSongs.moveLikedSong(draggingQueueSongId, targetIndex);
    } else {
      moveQueueSong(draggingQueueSongId, targetIndex);
      renderFilteredQueue();
    }
  }

  draggingQueueSongId = null;
});

queueListEl.addEventListener("dragend", () => {
  draggingQueueSongId = null;
  queueListEl.querySelectorAll(".queue-item").forEach((element) => {
    element.classList.remove("is-dragging", "is-drop-target");
  });
});

toggleBtn.addEventListener("click", () => setLikedOnlyMode(!likedOnlyMode));
renderFilteredQueue();
