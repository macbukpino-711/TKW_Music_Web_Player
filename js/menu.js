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
const lyricBackdrop = document.getElementById("lyricBackdrop");
const lyricBody = document.getElementById("lyricBody");
const audioPlayer = document.getElementById("audioPlayer");

let songs = [];
let currentSongIndex = 0;
let repeatOne = false;

const fallbackSongs = [
  {
    id: 0,
    title: "Lội Ngược Dòng",
    artist: "Orange",
    src: "../source/LoiNguocDong.mp3",
    art: "url('https://is1-ssl.mzstatic.com/image/thumb/Video211/v4/87/02/a6/8702a6b0-987d-7ced-3966-f6b7933b5a1a/Job74e9ba37-d69e-4605-9f97-21aea2ee3e60-202868511-PreviewImage_Preview_Image_Intermediate_nonvideo_sdr_396802048_2335341335-Time1757640236583.png/592x592bb.webp') center/cover no-repeat",
    lyrics: [
      "…",
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
      "…",
      "I will give you all my, all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love",
      "Give you all my love, oh-oh",
      "I give you all my love"
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
      const activeClass = index === 13 ? " is-active" : "";
      return `<p class="lyric-line${activeClass}">${line}</p>`;
    })
    .join("");
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

  audioPlayer.src = song.src || "";
  renderSongCards();
  renderQueue();
  renderLyrics(song);
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
  appShell.classList.add("lyric-mode");
  lyricView.hidden = false;
  setQueueOpen(false);
}

function closeLyricsView() {
  appShell.classList.remove("lyric-mode");
  lyricView.hidden = true;
}

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
