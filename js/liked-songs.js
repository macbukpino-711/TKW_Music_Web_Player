// Liked Songs - localStorage key
const LIKED_KEY = "rondo_liked_songs";

function getLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY)) || [];
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

function toggleLike(songId) {
  const ids = getLikedIds();
  const index = ids.indexOf(songId);
  if (index === -1) {
    ids.push(songId);
  } else {
    ids.splice(index, 1);
  }
  saveLikedIds(ids);
  return index === -1; // true = just liked
}

// Sync like button UI state
function syncLikeButton(songId) {
  const liked = isLiked(songId);
  const likeBtn = document.getElementById("likeButton");
  if (!likeBtn) return;
  likeBtn.classList.toggle("is-liked", liked);
}

window.likedSongs = { isLiked, toggleLike, syncLikeButton, getLikedIds };
