// Liked Songs - localStorage key
const LIKED_KEY = "rondo_liked_songs";

function getLikedIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(LIKED_KEY)) || [];
    return Array.isArray(ids) ? ids.filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

function saveLikedIds(ids) {
  localStorage.setItem(LIKED_KEY, JSON.stringify(ids));
}

function isLiked(songId) {
  return getLikedIds().includes(songId);
}

function emitLikedSongsChange(type, detail = {}) {
  window.dispatchEvent(new CustomEvent("likedsongschanged", { detail: { type, ...detail } }));
}

function toggleLike(songId) {
  const ids = getLikedIds();
  const index = ids.indexOf(songId);

  if (index === -1) {
    ids.push(songId);
  } else {
    ids.splice(index, 1);
  }

  saveLikedIds(ids);
  emitLikedSongsChange(index === -1 ? "liked" : "unliked", { songId, ids: [...ids] });
  return index === -1; // true = just liked
}

function moveLikedSong(songId, targetIndex) {
  const ids = getLikedIds();
  const fromIndex = ids.indexOf(songId);
  if (fromIndex === -1) {
    return false;
  }

  const boundedTargetIndex = Math.max(0, Math.min(targetIndex, ids.length - 1));
  if (fromIndex === boundedTargetIndex) {
    return false;
  }

  ids.splice(fromIndex, 1);
  ids.splice(boundedTargetIndex, 0, songId);
  saveLikedIds(ids);
  emitLikedSongsChange("reordered", {
    songId,
    fromIndex,
    targetIndex: boundedTargetIndex,
    ids: [...ids]
  });
  return true;
}

function getOrderedLikedSongs(allSongs = []) {
  const songsById = new Map(allSongs.map((song) => [song.id, song]));
  return getLikedIds()
    .map((id) => songsById.get(id))
    .filter(Boolean);
}

// Sync like button UI state
function syncLikeButton(songId) {
  const liked = isLiked(songId);
  const likeBtn = document.getElementById("likeButton");
  if (!likeBtn) return;
  likeBtn.classList.toggle("is-liked", liked);
}

window.likedSongs = {
  isLiked,
  toggleLike,
  moveLikedSong,
  syncLikeButton,
  getLikedIds,
  getOrderedLikedSongs
};
