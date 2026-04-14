// Discover – browse by genre
const genreGrid = document.getElementById("genreGrid");
const genreSongsSection = document.getElementById("genreSongsSection");
const genreLabel = document.getElementById("genreLabel");
const genreTitle = document.getElementById("genreTitle");
const genreSongRow = document.getElementById("genreSongRow");

const genreColors = {
  "V-Pop":  "linear-gradient(135deg, rgba(124,58,237,0.75) 0%, rgba(168,85,247,0.60) 50%, rgba(236,72,153,0.55) 100%)",
  "Pop":    "linear-gradient(135deg, rgba(245,158,11,0.70) 0%, rgba(239,68,68,0.60) 50%, rgba(236,72,153,0.55) 100%)",
  "Indie":  "linear-gradient(135deg, rgba(6,182,212,0.70) 0%, rgba(59,130,246,0.60) 50%, rgba(99,102,241,0.55) 100%)",
  "Hip-Hop":"linear-gradient(135deg, rgba(249,115,22,0.70) 0%, rgba(234,179,8,0.60) 50%, rgba(132,204,22,0.55) 100%)",
  "EDM":    "linear-gradient(135deg, rgba(14,165,233,0.70) 0%, rgba(34,211,238,0.60) 50%, rgba(163,230,53,0.55) 100%)",
  "R&B":    "linear-gradient(135deg, rgba(139,92,246,0.75) 0%, rgba(236,72,153,0.60) 50%, rgba(244,63,94,0.55) 100%)",
  "Jazz":   "linear-gradient(135deg, rgba(139,64,14,0.80) 0%, rgba(217,119,6,0.65) 50%, rgba(251,191,36,0.55) 100%)",
  "Ballad Pop": "linear-gradient(135deg, rgba(236,72,153,0.65) 0%, rgba(168,85,247,0.55) 50%, rgba(99,102,241,0.50) 100%)",
};

let activeGenre = null;

function getGenres() {
  const songs = window.rondoPlayer.getSongs();
  const genres = [...new Set(songs.map(s => s.genre).filter(Boolean))];
  return genres;
}

function renderGenreGrid() {
  const genres = getGenres();
  genreGrid.innerHTML = genres.map(genre => `
    <button class="genre-card ${activeGenre === genre ? "is-active" : ""}"
      data-genre="${genre}"
      style="background: ${genreColors[genre] ?? "linear-gradient(135deg, rgba(109,93,252,0.25) 0%, rgba(77,141,255,0.15) 100%)"}">
      ${genre}
    </button>
  `).join("");
}

function renderGenreSongs(genre) {
  const allSongs = window.rondoPlayer.getSongs();
  const filtered = allSongs.filter(s => s.genre === genre);
  const currentSong = window.rondoPlayer.getCurrentSong();

  genreLabel.textContent = "Genre";
  genreTitle.textContent = genre;
  genreSongsSection.hidden = false;

  genreSongRow.innerHTML = filtered.map(song => {
    const index = allSongs.indexOf(song);
    const isActive = currentSong?.id === song.id;
    return `
      <article class="song-card ${isActive ? "is-active" : ""}" data-song-index="${index}">
        <div class="song-card-art" style="background:${song.art}"></div>
        <strong class="song-card-title">${song.title}</strong>
        <span class="song-card-artist">${song.artist}</span>
      </article>
    `;
  }).join("");
}

genreGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".genre-card[data-genre]");
  if (!card) return;
  activeGenre = card.dataset.genre;
  renderGenreGrid();
  renderGenreSongs(activeGenre);
});

genreSongRow.addEventListener("click", (e) => {
  const card = e.target.closest(".song-card[data-song-index]");
  if (!card) return;
  window.rondoPlayer.playSong(Number(card.dataset.songIndex));
});

window.addEventListener("songchange", () => {
  if (activeGenre) renderGenreSongs(activeGenre);
});

window.renderDiscoverView = function() {
  renderGenreGrid();
  if (activeGenre) renderGenreSongs(activeGenre);
};
