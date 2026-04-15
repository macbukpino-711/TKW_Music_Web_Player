# Rondo♪

Ứng dụng nghe nhạc web được xây dựng bằng HTML, CSS và Vanilla JavaScript thuần — không framework, không thư viện ngoài.

> Dự án học tập trong khuôn khổ môn Thiết kế Web. Không nhằm mục đích thương mại.

---

## Tính năng

- Phát nhạc với đầy đủ controls: play/pause, next/prev, repeat, seek
- Xem lời bài hát đồng bộ theo thời gian thực với video nền
- Liked Songs: thêm/bỏ thích, sắp xếp bằng drag & drop
- Recently Played: lịch sử nghe, xóa từng bài hoặc clear all
- Discover: duyệt bài hát theo thể loại (V-Pop, Pop, Indie, Hip-Hop, EDM, R&B, Jazz, Ballad Pop)
- Queue panel: sắp xếp hàng đợi bằng drag & drop, chế độ Liked Only
- Tìm kiếm bài hát và nghệ sĩ
- Picture-in-picture popup player
- Đăng nhập / Đăng ký (localStorage)
- Responsive: sidebar trên desktop, bottom nav trên mobile

---

## Cấu trúc dự án

```
rondo/
├── index.html              → Redirect đến html/menu.html
├── html/
│   ├── menu.html           → Trang chính (SPA)
│   ├── log-in.html         → Đăng nhập / Đăng ký
│   └── About-us.html       → Giới thiệu
├── css/
│   ├── menu.css
│   ├── liked-song.css
│   ├── lyric.css
│   ├── popup.css
│   ├── log-in.css
│   └── about-us.css
├── js/
│   ├── menu.js             → Logic player chính
│   ├── liked-song-page.js  → Quản lý SPA views
│   ├── liked-songs.js      → Liked songs (localStorage)
│   ├── recently-played.js  → Recently played (localStorage)
│   ├── discover.js         → Browse by genre
│   ├── queue-filter.js     → Queue & drag-drop
│   ├── lyric.js            → Lyric view
│   ├── popup.js            → Picture-in-picture
│   ├── fullscreen.js       → Fullscreen
│   ├── auth-ui.js          → Auth UI state
│   ├── log-in.js           → Đăng nhập / Đăng ký
│   └── fallback-song.js    → Dữ liệu dự phòng
├── src/                    → File âm thanh (.mp3) + disc.jpg
├── vid-bg/                 → Video nền cho Lyric View (.mp4)
└── song.json               → Dữ liệu bài hát
```

---

## Chạy dự án

Không cần cài đặt gì. Chỉ cần mở bằng một local server (do dùng `fetch` để đọc `song.json`):

**VS Code – Live Server:**
Chuột phải vào `index.html` → *Open with Live Server*

**Hoặc dùng terminal:**
```bash
npx serve .
```

Sau đó truy cập `http://localhost:3000` (hoặc port tương ứng).

> Mở trực tiếp file `index.html` bằng `file://` sẽ bị lỗi CORS khi fetch `song.json`.

---

## Dữ liệu bài hát

Bài hát được định nghĩa trong `song.json`. Mỗi bài có cấu trúc:

```json
{
  "id": 0,
  "title": "Tên bài",
  "artist": "Nghệ sĩ",
  "src": "../src/ten-file.mp3",
  "video": "../vid-bg/ten-file.mp4",
  "art": "url('...') center/cover no-repeat",
  "genre": "V-Pop",
  "lyrics": ["Dòng lời 1", "Dòng lời 2"],
  "lyricTimestamps": [12.5, 15.3]
}
```

- `video` và `lyricTimestamps` là tuỳ chọn
- Nếu không có `src`, bài sẽ hiển thị nhưng không phát được

---

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3 (Flexbox + Grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Lưu trữ | localStorage |
| Icon | Font Awesome 6 |
| Font | Plus Jakarta Sans (Google Fonts) |
| Nhạc / Video | HTML5 Audio / Video API |

---

## Team phát triển

Don · Tiến Đạt · Thùy Dương · Xuân Dương

© 2025 Rondo♪ · Dự án học tập · Không vì mục đích thương mại
