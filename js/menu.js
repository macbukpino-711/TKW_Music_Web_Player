const appShell = document.getElementById("appShell");
const lyricView = document.getElementById("lyricView");
const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const songRow = document.getElementById("songRow");
const todayArt = document.getElementById("todayArt");
const todayTitle = document.getElementById("todayTitle");
const todayArtist = document.getElementById("todayArtist");
const playerArt = document.getElementById("playerArt");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const progressInput = document.getElementById("progressInput");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const repeatButton = document.getElementById("repeatButton");
const lyricsButton = document.getElementById("lyricsButton");
const queueToggle = document.getElementById("queueToggle");
const queueClose = document.getElementById("queueClose");

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
const audioPlayer = document.getElementById("audioPlayer");

let songs = [];
let currentSongIndex = 0;
let repeatOne = false;
let activeLyricIndex = -1;

const fallbackSongs = [
  {
    id: 0,
    title: "Lội Ngược Dòng",
    artist: "Orange",
    src: "../source/LoiNguocDong.mp3",
    video: "../source/LoiNguocDong-video-bg.mp4",
    art: "url('https://is1-ssl.mzstatic.com/image/thumb/Video211/v4/87/02/a6/8702a6b0-987d-7ced-3966-f6b7933b5a1a/Job74e9ba37-d69e-4605-9f97-21aea2ee3e60-202868511-PreviewImage_Preview_Image_Intermediate_nonvideo_sdr_396802048_2335341335-Time1757640236583.png/592x592bb.webp') center/cover no-repeat",
    lyrics: [
      "♪",
      "Vào ngay giữa lúc tương lai đang vô định",
      "Mà anh đã ghé ngang qua nơi khung trời của em?",
      "Vì sao ấy bỗng nhiên hoá ra vô hình",
      "Vì nguồn ánh sáng anh mang vào màn đêm tối đen",
      "Thế gian từng gọi ta là hai kẻ liều vì yêu",
      "Có mấy ai hiểu ta đã trải qua bao nhiêu",
      "Những cảm xúc này chẳng cần ai đến và soi chiếu",
      "Chứng giám cho cuộc tình, chỉ cần có hai chúng mình",
      "Lội ngược dòng thác sâu",
      "Lội ngược muôn nỗi đau",
      "Được chọn lại lần nữa, vẫn yêu anh như lần đầu",
      "Nhìn vào đôi mắt nhau",
      "Tựa hồ như có phép màu",
      "Đặc ân vô giá của em là mãi được bên anh",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love, oh-oh…",
      "Ai cũng có cuộc chiến của riêng mình",
      "Thật may khi anh ở bên ngay cả khi chẳng yên bình, yeah",
      "Kiên nhẫn nghe bài ca em viết dẫu buồn da diết trên từng nốt nhạc",
      "Ôm cả những mảnh vỡ của em rồi",
      "Tự thêu lên những niềm vui tưởng như chẳng còn ghé ngang",
      "Cách anh yêu sao thật dễ dàng",
      "Dù thế gian từng gọi ta là hai kẻ liều vì yêu",
      "Có mấy ai hiểu ta đã trải qua bao nhiêu",
      "Những cảm xúc này chẳng cần ai đến và soi chiếu",
      "Chứng giám cho cuộc tình, chỉ cần có hai chúng mình",
      "Lội ngược dòng thác sâu",
      "Lội ngược muôn nỗi đau",
      "Được chọn lại lần nữa, vẫn yêu anh như lần đầu",
      "Nhìn vào đôi mắt nhau",
      "Tựa hồ như có phép màu",
      "Đặc ân vô giá của em là mãi được bên anh",
      "Và mình thật xứng đáng",
      "Giữ lấy giây phút này trong tầm tay, hoh-oh",
      "Điều làm mình hạnh phúc chỉ hai ta biết",
      "Mãi không lung lay",
      "Lội ngược dòng thác sâu",
      "Lội ngược muôn nỗi đau",
      "Được chọn lại lần nữa, vẫn yêu anh như lần đầu",
      "Nhìn vào đôi mắt nhau",
      "Tựa hồ như có phép màu",
      "Đặc ân vô giá của em là mãi được bên anh",
      "♪",
      "I will give you all my, all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love, oh-oh",
      "I give you all my love"
    ],
    lyricTimestamps: [
      18.34, 20.92, 27.91, 30.36, 36.84, 41.58, 46.31, 50.77, 55.84, 58.17,
      60.21, 65.27, 67.35, 70.22, 76.67, 78.4, 81.42, 83.14, 86.22, 87.95,
      95.66, 97.36, 100.38, 105.24, 106.89, 110.51, 112.58, 117.56, 122.41, 126.82,
      131.9, 134.26, 136.39, 141.45, 143.57, 146.2, 152.78, 154.86, 162.18, 167.08,
      169.95, 172.43, 174.5, 179.48, 181.61, 184.25, 192.55, 214.07, 218.91, 220.74,
      223.68, 225.47, 229.26
    ]
  },
  {
    id: 1,
    title: "Waiting For You",
    artist: "Mono",
    src: "",
    art: "linear-gradient(135deg, #2b2f77, #6d5dfc)",
    lyrics: ["Lyrics chưa được thêm cho bài này."]
  },
  {
    id: 2,
    title: "See Tinh",
    artist: "Hoàng Thùy Linh",
    src: "",
    art: "linear-gradient(135deg, #ff5da2, #7d7cff)",
    lyrics: ["Lyrics chưa được thêm cho bài này."]
  },
  {
    id: 3,
    title: "Mong Manh",
    artist: "Vũ.",
    src: "",
    art: "linear-gradient(135deg, #1f355f, #4d8dff)",
    lyrics: ["Lyrics chưa được thêm cho bài này."]
  }
];

