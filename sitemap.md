# Rondo♪ – Sitemap

## Cấu trúc file

```
rondo/
│
├── index.html                  → Redirect đến html/menu.html
│
├── html/
│   ├── log-in.html             → Trang đăng nhập / đăng ký
│   ├── menu.html               → Trang chính (SPA – 4 view)
│   └── About-us.html           → Trang giới thiệu
│
├── css/
│   ├── log-in.css
│   ├── menu.css                → Style chung cho menu.html
│   ├── liked-song.css          → Style cho Liked Songs & Recently Played
│   ├── lyric.css               → Style cho Lyric View
│   ├── popup.css               → Style cho Popup player
│   └── about-us.css            → Style cho About-us.html
│
├── js/
│   ├── log-in.js               → Xử lý đăng nhập / đăng ký
│   ├── auth-ui.js              → Cập nhật UI theo trạng thái đăng nhập
│   ├── fallback-song.js        → Dữ liệu bài hát dự phòng
│   ├── menu.js                 → Logic player, render bài hát, điều khiển audio
│   ├── liked-songs.js          → Lưu / đọc liked songs (localStorage)
│   ├── liked-song-page.js      → Quản lý 4 view SPA + render Liked Songs
│   ├── recently-played.js      → Render view Recently Played
│   ├── discover.js             → Render view Discover theo thể loại
│   ├── queue-filter.js         → Queue panel: thứ tự, drag-drop, liked-only mode
│   ├── lyric.js                → Lyric view: video nền, highlight lời theo thời gian
│   ├── popup.js                → Picture-in-picture popup player
│   └── fullscreen.js           → Chế độ toàn màn hình cho Lyric View
│
├── src/
│   ├── Attention.mp3
│   ├── back to friends.mp3
│   ├── CoNguoi.mp3
│   ├── dracula.mp3
│   ├── EmDau.mp3
│   ├── Ex's Hate Me.mp3
│   ├── Hãy Trao Cho Anh.mp3
│   ├── LoiNguocDong.mp3
│   ├── Mất Kết Nối.mp3
│   ├── Nơi Này Có Anh.mp3
│   ├── we dont talk anymore.mp3
│   └── disc.jpg                → Ảnh đĩa vinyl dùng cho hiệu ứng xoay
│
├── vid-bg/
│   ├── login-video-bg.mp4
│   ├── CoNguoi-video-bg.mp4
│   ├── EmDau-video-bg.mp4
│   └── LoiNguocDong-video-bg.mp4
│
└── song.json                   → Dữ liệu bài hát (id, title, artist, art, src, genre, lyrics, lyricTimestamps)
```

## Cấu trúc trang

