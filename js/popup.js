const popupButton = document.getElementById("popupButton");
const popupStyleHref = new URL("../css/popup.css", window.location.href).href;

let pipWindow = null;
let syncTimer = null;

function getCurrentSong() {
  return window.rondoPlayer?.getCurrentSong?.() ?? null;
}

function getMiniPlayerDocument() {
  return pipWindow?.document ?? null;
}

function syncMiniPlayer() {
  const miniDoc = getMiniPlayerDocument();
  if (!miniDoc) return;

  const song = getCurrentSong();
  const audio = window.rondoPlayer?.audioPlayer;
  const artEl = miniDoc.getElementById("miniPlayerArt");
  const titleEl = miniDoc.getElementById("miniPlayerTitle");
  const artistEl = miniDoc.getElementById("miniPlayerArtist");
  const playButtonEl = miniDoc.getElementById("miniPlayerPlay");
  const likeButtonEl = miniDoc.getElementById("miniPlayerLike");

  if (!song || !audio) {
    artEl.style.background = "linear-gradient(135deg, #2a3258, #111522)";
    titleEl.textContent = "CHUA CO BAI HAT";
    artistEl.textContent = "Hay chon mot bai de bat dau";
    playButtonEl.classList.remove("is-playing");
    likeButtonEl.classList.remove("is-liked");
    return;
  }

  artEl.style.background = song.art;
  titleEl.textContent = song.title.toUpperCase();
  artistEl.textContent = song.artist;
  playButtonEl.classList.toggle("is-playing", !audio.paused);
  likeButtonEl.classList.toggle("is-liked", Boolean(window.likedSongs?.isLiked?.(song.id)));
}

function attachMiniPlayerEvents() {
  const miniDoc = getMiniPlayerDocument();
  if (!miniDoc) return;

  miniDoc.getElementById("miniPlayerPrev")?.addEventListener("click", () => {
    window.rondoPlayer?.changeTrack?.(-1);
    syncMiniPlayer();
  });

  miniDoc.getElementById("miniPlayerPlay")?.addEventListener("click", () => {
    window.rondoPlayer?.togglePlayback?.();
    syncMiniPlayer();
  });

  miniDoc.getElementById("miniPlayerNext")?.addEventListener("click", () => {
    window.rondoPlayer?.changeTrack?.(1);
    syncMiniPlayer();
  });

  miniDoc.getElementById("miniPlayerLike")?.addEventListener("click", () => {
    const song = getCurrentSong();
    if (!song) return;

    window.likedSongs?.toggleLike?.(song.id);
    window.likedSongs?.syncLikeButton?.(song.id);
    window.syncLyricLikeButton?.(song.id);
    window.refreshLikedView?.();
    syncMiniPlayer();
  });
}

function startSyncLoop() {
  window.clearInterval(syncTimer);
  syncTimer = window.setInterval(() => {
    if (!pipWindow || pipWindow.closed) {
      window.clearInterval(syncTimer);
      syncTimer = null;
      pipWindow = null;
      popupButton?.classList.remove("is-active");
      return;
    }

    syncMiniPlayer();
  }, 400);
}

function renderMiniPlayerWindow(miniDoc) {
  miniDoc.head.innerHTML = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${popupStyleHref}">
  `;

  miniDoc.body.style.margin = "0";
  miniDoc.body.style.overflow = "hidden";

  miniDoc.body.innerHTML = `
    <section class="mini-player">
      <div class="mini-player__media">
        <div class="mini-player__art" id="miniPlayerArt">
          <div class="mini-player__overlay">
            <div class="mini-player__controls">
              <button class="mini-player__control mini-player__control--prev" id="miniPlayerPrev" type="button" aria-label="Previous track">
                <span class="mini-player__skip-icon" aria-hidden="true"></span>
              </button>
              <button class="mini-player__control mini-player__control--play" id="miniPlayerPlay" type="button" aria-label="Play or pause">
                <span class="mini-player__play-icon mini-player__play-icon--play" aria-hidden="true"></span>
                <span class="mini-player__play-icon mini-player__play-icon--pause" aria-hidden="true"></span>
              </button>
              <button class="mini-player__control mini-player__control--next" id="miniPlayerNext" type="button" aria-label="Next track">
                <span class="mini-player__skip-icon" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mini-player__body">
        <h2 class="mini-player__title" id="miniPlayerTitle">LOI NGUOC DONG</h2>
        <div class="mini-player__meta-row">
          <p class="mini-player__artist" id="miniPlayerArtist">Orange</p>
          <button class="mini-player__like" id="miniPlayerLike" type="button" aria-label="Like Song">
            <span class="mini-player__heart" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>
  `;

  attachMiniPlayerEvents();
  syncMiniPlayer();
}

async function openMiniPlayer() {
  if (!("documentPictureInPicture" in window)) {
    window.alert("Trinh duyet nay chua ho tro mini player noi. Hay thu bang Chrome hoac Edge moi.");
    return;
  }

  if (pipWindow && !pipWindow.closed) {
    renderMiniPlayerWindow(pipWindow.document);
    pipWindow.focus();
    popupButton?.classList.add("is-active");
    return;
  }

  pipWindow = await window.documentPictureInPicture.requestWindow({
    width: 240,
    height: 322
  });

  renderMiniPlayerWindow(pipWindow.document);
  startSyncLoop();
  popupButton?.classList.add("is-active");

  pipWindow.addEventListener("pagehide", () => {
    window.clearInterval(syncTimer);
    syncTimer = null;
    pipWindow = null;
    popupButton?.classList.remove("is-active");
  });
}

popupButton?.addEventListener("click", () => {
  openMiniPlayer().catch(() => {
    window.alert("Khong mo duoc mini player. Hay thu lai sau khi phat bai hat.");
  });
});

window.addEventListener("songchange", syncMiniPlayer);
