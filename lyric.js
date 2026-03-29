const lyricsButton = document.getElementById("lyricsButton");
const lyricSongCover = document.getElementById("lyricSongCover");
const lyricSongTitle = document.getElementById("lyricSongTitle");
const lyricSongArtist = document.getElementById("lyricSongArtist");
const lyricCurrentTime = document.getElementById("lyricCurrentTime");
const lyricDurationTime = document.getElementById("lyricDurationTime");
const lyricProgressInput = document.getElementById("lyricProgressInput");
const lyricPlayButton = document.getElementById("lyricPlayButton");
const lyricPrevButton = document.getElementById("lyricPrevButton");
const lyricNextButton = document.getElementById("lyricNextButton");
const lyricRepeatButton = document.getElementById("lyricRepeatButton");
const lyricQueueButton = document.getElementById("lyricQueueButton");
const lyricCloseButton = document.getElementById("lyricCloseButton");
const lyricVideo = document.getElementById("lyricVideo");
const lyricStage = document.querySelector(".lyric-stage");
const lyricBackdrop = document.getElementById("lyricBackdrop");
const lyricBody = document.getElementById("lyricBody");

let activeLyricIndex = -1;

function paintLyricArt(element, art) {
  element.style.background = art;
}

function paintLyricProgress(value) {
  const percentage = `${value}%`;
  const gradient = `linear-gradient(90deg, #7d7cff 0%, #4d8dff ${percentage}, rgba(255,255,255,0.18) ${percentage}, rgba(255,255,255,0.18) 100%)`;
  lyricProgressInput.style.setProperty("--progress-background", gradient);
}

function renderLyrics(song) {
  lyricBody.innerHTML = (song.lyrics || ["Lyrics chưa được thêm cho bài này."])
    .map((line, index) => `<p class="lyric-line" data-lyric-index="${index}">${line}</p>`)
    .join("");
}

function getActiveLyricIndex(song, currentTimeInSeconds) {
  const timestamps = song.lyricTimestamps || [];
  if (!timestamps.length) {
    return 0;
  }

  for (let index = timestamps.length - 1; index >= 0; index -= 1) {
    if (currentTimeInSeconds >= timestamps[index]) {
      return index + 1;
    }
  }

  return 0;
}

function syncActiveLyric(shouldScroll = false) {
  const song = window.rondoPlayer?.getCurrentSong();
  if (!song || !lyricBody.children.length) return;

  const nextActiveIndex = getActiveLyricIndex(song, window.rondoPlayer.audioPlayer.currentTime || 0);
  if (nextActiveIndex === activeLyricIndex) return;

  activeLyricIndex = nextActiveIndex;
  const lyricLines = lyricBody.querySelectorAll(".lyric-line");
  lyricLines.forEach((line, index) => {
    line.classList.toggle("is-active", index === activeLyricIndex);
  });

  if (shouldScroll) {
    const activeLine = lyricBody.querySelector(`.lyric-line[data-lyric-index="${activeLyricIndex}"]`);
    if (activeLine) {
      const targetTop = activeLine.offsetTop - lyricBody.clientHeight * 0.3;
      lyricBody.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth"
      });
    }
  }
}

window.syncLyricView = (song) => {
  lyricSongTitle.textContent = song.title;
  lyricSongArtist.textContent = song.artist;
  paintLyricArt(lyricSongCover, song.art);
  paintLyricArt(lyricBackdrop, song.art);
  lyricStage.classList.toggle("has-video", Boolean(song.video));

  if (song.video) {
    const videoUrl = new URL(song.video, window.location.href).href;
    if (lyricVideo.src !== videoUrl) {
      lyricVideo.src = song.video;
      lyricVideo.load();
    }
  } else {
    lyricVideo.pause();
    lyricVideo.removeAttribute("src");
    lyricVideo.load();
  }

  renderLyrics(song);
  activeLyricIndex = -1;
  syncActiveLyric();
};

window.syncLyricPlaybackButtons = (isPlaying) => {
  lyricPlayButton.classList.toggle("is-playing", isPlaying);
};

window.syncLyricRepeatButtons = (isRepeatOne) => {
  lyricRepeatButton.classList.toggle("is-active", isRepeatOne);
};

window.syncLyricProgressDisplays = ({ progressValue, currentTimeText, durationText }) => {
  lyricCurrentTime.textContent = currentTimeText;
  lyricDurationTime.textContent = durationText;
  lyricProgressInput.value = String(progressValue);
  paintLyricProgress(progressValue);
  syncActiveLyric(!document.getElementById("lyricView").hidden);
};

function openLyricsView() {
  const { appShell, lyricView, getCurrentSong, setQueueOpen } = window.rondoPlayer;

  lyricView.hidden = false;
  lyricView.classList.remove("is-entering");
  lyricView.classList.remove("is-leaving");
  void lyricView.offsetWidth;
  appShell.classList.add("lyric-mode");
  lyricView.classList.add("is-entering");

  const song = getCurrentSong();
  if (song?.video) {
    if (lyricVideo.src !== new URL(song.video, window.location.href).href) {
      lyricVideo.src = song.video;
      lyricVideo.load();
    }
    lyricVideo.play().catch(() => {});
  }

  syncActiveLyric(true);
  setQueueOpen(false);
}

function closeLyricsView() {
  const { lyricView } = window.rondoPlayer;
  lyricView.classList.remove("is-entering");
  lyricView.classList.add("is-leaving");
  lyricVideo.pause();
}

document.getElementById("lyricView").addEventListener("animationend", (event) => {
  const { appShell, lyricView } = window.rondoPlayer;
  if (event.target !== lyricView) return;

  if (lyricView.classList.contains("is-entering")) {
    lyricView.classList.remove("is-entering");
  }

  if (lyricView.classList.contains("is-leaving")) {
    lyricView.classList.remove("is-leaving");
    appShell.classList.remove("lyric-mode");
    lyricView.hidden = true;
  }
});

lyricsButton.addEventListener("click", openLyricsView);
lyricCloseButton.addEventListener("click", closeLyricsView);
lyricPlayButton.addEventListener("click", () => window.rondoPlayer.togglePlayback());
lyricPrevButton.addEventListener("click", () => window.rondoPlayer.changeTrack(-1));
lyricNextButton.addEventListener("click", () => window.rondoPlayer.changeTrack(1));
lyricRepeatButton.addEventListener("click", () => {
  window.rondoPlayer.setRepeatState(!window.rondoPlayer.isRepeatOne());
});
lyricQueueButton.addEventListener("click", () => {
  window.rondoPlayer.setQueueOpen(!window.rondoPlayer.isQueueOpen());
});
lyricProgressInput.addEventListener("input", () => {
  window.rondoPlayer.seekToProgress(Number(lyricProgressInput.value));
});

if (window.rondoPlayer?.getCurrentSong()) {
  window.syncLyricView(window.rondoPlayer.getCurrentSong());
  window.syncLyricPlaybackButtons(!window.rondoPlayer.audioPlayer.paused);
  window.syncLyricRepeatButtons(window.rondoPlayer.isRepeatOne());
  window.syncLyricProgressDisplays({
    progressValue: Number(document.getElementById("progressInput").value || 0),
    currentTimeText: document.getElementById("currentTime").textContent,
    durationText: document.getElementById("durationTime").textContent
  });
}
