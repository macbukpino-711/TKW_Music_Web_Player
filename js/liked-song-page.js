const viewMenu = document.getElementById("viewMenu");
const viewLiked = document.getElementById("viewLiked");
const viewRecent = document.getElementById("viewRecent");
const viewDiscover = document.getElementById("viewDiscover");
const navMenu = document.getElementById("navMenu");
const navLiked = document.getElementById("navLiked");
const navRecent = document.getElementById("navRecent");
const navDiscover = document.getElementById("navDiscover");
const likedList = document.getElementById("likedList");
const likedEmpty = document.getElementById("likedEmpty");
const likedCount = document.getElementById("likedCount");

let draggingLikedSongId = null;

function setView(view) {
  const isLiked = view === "liked";
  const isRecent = view === "recent";
  const isDiscover = view === "discover";
  const isMenu = !isLiked && !isRecent && !isDiscover;

  viewMenu.hidden = !isMenu;
  viewLiked.hidden = !isLiked;
  viewRecent.hidden = !isRecent;
  viewDiscover.hidden = !isDiscover;
  navMenu.classList.toggle("is-active", isMenu);
  navLiked.classList.toggle("is-active", isLiked);
  navRecent.classList.toggle("is-active", isRecent);
  navDiscover?.classList.toggle("is-active", isDiscover);

  if (isLiked) renderLikedList();
  if (isRecent) window.refreshRecentlyPlayedView?.();
  if (isDiscover) window.renderDiscoverView?.();
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

  if (location.hash === "#discover") {
    setView("discover");
    return;
  }

  setView("menu");
}

function renderLikedList() {
  const allSongs = window.rondoPlayer.getSongs();
  const liked = window.likedSongs.getOrderedLikedSongs(allSongs);

  likedCount.textContent = `${liked.length} bài hát`;

  if (liked.length === 0) {
    likedEmpty.hidden = false;
    likedList.querySelectorAll(".liked-item").forEach((el) => el.remove());
    return;
  }

  likedEmpty.hidden = true;
  likedList.querySelectorAll(".liked-item").forEach((el) => el.remove());

  const currentSong = window.rondoPlayer.getCurrentSong();

  liked.forEach((song, index) => {
    const item = document.createElement("article");
    item.className = `liked-item${currentSong?.id === song.id ? " is-active" : ""}`;
    item.dataset.songId = String(song.id);
    item.draggable = true;

    item.innerHTML = `
      <button class="liked-item-handle" type="button" aria-label="Kéo để đổi vị trí">
        <i class="fa-solid fa-grip-vertical"></i>
      </button>
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

function syncLikedActiveItem() {
  if (viewLiked.hidden) return;

  const currentSong = window.rondoPlayer.getCurrentSong();
  likedList.querySelectorAll(".liked-item").forEach((el) => {
    el.classList.toggle("is-active", Number(el.dataset.songId) === currentSong?.id);
  });
}

likedList.addEventListener("click", (event) => {
  const unlikeBtn = event.target.closest(".liked-item-unlike");
  if (unlikeBtn) {
    const songId = Number(unlikeBtn.dataset.songId);
    window.likedSongs.toggleLike(songId);

    const currentSong = window.rondoPlayer.getCurrentSong();
    if (currentSong?.id === songId) {
      window.likedSongs.syncLikeButton(songId);
      window.syncLyricLikeButton?.(songId);
    }

    renderLikedList();
    return;
  }

  const item = event.target.closest(".liked-item");
  if (!item || event.target.closest(".liked-item-handle")) return;

  const songId = Number(item.dataset.songId);
  const allSongs = window.rondoPlayer.getSongs();
  const idx = allSongs.findIndex((song) => song.id === songId);
  if (idx !== -1) {
    window.rondoPlayer.playSong(idx);
  }
});

likedList.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".liked-item");
  if (!item) return;

  draggingLikedSongId = Number(item.dataset.songId);
  item.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggingLikedSongId));
});

likedList.addEventListener("dragover", (event) => {
  const item = event.target.closest(".liked-item");
  if (!item || draggingLikedSongId === null) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  likedList.querySelectorAll(".liked-item.is-drop-target").forEach((el) => {
    el.classList.remove("is-drop-target");
  });

  if (Number(item.dataset.songId) !== draggingLikedSongId) {
    item.classList.add("is-drop-target");
  }
});

likedList.addEventListener("drop", (event) => {
  const item = event.target.closest(".liked-item");
  if (!item || draggingLikedSongId === null) return;

  event.preventDefault();
  const targetSongId = Number(item.dataset.songId);
  if (targetSongId !== draggingLikedSongId) {
    const ids = window.likedSongs.getLikedIds();
    const targetIndex = ids.indexOf(targetSongId);
    const moved = window.likedSongs.moveLikedSong(draggingLikedSongId, targetIndex);
    if (moved) {
      renderLikedList();
    }
  }

  draggingLikedSongId = null;
});

likedList.addEventListener("dragend", () => {
  draggingLikedSongId = null;
  likedList.querySelectorAll(".liked-item").forEach((el) => {
    el.classList.remove("is-dragging", "is-drop-target");
  });
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

navDiscover?.addEventListener("click", () => {
  if (location.hash !== "#discover") {
    location.hash = "discover";
    return;
  }
  syncViewWithLocation();
});

window.addEventListener("hashchange", syncViewWithLocation);

const originalSyncCurrentSong = window.rondoPlayer.syncCurrentSong;
window.rondoPlayer.syncCurrentSong = function () {
  originalSyncCurrentSong();
  syncLikedActiveItem();
  window.syncRecentlyPlayedActiveItem?.();
};

window.refreshLikedView = renderLikedList;
window.addEventListener("likedsongschanged", () => {
  if (!viewLiked.hidden) {
    renderLikedList();
  }
});

syncViewWithLocation();
