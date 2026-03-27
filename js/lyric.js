const songCover = document.getElementById("songCover");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const lyricBody = document.getElementById("lyricBody");
const lyricBackdrop = document.getElementById("lyricBackdrop");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const repeatButton = document.getElementById("repeatButton");
const progressInput = document.getElementById("progressInput");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const audioPlayer = document.getElementById("audioPlayer");

const song = {
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
};

let repeatOne = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function paintProgress(value) {
  const percentage = `${value}%`;
  progressInput.style.setProperty(
    "--progress-background",
    `linear-gradient(90deg, #7d7cff 0%, #4d8dff ${percentage}, rgba(255, 255, 255, 0.18) ${percentage}, rgba(255, 255, 255, 0.18) 100%)`
  );
}

function renderLyrics() {
  lyricBody.innerHTML = song.lyrics
    .map((line, index) => {
      const activeClass = index === 13 ? " is-active" : "";
      return `<p class="lyric-line${activeClass}">${line}</p>`;
    })
    .join("");
}

function setupSong() {
  songCover.style.background = song.art;
  lyricBackdrop.style.background = song.art;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audioPlayer.src = song.src;
  renderLyrics();
}

function togglePlayback() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    return;
  }

  audioPlayer.pause();
}

playButton.addEventListener("click", togglePlayback);

prevButton.addEventListener("click", () => {
  audioPlayer.currentTime = 0;
});

nextButton.addEventListener("click", () => {
  audioPlayer.currentTime = audioPlayer.duration || audioPlayer.currentTime;
});

repeatButton.addEventListener("click", () => {
  repeatOne = !repeatOne;
  audioPlayer.loop = repeatOne;
  repeatButton.classList.toggle("is-active", repeatOne);
});

progressInput.addEventListener("input", () => {
  if (!audioPlayer.duration) {
    return;
  }

  const nextTime = (Number(progressInput.value) / 100) * audioPlayer.duration;
  audioPlayer.currentTime = nextTime;
  paintProgress(Number(progressInput.value));
});

audioPlayer.addEventListener("play", () => {
  playButton.classList.add("is-playing");
});

audioPlayer.addEventListener("pause", () => {
  playButton.classList.remove("is-playing");
});

audioPlayer.addEventListener("loadedmetadata", () => {
  durationTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audioPlayer.currentTime);

  if (audioPlayer.duration) {
    const progressValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressInput.value = String(progressValue);
    paintProgress(progressValue);
  }
});

setupSong();
paintProgress(0);
