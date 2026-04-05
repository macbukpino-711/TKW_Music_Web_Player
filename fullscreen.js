// Fullscreen – toggle fullscreen cho lyric view
const fullscreenToggleBtn = document.getElementById("fullscreen-toggle");
const enterIcon = document.getElementById("enter-fullscreen");
const exitIcon = document.getElementById("exit-fullscreen");
const lyricViewEl = document.getElementById("lyricView");

const lyricCloseBtn = document.getElementById("lyricCloseButton");

function syncFullscreenIcons() {
  const isFs = !!document.fullscreenElement;
  enterIcon.style.display = isFs ? "none" : "inline";
  exitIcon.style.display = isFs ? "inline" : "none";

  // Ẩn nút close lyric khi fullscreen
  if (lyricCloseBtn) lyricCloseBtn.style.display = isFs ? "none" : "";

  // Bật queue khi vào fullscreen, tắt khi thoát
  window.rondoPlayer?.setQueueOpen(isFs);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    lyricViewEl.requestFullscreen().catch(err => {
      console.warn("Fullscreen không khả dụng:", err);
    });
  } else {
    document.exitFullscreen();
  }
}

fullscreenToggleBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", syncFullscreenIcons);

// Init icon state
syncFullscreenIcons();
