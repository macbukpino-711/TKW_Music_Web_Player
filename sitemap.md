# RondoSpace – Sitemap

## Cấu trúc trang

```
RondoSpace
│
├── 🔐 Đăng nhập / Đăng ký (log-in.html)
│   ├── Form đăng nhập (email + mật khẩu)
│   ├── Form đăng ký (email + mật khẩu + xác nhận)
│   └── → Chuyển hướng đến Menu sau khi thành công
│
├── 🎵 Menu – Trang chính (menu.html)
│   ├── Topbar
│   │   └── Brand: RondoSpace
│   │
│   ├── Sidebar / Bottom Nav (mobile)
│   │   ├── Menu (view chính)
│   │   ├── Liked Songs (view trong cùng trang)
│   │   └── Disclaimer → disclaimer.html
│   │
│   ├── [View: Menu]
│   │   ├── Hero – Today's Song (bài hát nổi bật)
│   │   └── Library – Continue Listening (danh sách bài hát)
│   │       └── Click bài → phát nhạc
│   │
│   ├── [View: Liked Songs] (SPA – không reload trang)
│   │   ├── Danh sách bài hát đã thích
│   │   │   ├── Click bài → phát nhạc
│   │   │   └── Click tim đỏ → bỏ thích
│   │   └── Empty state (chưa có bài nào)
│   │
│   ├── Queue Panel (slide từ phải)
│   │   └── Danh sách bài hát sắp phát
│   │
│   ├── Player Bar (cố định dưới cùng)
│   │   ├── Ảnh bìa + tên bài + nghệ sĩ
│   │   ├── Progress bar + thời gian
│   │   ├── Controls: Repeat / Prev / Play-Pause / Next / Like
│   │   ├── Nút Lyric → mở Lyric View
│   │   └── Nút Queue → mở Queue Panel
│   │
│   └── Lyric View (fullscreen overlay)
│       ├── Video nền (nếu có)
│       ├── Sidebar: ảnh bìa, tên bài, controls, progress
│       ├── Like button
│       └── Lyric scroll (highlight theo thời gian thực)
│
└── 📄 Disclaimer (disclaimer.html)
```

## Luồng người dùng chính

```
Mở app
  └── log-in.html
        ├── Đăng nhập thành công
        └── → menu.html
              ├── Nghe nhạc (Menu view)
              ├── Like bài → lưu localStorage
              ├── Xem Liked Songs (toggle view)
              ├── Mở Lyric View
              └── Xem Disclaimer
```

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3 (Flexbox + Grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Dữ liệu bài hát | JSON (fetch/AJAX) |
| Lưu trữ liked songs | localStorage |
| Icon | Font Awesome 6 |
| Font | Plus Jakarta Sans (Google Fonts) |
| Nhạc/Video | HTML5 Audio/Video API |
