
const viewMenu = document.getElementById("viewMenu");
const viewLiked = document.getElementById("viewLiked");
const viewRecent = document.getElementById("viewRecent");
const navMenu = document.getElementById("navMenu");
const navLiked = document.getElementById("navLiked");
const navRecent = document.getElementById("navRecent");
const likedList = document.getElementById("likedList");
const likedEmpty = document.getElementById("likedEmpty");
const likedCount = document.getElementById("likedCount");

function setView(view) {
  const isLiked = view === "liked";
  const isRecent = view === "recent";
  const isMenu = !isLiked && !isRecent;

  viewMenu.hidden = !isMenu;
  viewLiked.hidden = !isLiked;
  viewRecent.hidden = !isRecent;
  navMenu.classList.toggle("is-active", isMenu);
  navLiked.classList.toggle("is-active", isLiked);
  navRecent.classList.toggle("is-active", isRecent);

  if (isLiked) renderLikedList();
  if (isRecent) window.refreshRecentlyPlayedView?.();
}

function syncViewWithLocation() {
  if (location.hash === "#liked") {
    setView("liked");
    return;
  }

  if (location.hash === "#recent") {
    setView("recent");
    return;
  }

  setView("menu");
}

function renderLikedList() {
  const ids = window.likedSongs.getLikedIds();
  const allSongs = window.rondoPlayer.getSongs();
  const liked = allSongs.filter((s) => ids.includes(s.id));

  likedCount.textContent = `${liked.length} bài hát`;

  if (liked.length === 0) {
    likedEmpty.hidden = false;
    likedList.querySelectorAll(".liked-item").forEach((el) => el.remove());
    return;
  }

  likedEmpty.hidden = true;
  likedList.querySelectorAll(".liked-item").forEach((el) => el.remove());

  const currentSong = window.rondoPlayer.getCurrentSong();

  liked.forEach((song) => {
    const item = document.createElement("article");
    item.className = `liked-item${currentSong?.id === song.id ? " is-active" : ""}`;
    item.dataset.songId = song.id;
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
}

// Update active highlight when song changes
function syncLikedActiveItem() {
  if (viewLiked.hidden) return;
  const currentSong = window.rondoPlayer.getCurrentSong();
  likedList.querySelectorAll(".liked-item").forEach((el) => {
    el.classList.toggle("is-active", Number(el.dataset.songId) === currentSong?.id);
  });
}

likedList.addEventListener("click", (e) => {
  // Unlike button
  const unlikeBtn = e.target.closest(".liked-item-unlike");
  if (unlikeBtn) {
    const songId = Number(unlikeBtn.dataset.songId);
    window.likedSongs.toggleLike(songId);
    // sync like button UI if this is the current song
    const currentSong = window.rondoPlayer.getCurrentSong();
    if (currentSong?.id === songId) {
      window.likedSongs.syncLikeButton(songId);
      window.syncLyricLikeButton?.(songId);
    }
    renderLikedList();
    return;
  }

  // Play song - find it in the full songs list and play by index
  const item = e.target.closest(".liked-item");
  if (!item) return;
  const songId = Number(item.dataset.songId);
  const allSongs = window.rondoPlayer.getSongs();
  const idx = allSongs.findIndex((s) => s.id === songId);
  if (idx !== -1) window.rondoPlayer.playSong(idx);
});

navMenu.addEventListener("click", () => {
  if (location.hash) {
    history.replaceState(null, "", location.pathname + location.search);
  }
  syncViewWithLocation();
});

navLiked.addEventListener("click", () => {
  if (location.hash !== "#liked") {
    location.hash = "liked";
    return;
  }
  syncViewWithLocation();
});

navRecent.addEventListener("click", () => {
  if (location.hash !== "#recent") {
    location.hash = "recent";
    return;
  }
  syncViewWithLocation();
});

window.addEventListener("hashchange", syncViewWithLocation);

// Hook into player song change to keep liked list highlight in sync
const _origSyncCurrentSong = window.rondoPlayer.syncCurrentSong;
window.rondoPlayer.syncCurrentSong = function () {
  _origSyncCurrentSong();
  syncLikedActiveItem();
  window.syncRecentlyPlayedActiveItem?.();
};

// Expose so menu.js like button can refresh the list
window.refreshLikedView = renderLikedList;
syncViewWithLocation();