```
Rondo♪
│
├── 🔐 Đăng nhập / Đăng ký  (log-in.html)
│   ├── Video nền (login-video-bg.mp4)
│   ├── Tab: Đăng nhập (email + mật khẩu)
│   ├── Tab: Đăng ký (email + mật khẩu + xác nhận)
│   └── → Chuyển hướng đến menu.html sau khi thành công
│
├── 🎵 Trang chính – SPA  (menu.html)
│   │
│   ├── Topbar (cố định trên cùng)
│   │   ├── Brand: Rondo♪
│   │   ├── Thanh tìm kiếm bài hát / nghệ sĩ
│   │   └── Nút Login / Avatar tài khoản
│   │
│   ├── Sidebar (desktop) / Bottom Nav (mobile)
│   │   ├── 🎵 Menu          → view Menu
│   │   ├── ❤️  Liked Songs   → view Liked Songs  (#liked)
│   │   ├── ▶️  Recently Played → view Recently Played (#recent)
│   │   ├── 🔀 Discover      → view Discover (#discover)
│   │   └── ℹ️  About us     → About-us.html
│   │
│   ├── [View: Menu]
│   │   ├── Hero – bài đang phát
│   │   │   ├── Ảnh bìa + đĩa vinyl xoay (animation khi play/pause)
│   │   │   └── Tên bài + nghệ sĩ
│   │   ├── Continue Listening – danh sách bài (song.json)
│   │   │   └── Tìm kiếm theo tên bài / nghệ sĩ
│   │   ├── Top phổ biến (top 5 bài đầu)
│   │   └── Nghệ sĩ phổ biến (click → lọc bài theo nghệ sĩ)
│   │
│   ├── [View: Liked Songs]
│   │   ├── Danh sách bài đã thích (localStorage)
│   │   │   ├── Click bài → phát nhạc
│   │   │   ├── Drag & drop → sắp xếp lại thứ tự
│   │   │   └── Nút unlike → bỏ thích
│   │   └── Empty state nếu chưa có bài
│   │
│   ├── [View: Recently Played]
│   │   ├── Lịch sử bài đã nghe (localStorage, tối đa 12 bài)
│   │   │   ├── Click bài → phát nhạc
│   │   │   └── Nút xóa từng bài
│   │   ├── Nút Clear All
│   │   └── Empty state nếu chưa có bài
│   │
│   ├── [View: Discover]
│   │   ├── Browse by Genre – lưới thể loại (V-Pop, Pop, Indie, ...)
│   │   │   └── Click thể loại → hiện danh sách bài
│   │   └── Danh sách bài theo thể loại đã chọn
│   │       └── Highlight bài đang phát
│   │
│   ├── Queue Panel (slide từ phải)
│   │   ├── Danh sách bài sắp phát
│   │   │   ├── Drag & drop → sắp xếp lại thứ tự
│   │   │   └── Click bài → phát ngay
│   │   └── Toggle "Liked Only" → chỉ phát bài đã thích
│   │
│   ├── Player Bar (cố định dưới cùng)
│   │   ├── Ảnh bìa + tên bài + nghệ sĩ
│   │   ├── Progress bar + thời gian hiện tại / tổng
│   │   ├── Controls: Repeat / Prev / Play-Pause / Next / Like
│   │   ├── Nút Lyric → mở Lyric View
│   │   ├── Nút Popup → Picture-in-picture player
│   │   └── Nút Queue → mở / đóng Queue Panel
│   │
│   └── Lyric View (fullscreen overlay)
│       ├── Video nền theo bài (nếu có file trong vid-bg/)
│       ├── Sidebar trái
│       │   ├── Ảnh bìa + tên bài + nghệ sĩ
│       │   ├── Progress bar + thời gian
│       │   ├── Controls: Repeat / Prev / Play-Pause / Next / Queue
│       │   └── Nút Like
│       ├── Lyric scroll (highlight dòng theo thời gian thực)
│       ├── Nút đóng Lyric View
│       └── Nút Fullscreen
│
└── ℹ️  About us  (About-us.html)
    ├── Topbar (Brand + Login)
    ├── Sidebar điều hướng (giống menu.html, About us is-active)
    ├── Hero: tiêu đề trang
    ├── Cards thông tin
    │   ├── Mục đích học tập
    │   ├── Bản quyền âm nhạc
    │   ├── Tài nguyên demo
    │   └── Dữ liệu người dùng
    └── Footer
        ├── Brand + mạng xã hội
        ├── Thông tin liên hệ
        ├── Team phát triển
        ├── Liên kết nhanh
        └── Kế hoạch (Premium / Student / Family)
```

## Luồng người dùng chính

```
Mở app (index.html)
  └── → menu.html
        ├── Chưa đăng nhập
        │     └── Login button → log-in.html
        │           ├── Đăng nhập / Đăng ký thành công
        │           └── → menu.html (đã xác thực)
        │
        ├── Nghe nhạc (Menu view)
        │     ├── Tìm kiếm bài / nghệ sĩ
        │     ├── Like bài → lưu localStorage
        │     ├── Mở Queue Panel → sắp xếp hàng đợi
        │     ├── Mở Lyric View → xem lời + video nền
        │     └── Mở Popup player (picture-in-picture)
        │
        ├── Xem & phát Liked Songs (drag-drop để sắp xếp)
        ├── Xem Recently Played (xóa từng bài hoặc clear all)
        ├── Khám phá theo thể loại (Discover)
        └── → About-us.html
```

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3 (Flexbox + Grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Dữ liệu bài hát | JSON (song.json) |
| Lưu trữ | localStorage (liked songs, recently played, queue order) |
| Icon | Font Awesome 6 |
| Font | Plus Jakarta Sans (Google Fonts) |
| Nhạc / Video | HTML5 Audio / Video API |
