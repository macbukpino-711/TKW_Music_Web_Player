# Rondo♪ – Sitemap

## Cấu trúc file

```
rondo/
│
├── index.html                  → Redirect đến html/menu.html
│
├── html/
│   ├── log-in.html             → Trang đăng nhập / đăng ký
│   ├── menu.html               → Trang chính (SPA)
│   └── About-us.html           → Trang giới thiệu
│
├── css/
│   ├── log-in.css
│   ├── menu.css
│   ├── liked-song.css
│   ├── lyric.css
│   ├── popup.css
│   └── about-us.css
│
├── js/
│   ├── log-in.js               → Xử lý đăng nhập / đăng ký
│   ├── auth-ui.js              → Cập nhật UI theo trạng thái đăng nhập
│   ├── fallback-song.js        → Bài hát mặc định khi chưa có dữ liệu
│   ├── menu.js                 → Logic trang chính, render bài hát
│   ├── liked-songs.js          → Lưu / đọc liked songs (localStorage)
│   ├── liked-song-page.js      → Render view Liked Songs
│   ├── recently-played.js      → Render view Recently Played
│   ├── discover.js             → Render view Discover (theo thể loại)
│   ├── queue-filter.js         → Lọc và quản lý hàng đợi phát nhạc
│   ├── lyric.js                → Lyric view, highlight theo thời gian
│   ├── popup.js                → Picture-in-picture popup player
│   └── fullscreen.js           → Xử lý chế độ toàn màn hình
│
├── src/
│   ├── *.mp3                   → File âm thanh
│   └── disc.jpg                → Ảnh đĩa vinyl
│
├── vid-bg/
│   ├── login-video-bg.mp4
│   ├── CoNguoi-video-bg.mp4
│   ├── EmDau-video-bg.mp4
│   └── LoiNguocDong-video-bg.mp4
│
└── song.json                   → Dữ liệu bài hát (tên, nghệ sĩ, ảnh, lyric...)
```

## Cấu trúc trang

```
Rondo♪
│
├── 🔐 Đăng nhập / Đăng ký (log-in.html)
│   ├── Video nền (login-video-bg.mp4)
│   ├── Form đăng nhập (email + mật khẩu)
│   ├── Form đăng ký (email + mật khẩu + xác nhận)
│   └── → Chuyển hướng đến menu.html sau khi thành công
│
├── 🎵 Trang chính – SPA (menu.html)
│   │
│   ├── Topbar
│   │   ├── Brand: Rondo♪
│   │   ├── Thanh tìm kiếm bài hát / nghệ sĩ
│   │   └── Nút Login / tài khoản
│   │
│   ├── Sidebar (desktop) / Bottom Nav (mobile)
│   │   ├── 🎵 Menu
│   │   ├── ❤️  Liked Songs
│   │   ├── ▶️  Recently Played
│   │   ├── 🔀 Discover
│   │   └── ℹ️  About us → About-us.html
│   │
│   ├── [View: Menu]
│   │   ├── Hero – bài hát đang phát (ảnh bìa + đĩa vinyl xoay)
│   │   ├── Continue Listening – danh sách bài hát (song.json)
│   │   ├── Top phổ biến
│   │   └── Nghệ sĩ phổ biến
│   │
│   ├── [View: Liked Songs]
│   │   ├── Danh sách bài đã thích (localStorage)
│   │   └── Empty state nếu chưa có bài
│   │
│   ├── [View: Recently Played]
│   │   ├── Lịch sử bài đã nghe (localStorage)
│   │   ├── Nút Clear All
│   │   └── Empty state nếu chưa có bài
│   │
│   ├── [View: Discover]
│   │   ├── Browse by Genre (lọc theo thể loại)
│   │   └── Danh sách bài theo thể loại đã chọn
│   │
│   ├── Queue Panel (slide từ phải)
│   │   ├── Danh sách bài sắp phát (kéo thả để sắp xếp)
│   │   └── Toggle lọc Liked Songs
│   │
│   ├── Player Bar (cố định dưới cùng)
│   │   ├── Ảnh bìa + tên bài + nghệ sĩ
│   │   ├── Progress bar + thời gian
│   │   ├── Controls: Repeat / Prev / Play-Pause / Next / Like
│   │   ├── Nút Lyric → mở Lyric View
│   │   ├── Nút Popup → Picture-in-picture
│   │   └── Nút Queue → mở Queue Panel
│   │
│   └── Lyric View (fullscreen overlay)
│       ├── Video nền theo bài (nếu có)
│       ├── Sidebar: ảnh bìa, tên bài, progress, controls, like
│       ├── Lyric scroll (highlight theo thời gian thực)
│       └── Nút fullscreen
│
└── ℹ️  About us (About-us.html)
    ├── Sidebar điều hướng (giống menu.html)
    ├── Mục đích học tập
    ├── Bản quyền âm nhạc
    ├── Tài nguyên demo
    ├── Dữ liệu người dùng
    └── Footer (thông tin, team, liên kết, mạng xã hội)
```

## Luồng người dùng chính

```
Mở app (index.html)
  └── → menu.html
        ├── Chưa đăng nhập → Login button → log-in.html
        │     ├── Đăng nhập / Đăng ký thành công
        │     └── → menu.html (đã xác thực)
        │
        ├── Nghe nhạc (Menu view)
        │     ├── Like bài → lưu localStorage
        │     ├── Mở Lyric View → xem lời + video nền
        │     └── Mở Popup player
        │
        ├── Xem Liked Songs
        ├── Xem Recently Played
        ├── Khám phá theo thể loại (Discover)
        └── → About-us.html
```

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3 (Flexbox + Grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Dữ liệu bài hát | JSON (song.json) |
| Lưu trữ | localStorage (liked songs, recently played) |
| Icon | Font Awesome 6 |
| Font | Plus Jakarta Sans (Google Fonts) |
| Nhạc / Video | HTML5 Audio / Video API |
