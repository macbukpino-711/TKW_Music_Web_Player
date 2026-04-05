// Queue Filter – chỉ phát liked songs khi bật
const toggleBtn = document.getElementById("toggleLikedSongs");

let likedOnlyMode = false;

// Expose để menu.js kiểm tra trước khi xử lý ended
window.likedOnlyActive = () => likedOnlyMode;

function getActivePlaylist() {
  const allSongs = window.rondoPlayer.getSongs();
  if (!likedOnlyMode) return allSongs;
  const likedIds = window.likedSongs.getLikedIds();
  return allSongs.filter(song => likedIds.includes(song.id));
}

function renderFilteredQueue() {
  const queueList = document.getElementById("queueList");
  const allSongs = window.rondoPlayer.getSongs();
  const playlist = getActivePlaylist();
  const currentSong = window.rondoPlayer.getCurrentSong();

  if (likedOnlyMode && playlist.length === 0) {
    queueList.innerHTML = `<div class="queue-empty">Chưa có bài hát nào được thích</div>`;
    return;
  }

  queueList.innerHTML = playlist.map(song => {
    const globalIndex = allSongs.indexOf(song);
    const isActive = currentSong && song.id === currentSong.id;
    return `
      <div class="queue-item ${isActive ? "is-active" : ""}" data-song-index="${globalIndex}">
        <div class="queue-thumb" style="background:${song.art}"></div>
        <div>
          <strong>${song.title}</strong>
          <span>${song.artist}</span>
        </div>
      </div>
    `;
  }).join("");
}

// Expose để menu.js gọi thay renderQueue khi filter active
window.renderFilteredQueue = renderFilteredQueue;

function navigateInPlaylist(step) {
  const playlist = getActivePlaylist();
  if (!playlist.length) return;

  const allSongs = window.rondoPlayer.getSongs();
  const currentSong = window.rondoPlayer.getCurrentSong();
  let currentIndexInPlaylist = playlist.findIndex(s => s.id === currentSong?.id);

  // Nếu bài hiện tại không trong playlist (vừa unlike), bắt đầu từ đầu
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
    const isCurrentInPlaylist = playlist.some(s => s.id === currentSong?.id);

    if (!isCurrentInPlaylist && playlist.length > 0) {
      const allSongs = window.rondoPlayer.getSongs();
      const firstIndex = allSongs.indexOf(playlist[0]);
      window.rondoPlayer.playSong(firstIndex);
      return; // playSong sẽ trigger syncCurrentSong → renderFilteredQueue
    }
  }

  renderFilteredQueue();
}

// Override changeTrack để điều hướng trong filtered playlist
const originalChangeTrack = window.rondoPlayer.changeTrack;
window.rondoPlayer.changeTrack = function(step) {
  if (!likedOnlyMode) {
    originalChangeTrack(step);
    return;
  }
  navigateInPlaylist(step);
};

// Xử lý ended trong liked-only mode (menu.js sẽ skip nếu likedOnlyActive() = true)
document.getElementById("audioPlayer").addEventListener("ended", () => {
  if (!likedOnlyMode || window.rondoPlayer.isRepeatOne()) return;
  navigateInPlaylist(1);
});

// Khi user unlike bài đang phát trong liked-only mode → cập nhật queue
const originalToggleLike = window.likedSongs.toggleLike;
window.likedSongs.toggleLike = function(songId) {
  const result = originalToggleLike(songId);
  if (likedOnlyMode) renderFilteredQueue();
  return result;
};

// Click vào item trong queue để phát
document.getElementById("queueList").addEventListener("click", (e) => {
  const item = e.target.closest(".queue-item[data-song-index]");
  if (!item) return;
  window.rondoPlayer.playSong(Number(item.dataset.songIndex));
});

toggleBtn.addEventListener("click", () => setLikedOnlyMode(!likedOnlyMode));
