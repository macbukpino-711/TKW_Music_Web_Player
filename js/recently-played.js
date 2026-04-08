const RECENTLY_PLAYED_KEY = "rondo_recently_played";
const RECENTLY_PLAYED_LIMIT = 12;

const recentList = document.getElementById("recentList");
const recentEmpty = document.getElementById("recentEmpty");
const recentCount = document.getElementById("recentCount");
const clearRecentlyPlayedButton = document.getElementById("clearRecentlyPlayed");

function getRecentlyPlayedIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENTLY_PLAYED_KEY)) || [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

function saveRecentlyPlayedIds(ids) {
  localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(ids));
}

function pushRecentlyPlayed(songId) {
  if (!Number.isFinite(songId)) return;

  const nextIds = getRecentlyPlayedIds().filter((id) => id !== songId);
  nextIds.unshift(songId);
  saveRecentlyPlayedIds(nextIds.slice(0, RECENTLY_PLAYED_LIMIT));
  renderRecentlyPlayedList();
}

function clearRecentlyPlayed() {
  localStorage.removeItem(RECENTLY_PLAYED_KEY);
  renderRecentlyPlayedList();
}

function renderRecentlyPlayedList() {
  if (!recentList || !recentEmpty || !recentCount) {
    return;
  }

  const ids = getRecentlyPlayedIds();
  const allSongs = window.rondoPlayer.getSongs();
  const recentSongs = ids
    .map((id) => allSongs.find((song) => song.id === id))
    .filter(Boolean);

  recentCount.textContent = `${recentSongs.length} bài hát`;
  clearRecentlyPlayedButton.hidden = recentSongs.length === 0;

  if (recentSongs.length === 0) {
    recentEmpty.hidden = false;
    recentList.querySelectorAll(".liked-item").forEach((el) => el.remove());
    return;
  }

  recentEmpty.hidden = true;
  recentList.querySelectorAll(".liked-item").forEach((el) => el.remove());

  const currentSong = window.rondoPlayer.getCurrentSong();

  recentSongs.forEach((song, index) => {
    const item = document.createElement("article");
    item.className = `liked-item${currentSong?.id === song.id ? " is-active" : ""}`;
    item.dataset.songId = String(song.id);
    item.innerHTML = `
      <div class="liked-item-art" style="background:${song.art}"></div>
      <div class="liked-item-meta">
        <h2>${song.title}</h2>
        <p>${song.artist}</p>
      </div>
      <span class="recent-order">#${index + 1}</span>
      <button class="liked-item-unlike" data-song-id="${song.id}" aria-label="Remove from recently played">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    recentList.appendChild(item);
  });
}

function syncRecentlyPlayedActiveItem() {
  if (!recentList || document.getElementById("viewRecent")?.hidden) return;

  const currentSong = window.rondoPlayer.getCurrentSong();
  recentList.querySelectorAll(".liked-item").forEach((el) => {
    el.classList.toggle("is-active", Number(el.dataset.songId) === currentSong?.id);
  });
}

function removeRecentlyPlayed(songId) {
  const nextIds = getRecentlyPlayedIds().filter((id) => id !== songId);
  saveRecentlyPlayedIds(nextIds);
  renderRecentlyPlayedList();
}

recentList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".liked-item-unlike");
  if (removeButton) {
    removeRecentlyPlayed(Number(removeButton.dataset.songId));
    return;
  }

  const item = event.target.closest(".liked-item");
  if (!item) return;

  const songId = Number(item.dataset.songId);
  const allSongs = window.rondoPlayer.getSongs();
  const songIndex = allSongs.findIndex((song) => song.id === songId);
  if (songIndex !== -1) {
    window.rondoPlayer.playSong(songIndex);
  }
});

clearRecentlyPlayedButton?.addEventListener("click", clearRecentlyPlayed);

window.recentlyPlayed = {
  getIds: getRecentlyPlayedIds,
  push: pushRecentlyPlayed,
  clear: clearRecentlyPlayed
};

window.refreshRecentlyPlayedView = renderRecentlyPlayedList;
window.syncRecentlyPlayedActiveItem = syncRecentlyPlayedActiveItem;

renderRecentlyPlayedList();