async function loadSongs() {
  try {
    const response = await fetch("../json/song.json");
    if (!response.ok) {
      throw new Error("Could not load song.json");
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("song.json is empty or invalid");
    }

    return data.map((song, index) => ({
      ...fallbackSongs[index],
      ...song,
      lyrics: song.lyrics ?? fallbackSongs[index]?.lyrics ?? ["Lyrics chưa được thêm cho bài này."]
    }));
  } catch (error) {
    console.warn("song.json could not be loaded, using fallback song data.", error);
    return fallbackSongs;
  }
}

function getCurrentSong() {
  return songs[currentSongIndex];
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function paintArt(element, art) {
  element.style.background = art;
}

function paintProgress(value) {
  const percentage = `${value}%`;
  const gradient = `linear-gradient(90deg, #7d7cff 0%, #4d8dff ${percentage}, rgba(255,255,255,0.18) ${percentage}, rgba(255,255,255,0.18) 100%)`;
  progressInput.style.setProperty("--progress-background", gradient);
  lyricProgressInput.style.setProperty("--progress-background", gradient);
}

function renderSongCards() {
  songRow.innerHTML = songs.map((song, index) => `
    <article class="song-card ${index === currentSongIndex ? "is-active" : ""}" data-song-index="${index}">
      <div class="song-card-art" style="background:${song.art}"></div>
      <strong class="song-card-title">${song.title}</strong>
      <span class="song-card-artist">${song.artist}</span>
    </article>
  `).join("");
}

function renderQueue() {
  queueList.innerHTML = songs.map((song, index) => `
    <div class="queue-item ${index === currentSongIndex ? "is-active" : ""}">
      <div class="queue-thumb" style="background:${song.art}"></div>
      <div>
        <strong>${song.title}</strong>
        <span>${song.artist}</span>
      </div>
    </div>
  `).join("");
}

function renderLyrics(song) {
  lyricBody.innerHTML = (song.lyrics || ["Lyrics chưa được thêm cho bài này."])
    .map((line, index) => {
      return `<p class="lyric-line" data-lyric-index="${index}">${line}</p>`;
    })
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
  const song = getCurrentSong();
  if (!song || !lyricBody.children.length) return;

  const nextActiveIndex = getActiveLyricIndex(song, audioPlayer.currentTime || 0);
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

function syncCurrentSong() {
  const song = getCurrentSong();
  if (!song) return;

  todayTitle.textContent = song.title;
  todayArtist.textContent = song.artist;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  lyricSongTitle.textContent = song.title;
  lyricSongArtist.textContent = song.artist;

  paintArt(todayArt, song.art);
  paintArt(playerArt, song.art);
  paintArt(lyricSongCover, song.art);
  paintArt(lyricBackdrop, song.art);
  lyricStage.classList.toggle("has-video", Boolean(song.video));
  if (song.video && lyricVideo.src !== new URL(song.video, window.location.href).href) {
    lyricVideo.src = song.video;
    lyricVideo.load();
  }
  if (!song.video) {
    lyricVideo.pause();
    lyricVideo.removeAttribute("src");
    lyricVideo.load();
  }

  audioPlayer.src = song.src || "";
  renderSongCards();
  renderQueue();
  renderLyrics(song);
  activeLyricIndex = -1;
  syncActiveLyric();
}

function syncPlaybackButtons() {
  const isPlaying = !audioPlayer.paused;
  playButton.classList.toggle("is-playing", isPlaying);
  lyricPlayButton.classList.toggle("is-playing", isPlaying);
}

function syncRepeatButtons() {
  repeatButton.classList.toggle("is-active", repeatOne);
  lyricRepeatButton.classList.toggle("is-active", repeatOne);
}

function syncProgressDisplays(progressValue = 0) {
  const now = formatTime(audioPlayer.currentTime);
  const total = formatTime(audioPlayer.duration);
  currentTime.textContent = now;
  lyricCurrentTime.textContent = now;
  durationTime.textContent = total;
  lyricDurationTime.textContent = total;
  progressInput.value = String(progressValue);
  lyricProgressInput.value = String(progressValue);
  paintProgress(progressValue);
}

function playSong(index) {
  if (!songs.length) return;
  currentSongIndex = index;
  syncCurrentSong();
  if (audioPlayer.src) {
    audioPlayer.play();
  }
}

function togglePlayback() {
  if (!songs.length) return;
  if (!audioPlayer.src) {
    syncCurrentSong();
  }
  if (audioPlayer.paused) {
    if (audioPlayer.src) {
      audioPlayer.play();
    }
    return;
  }
  audioPlayer.pause();
}

function changeTrack(step) {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex + step + songs.length) % songs.length;
  playSong(currentSongIndex);
}

function setQueueOpen(isOpen) {
  queuePanel.classList.toggle("is-open", isOpen);
  queuePanel.setAttribute("aria-hidden", String(!isOpen));
}

function openLyricsView() {
  lyricView.hidden = false;
  lyricView.classList.remove("is-entering");
  lyricView.classList.remove("is-leaving");
  void lyricView.offsetWidth;
  appShell.classList.add("lyric-mode");
  lyricView.classList.add("is-entering");
  if (getCurrentSong()?.video && lyricVideo.getAttribute("src")) {
    lyricVideo.play().catch(() => {});
  }
  syncActiveLyric(true);
  setQueueOpen(false);
}

function closeLyricsView() {
  lyricView.classList.remove("is-entering");
  lyricView.classList.add("is-leaving");
  lyricVideo.pause();
}

lyricView.addEventListener("animationend", () => {
  if (lyricView.classList.contains("is-entering")) {
    lyricView.classList.remove("is-entering");
  }

  if (lyricView.classList.contains("is-leaving")) {
    lyricView.classList.remove("is-leaving");
    appShell.classList.remove("lyric-mode");
    lyricView.hidden = true;
  }
});

function seekToProgress(value) {
  if (!audioPlayer.duration) return;
  audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
  syncProgressDisplays(value);
}

songRow.addEventListener("click", (event) => {
  const card = event.target.closest(".song-card");
  if (!card) return;
  playSong(Number(card.dataset.songIndex));
});

queueToggle.addEventListener("click", () => setQueueOpen(!queuePanel.classList.contains("is-open")));
queueClose.addEventListener("click", () => setQueueOpen(false));
lyricQueueButton.addEventListener("click", () => setQueueOpen(!queuePanel.classList.contains("is-open")));

playButton.addEventListener("click", togglePlayback);
lyricPlayButton.addEventListener("click", togglePlayback);
prevButton.addEventListener("click", () => changeTrack(-1));
lyricPrevButton.addEventListener("click", () => changeTrack(-1));
nextButton.addEventListener("click", () => changeTrack(1));
lyricNextButton.addEventListener("click", () => changeTrack(1));

repeatButton.addEventListener("click", () => {
  repeatOne = !repeatOne;
  audioPlayer.loop = repeatOne;
  syncRepeatButtons();
});
lyricRepeatButton.addEventListener("click", () => {
  repeatOne = !repeatOne;
  audioPlayer.loop = repeatOne;
  syncRepeatButtons();
});

lyricsButton.addEventListener("click", openLyricsView);
lyricCloseButton.addEventListener("click", closeLyricsView);

progressInput.addEventListener("input", () => seekToProgress(Number(progressInput.value)));
lyricProgressInput.addEventListener("input", () => seekToProgress(Number(lyricProgressInput.value)));

audioPlayer.addEventListener("play", syncPlaybackButtons);
audioPlayer.addEventListener("pause", syncPlaybackButtons);
audioPlayer.addEventListener("loadedmetadata", () => syncProgressDisplays(0));
audioPlayer.addEventListener("timeupdate", () => {
  const progressValue = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0;
  syncProgressDisplays(progressValue);
  syncActiveLyric(!lyricView.hidden);
});
audioPlayer.addEventListener("ended", () => {
  if (repeatOne || !songs.length) return;
  changeTrack(1);
});

async function initPlayer() {
  songs = await loadSongs();
  syncCurrentSong();
  syncPlaybackButtons();
  syncRepeatButtons();
  syncProgressDisplays(0);
}

initPlayer();
