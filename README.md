

## Giới thiệu

Rondo là một music player chạy trên trình duyệt, được phát triển trong khuôn khổ môn học Thiết kế Web. Dự án tập trung vào việc xây dựng trải nghiệm nghe nhạc hoàn chỉnh mà không phụ thuộc vào bất kỳ framework hay thư viện UI nào.

---

## Tính năng chính

- Phát nhạc với đầy đủ controls: play/pause, chuyển bài, lặp lại, tua
- Xem lời bài hát đồng bộ theo thời gian thực kèm video nền
- Quản lý danh sách yêu thích với kéo thả để sắp xếp
- Lịch sử nghe gần đây
- Khám phá bài hát theo thể loại
- Hàng đợi phát nhạc có thể tùy chỉnh thứ tự
- Tìm kiếm theo tên bài hát hoặc nghệ sĩ
- Popup player dạng picture-in-picture
- Đăng nhập / đăng ký
- Giao diện responsive cho cả desktop và mobile

---

## Hướng dẫn chạy

Dự án cần chạy qua local server do sử dụng `fetch` để đọc `song.json`.

**VS Code — Live Server:**
Chuột phải vào `index.html` → chọn *Open with Live Server*


---

## Cấu trúc thư mục

```
rondo/
├── index.html
├── html/
│   ├── menu.html           # Trang chính (SPA)
│   ├── log-in.html         # Đăng nhập / Đăng ký
│   └── About-us.html       # Giới thiệu
├── css/
│   ├── menu.css
│   ├── liked-song.css
│   ├── lyric.css
│   ├── popup.css
│   ├── log-in.css
│   └── about-us.css
├── js/
│   ├── menu.js             # Logic player chính
│   ├── liked-song-page.js  # Quản lý SPA views
│   ├── liked-songs.js      # Liked songs
│   ├── recently-played.js  # Recently played
│   ├── discover.js         # Discover theo thể loại
│   ├── queue-filter.js     # Queue & drag-drop
│   ├── lyric.js            # Lyric view
│   ├── popup.js            # Picture-in-picture
│   ├── fullscreen.js       # Fullscreen
│   ├── auth-ui.js          # Trạng thái đăng nhập
│   ├── log-in.js           # Xử lý auth
│   └── fallback-song.js    # Dữ liệu dự phòng
├── src/                    # File âm thanh (.mp3)
├── vid-bg/                 # Video nền (.mp4)
└── song.json               # Dữ liệu bài hát
```

---

## Cấu trúc dữ liệu bài hát

```json
{
  "id": 0,
  "title": "Tên bài hát",
  "artist": "Nghệ sĩ",
  "src": "../src/filename.mp3",
  "art": "url('https://...') center/cover no-repeat",
  "genre": "V-Pop",
  "video": "../vid-bg/filename.mp4",
  "lyrics": ["Dòng 1", "Dòng 2"],
  "lyricTimestamps": [12.5, 15.3]
}
```

Các trường `video`, `lyrics`, `lyricTimestamps` là tùy chọn. Để `src` trống nếu chưa có file âm thanh.

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3 (Flexbox, Grid, Custom Properties) |
| Logic | Vanilla JavaScript (ES6+) |
| Lưu trữ | localStorage |
| Media | HTML5 Audio / Video API |
| Icon | Font Awesome 6 |
| Font | Plus Jakarta Sans (Google Fonts) |

---

## Nhóm phát triển

| Thành viên | Vai trò |
|---|---|
| Don | Phát triển |
| Tiến Đạt | Phát triển |
| Thùy Dương | Phát triển |
| Xuân Dương | Phát triển |

---

*Dự án học tập — không nhằm mục đích thương mại.*
