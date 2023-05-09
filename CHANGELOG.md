# Changelog

## ZaDark v23.5.4
> PC v8.0 && Web v8.13

### Added
- Bổ sung cho chức năng: Ẩn "Tin nhắn" trong Cuộc trò chuyện
  - Hỗ trợ ẩn tin nhắn có 2 ảnh trở lên (photo group)
  - Hỗ trợ ẩn cuộc gọi
  - Hỗ trợ ẩn nhắc nhở
  - Hỗ trợ ẩn các sự kiện (thành viên rời nhóm, hoàn thành công việc,...)
  - Hỗ trợ ẩn tin nhắn được ghim

#### PC specific
- Thêm chức năng: Ẩn trạng thái "Đang soạn tin nhắn ..."
- Thêm chức năng: Ẩn trạng thái "Đã nhận" tin nhắn
- Thêm chức năng: Ẩn trạng thái "Đã xem" tin nhắn

## ZaDark v23.5.3
> PC v7.14 && Web v8.12

### Added
- Thêm cài đặt Riêng tư : Ẩn "Tin nhắn" trong Cuộc trò chuyện
  - Chức năng giúp ngăn chặn người khác nhìn trộm tin nhắn của bạn
  - Di chuyển chuột vào Vùng hiển thị tin nhắn xem tin nhắn
- Thêm Tooltip giải thích cho các cài đặt Riêng tư

### Fixed
- `.zadark-select`: cursor pointer

## ZaDark v23.5.2
> PC v7.13 && Web v8.11

### Fixed
- Modal: Bỏ hiệu ứng mờ khi mờ nền (Hiệu ứng mờ nền có thể làm Zalo bị dựt khi mở Modal ở những máy tính có cấu hình thấp)
- ZaDark Popup: Bỏ định dạng rtl (right to left) ở lựa chọn Phông chữ
- ZaDark Popup: Sửa lỗi màu nền của danh sách lựa chọn Phông chữ

## ZaDark v23.5.1
> PC v7.12 && Web v8.10

### Added
- ZaDark Popup: Thêm Menu Bình chọn, Phản hồi

### Changed
- ZaDark Popup: Làm gọn lựa chọn Phông chữ

## ZaDark v23.4.4
> PC v7.11 && Web v8.9

### Changed
- Giảm độ mờ (blur) và tối ưu Modal Backdrop

### Fixed
- Canh giữa theo chiều dọc của tin nhắn được ẩn (••••••)
- Khắc phục lỗi biểu tượng "Play" tin nhắn audio bị mất

## ZaDark v23.4.3
> PC v7.10 && Web v8.8

### Added
- Thêm dấu hiệu nhận biết khi ZaDark cập nhật phiên bản mới (Dấu chấm đỏ ở Menu ZaDark trên Zalo)
  - Tính năng giúp bạn biết được ZaDark đã thay đổi những gì ở mỗi bản cập nhật
  - Nhấn vào Menu ZaDark > Tên phiên bản để xem thay đổi trong bản cập nhật
- Thêm cài đặt Riêng tư : Ẩn "Tin nhắn gần nhất" ở Danh sách trò chuyện (Bên trái)
  - Tính năng hạn chế người khác nhìn lén nội dung tin nhắn gần nhất của bạn với bạn bè ở Danh sách trò chuyện (Bên trái)
  - Tin nhắn sẽ hiển thị khi bạn rê chuột vào cuộc trò chuyện
  - Tin nhắn của cuộc trò chuyện hiện tại sẽ không bị ẩn

## ZaDark v23.4.2
> PC v7.9 && Web v8.7

### Added
- Thêm phông chữ : Source Sans Pro

### Changed
- Thay đổi màu sắc chữ và viền của "Tab trò chuyện", "Tab Sticker", "Tab Kho lưu trữ" : Chuyển từ xanh dương sang trắng
- Bo tròn ô tìm kiếm
- Thay đổi màu nền khi double-click vào tin nhắn (highlighted)

### Fixed
- Sửa lỗi màu icon và chữ của trạng thái tập tin "Lưu bền cloud (Cloud saved)" bị mờ khó đọc
- Sửa lỗi Tab Kho lưu trữ bị lệch nội dung
- Sửa lỗi tiêu đề "Kho lưu trữ, Danh sách nhắc hẹn" và các nút ở chi tiết cuộc trò chuyện bị lệch

#### Web specific
- Sửa lỗi cài đặt riêng tư trở về mặc định sau khi cập nhật phiên bản mới
- Sửa lỗi không thể ẩn trạng thái "Đã nhận" tin nhắn trong cuộc trò chuyện mã hoá đầu cuối (E2EE)
- Cập nhật logic cài đặt riêng tư : Gửi yêu cầu cập nhật đến "Service Worker" của tiện ích để xử lý

## ZaDark v23.4.1
> PC v7.8 && Web v8.6

### Added
- Thêm nhãn `Chưa hỗ trợ trên [Zalo PC, Firefox]` cho tính năng Riêng tư

### Changed
- Làm gọn nhãn `Business` ở tên cuộc trò chuyện
- Làm gọn Cài đặt phông chữ
- Bỏ nội dung giới thiệu ZaDark ở màn hình Chào mừng

## ZaDark v23.3.2
> PC v7.7 && Web v8.5

### Added
- Tuỳ chỉnh Phông chữ:
  - Mặc định (Phông chữ gốc của Zalo)
  - Open Sans (Phông chữ gốc của ZaDark)
  - Inter
  - Roboto
  - Lato

### Changed
- Làm gọn giao diện Tuỳ chỉnh ZaDark (ZaDark Popup)
- Đổi tên giao diện "Tự động" thành "Theo hệ thống" và bỏ giải thích "Giao diện Zalo sẽ thay đổi theo Hệ điều hành"

## ZaDark v23.3.1

### Changed
- Thay thế dấu `.` thành `_` ở tên phiên bản trong tên của tập tin cài đặt (Giải quyết vấn đề macOS không xác định được định dạng của tập tin cài đặt là `Unix Executable File`)

## ZaDark v23.2.1
> PC v7.6 && Web v8.4

### Changed
- `.disk-usage-chart > .another-app-usage` : Thay đổi màu nền
- `.setting-section-content__theme` : Ẩn cài đặt giao diện của Zalo vì chỉ có 1 lựa chọn giao diện Mặc định
- `.bubble-contact-card` : Cập nhật màu sắc của viền (border-color)
- `.slideshow__page__text__title` : Cập nhật chữ đậm hơn (500)
- `.conv-item-title__name` : Cập nhật chữ đậm hơn (500)
- `.lock-icon` : Cập nhật màu của Biểu tượng mã hoá đầu cuối (E2EE) nhạt hơn
- `.slideshow__page__image` : Thay đổi độ bo tròn góc (16px)
- `ZaDark Settings` : Tăng độ bo tròn góc (8px)
- `ZaDark Settings` : Làm gọn nhãn "ZaDark from Quaric"
- `ZaDark Settings` : Bỏ Menu Website và Donate trên Header (Mục đích loại bỏ nội dung không cần thiết với người dùng)

## ZaDark v23.1.3
> PC v7.5 && Web v8.3

### Added
#### PC specific (Windows)
- Notification : Hỗ trợ Dark Mode cho Hộp thoại thông báo ở góc phải dưới trên Windows

### Fixed
- `.leftbar-unread` : Làm gọn kích thước nhãn chưa đọc tin nhắn
- `.conv-action__unread` : Thay đổi màu nền (xanh dương thành đỏ)

## ZaDark v23.1.2
> PC v7.4 && Web v8.2

### Fixed
- Settings : Sửa lỗi màu nền MenuLeft không tương phản tốt
- `.conv--unreadMark` : Làm gọn kích thước biểu tượng chưa đọc tin nhắn (Dấu chấm đỏ)
- `.zavatar-online` : Tăng kích thước biểu tượng Trực tuyến (Dấu chấm xanh lá)

### Changed
- Welcome : Cập nhật màu nền Trang chào mừng
- Welcome : Cập nhật Tiêu đề chào mừng
- Welcome : Cập nhật màu chữ Nút chuyển slide (`<`, `>`)
- App Lock : Cập nhật fontSize, textColor
- `.chat-date` : Cập nhật màu nền và màu chữ
- `.message-view__guide, .tds-bubble-info-ecard__container` : Cập nhật màu nền
- `.event-message, .onboard-message` : Cập nhật màu nền

## ZaDark v23.1.1
> PC v7.3 && Web v8.1

### Fixed
- Button: Cập nhật bảng màu theo cập nhật của Zalo
- Settings: Cập nhật màu nền MenuLeft

#### PC specific (macOS)
- Sửa lỗi khoảng cách Avatar và macOS TitleBar ở Zalo Tabs quá lớn

### Changed
- LeftTab: Thay đổi giao diện khi Hover, Selected TabItem
- QuoteLine: Thay đổi chiều rộng và bo tròn của trích dẫn tin nhắn

## ZaDark v22.12.5
> PC v7.2

### Fixed
#### PC specific
- Sửa lỗi khoảng cách giữa phần "Giao diện" và "ZaDark from Quaric" ở ZaDark Popup
- Cập nhật mô tả cho "Giao diện tự động"

## ZaDark v22.12.4

### Changed
#### PC (macOS) specific
- Thay đổi cách đóng gói ZaDark PC (macOS)

## ZaDark v22.12.3
> PC v7.1

### Fixed
#### PC specific
- Sửa lỗi hiển thị sai phần Cài đặt riêng tư. Cài đặt riêng tư chỉ có trên ZaDark Web

## ZaDark v22.12.2
> PC v7.0 && Web v8.0

### Added
- Thêm Menu tuỳ chỉnh ZaDark vào Menu bên trái của Zalo. Kể từ PC v7.0, Web 8.0 người dùng có thể tuỳ chỉnh ZaDark ngay trên Zalo

### Changed
#### PC specific
- Thay đổi Flow tuỳ chỉnh giao diện và cài đặt giao diện tối
#### Web specific
- Thay đổi Flow tuỳ chỉnh giao diện và chức năng riêng tư
- ZaDark for Opera: Nâng cấp lên Manifest v3

### Fixed
- Sửa lỗi Avatar Alpha
#### Web specific
- Sửa giao diện Banner Download Zalo PC

### Removed
#### PC specific
- Xoá Menu Cài giao diện thay đổi theo hệ điều hành. Kể từ v7.0 người dùng có thể tuỳ chỉnh ZaDark ngay trên Zalo mà không cần phải chạy lại chương trình ZaDark PC
#### Web specific
- Xoá Menu GitHub
- Xoá giao diện xem lịch sử thay đổi trên Extension khi click vào Tên phiên bản. Kể từ v8.0 người dùng có thể xem lịch sử thay đổi trên Website chính thức bằng cách click vào Tên phiên bản

## ZaDark v22.12.1
> PC v6.1 && Web v7.1

### Changed
- Thêm nhận diện thương hiệu của Nhà phát hành
- Cập nhật địa chỉ Website chính thức sang https://zadark.quaric.com
- Thêm Menu "Donate"

## ZaDark v22.11.2
> PC v6.0 && Web v7.0

### Fixed
- Sửa lỗi hiển thị sai màu sắc do Zalo Web có sự thay đổi lớn lần 2 về bảng màu (Colors CSS Variables) từ ngày 22/11/2022
- Sẵn sàng cho sự thay đổi lớn về bảng màu (Colors CSS Variables) trên Zalo PC
- `.quote-line`
- `.card a`

## ZaDark v22.11.1
> PC v5.6 && Web v.6.6

### Fixed
- `.item-calendar-preview > .date` : Sửa lỗi màu sắc của "Ngày" trong Calendar Preview
- `.message-view` : Sửa lỗi Font chữ của nội dung tin nhắn không phải là Font "Open Sans"
- `.reminder-info-v2 > .wd-time__txt` : Sửa lỗi màu sắc của "Ngày" của Calendar trong Reminder

## ZaDark v22.9.6
> PC v5.5 && Web v6.5

### Changed
- `.card--undo` : Bỏ hiệu ứng mờ cho tin nhắn được thu hồi
- `:selection` : Cập nhật màu nền khi tô khối chữ
- `colors` : Thay đổi màu sắc sáng hơn (Red, Orange, Yellow, Green, Teal, Purple và Pink)
- `.popover-v2, .popover-v3, .zmenu-body.content-only` : Cập nhật hiệu ứng đổ bóng cho Popover, Menu
### Fixed
- `.chat-message.highlighted` : Sửa lỗi màu sắc tin nhắn highlighted
- `.z--btn--fill--secondary-red:hover` : Sửa lỗi màu chữ khi rê chuột vào nút (viền đỏ)
#### Web specific
- `.nav__tabs__zalo` (Safari)

## PC v5.4 && Web v6.4
### Changed
- `scrollbar` : Cập nhật màu nền nhạt hơn cho thanh cuộn
- `self-bubble-chat` : Cập nhật màu nền tin nhắn của tôi (Màu sắc giống trên Zalo Mobile)
- `.z-tooltip` : Cập nhật Dark Mode cho Tooltip
- `.user-reacted-container` : Cập nhật Dark Mode cho "Danh sách bày tỏ cảm xúc"
- `.toast-v2` : Cập nhật Dark Mode cho Toast v2
- `::selection` : Cập nhật màu nền khi tô khối chữ
### Fixed
- `.zl-avatar__badge` : Sửa lỗi màu sắc của biểu tượng "Đang trực tuyến" ở Avatar
- `tab-bar-item` : Sửa lỗi Tab Bar Item không nằm giữa ở mục "Thông tin hội thoại"

## PC v5.3
### Added
- ZaDark PC v5.x
### Fixed
- `.zl-avatar__badge` : Sửa lỗi màu sắc của biểu tượng "Đang trực tuyến" ở Avatar
- `.title-name.unfocus` : Sửa lỗi tiêu đề TitleBar hiển thị màu đen khi Unfocus Zalo
### Removed
- ZaDark PC <= v4.x

## PC v4.14 && PC v5.2 && Web v6.3
### Changed
- `.leftbar-mark-unread` : Thay đổi kích thước và vị trí đẹp hơn

## PC v4.12
### Changed
- macOS : Mở trang hướng dẫn [ZaDark for macOS](https://zadark.ncdaistudio.com/pc/macos) sau khi giải nén tập tin pkg
### Fixed
- Sửa lỗi màu sắc cho giao diện "Đặt mã PIN" ẩn cuộc trò chuyện
- macOS : Sửa lỗi các chức năng không hoạt động khi không chạy ZaDark for macOS với quyền Root

## PC v5.1 && Browser v6.2
### Added
#### Browser specific (Safari)
- Thêm "ZaDark Website" vào Menu Help
### Changed
#### Browser specific
- Trải nghiệm chọn "Giao diện" nhanh hơn
- Tên các chức năng ở phần "Riêng tư" dễ hiểu hơn
#### PC specific
- Sẵn sàng cho sự thay đổi lớn về bảng màu (Colors CSS Variables) trên Zalo PC
- Tên các chức năng dễ hiểu hơn
- macOS : Mở trang hướng dẫn [ZaDark for macOS](https://zadark.ncdaistudio.com/pc/macos) sau khi giải nén tập tin pkg

### Fixed
- Sửa lỗi hiển thị sai màu sắc do Zalo Web có sự thay đổi lớn về bảng màu (Colors CSS Variables) từ ngày 31/08/2022
- Sẵn sàng cho sự thay đổi lớn về bảng màu (Colors CSS Variables) trên Zalo PC
- Sửa lỗi màu sắc cho giao diện "Đặt mã PIN" ẩn cuộc trò chuyện
#### PC specific (macOS)
- Sửa lỗi các chức năng không hoạt động khi không chạy ZaDark for macOS với quyền Root
### Removed
- Dark dimmed

## PC v4.11 && Browser v5.6
### Changed
- `.zl-modal` : Thêm hiệu ứng mờ cho nền.

## PC v4.10 && Browser v5.5
### Fixed
- Zalo Business

## PC v4.9 & Browser v5.4
### Fixed
- `.setting-menu` : Sửa lỗi chữ "Resource management" xuống dòng.
- `.cb-info-file-item__actions-container` : Sửa lỗi màu nền sai khi rê chuột vào File (Media Store Preview).
- `.chat-info-link__action` : Sửa lỗi mất màu nền khi rê chuột vào Link (Media Store Preview).
- `.media-store-preview-item > .image-menu-container` : Sửa lỗi màu nền sai khi rê chuột vào Photo/Video (Media Store Preview).
- `.z-business-label` : Sửa lỗi nhãn "Business" quá to không đẹp.

### Changed
#### Browser specific (Edge)
- Upgrade manifest `v2` to `v3`

## PC v4.8 & Browser v5.3
### Fixed
- Chat Onboard : `.slideshow__page__image` `.slideshow__page__text__title` `.slideshow__bottom`
#### PC specific
- Fixed a bug that sometimes needed sudo privileges to install ZaDark for macOS

## PC v4.7 & Browser v5.2
### Fixed
- Button Add friend : `.user-profile-button.rg`
- Button Secondary : `.z--btn--fill--secondary`
- Button Secondary Red : `.z--btn--fill--secondary-red`
- Chat Onboard : `.slideshow__page__image`

### Changed
#### PC specific
- New workflow:
  - Step 1. Extract `resources/app.asar` to `resources/app`
  - Step 2. Inject CSS to `resources/app`
  - Step 3. Create package `resources/app.asar` from `resources/app`

## PC v4.6 & Browser v5.1

### Added
#### Browser specific (Chrome, Safari, Edge, Opera)
- Block `delivered`
#### PC specific
- Allow customizing Zalo path

### Fixed
- `#copyExcel`
- `.message-view__banner.offline`
- `.message-view__banner--no-message-mutualGroup`
- `.img-msg-v2.-admin > .img-msg-v2__bub`

### Changed
- ZaDark Logo Icon

## Browser v5.0
### Added
#### Browser specific (Chrome, Safari, Edge, Opera)
- Block `seen`
- Block `typing`

## Browser v4.5
### Changed
#### Browser specific
- Add `_locales/vi`

## Browser v4.4
### Changed
#### Browser specific
- `manifest.json` : update description

## Browser v4.3
### Changed
#### Browser specific
- Convert English to Vietnamese

## PC v4.5

### Changed
#### PC specific
- Convert English to Vietnamese

## PC v4.4 & Browser v4.2

### Changed
- `zadark brand` : change "ZaDark – Best Dark Theme for Zalo" to "ZaDark – Zalo Dark Mode"
- `chat-input highlight` : remove blue line
- `conv-item pinned` : remove background

### Fixed
- `font` : update font files

## PC v4.3 & Browser v4.1

> 2022-03-24

### Added
- Safari Extension

### Changed
- Use `local font source` instead of `online font source`
- Change the algorithm to build code for pc
#### Browser specific
- Replace `ZaDark` with `SVG Logo` in Header

### Removed
- `@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap");`

## PC v4.2 & Browser v4.0

> 2022-03-22

### Changed
#### PC specific
- Build tool: replace `nexe` with `pkg`
- Header: update website to https://zadark.ncdaistudio.com

#### Browser specific
- manifest.json homepage_url: https://zadark.ncdaistudio.com
- Header: remove `About`, rename `Docs` to `Website`
- After installation, open `https://zadark.ncdaistudio.com/browser-ext/***` instead of `chrome-extension:@id/welcome.html`

### Removed
#### Browser specific
- Remove `welcome.html`

### Security
#### PC specific
- macOS codesign and notarize

## PC v4.1 & Browser v3.9

> 2022-03-18

### Added
- Edge Extension

### Fixed
- `.z-toggle > div`
- `.todo-filter-input`

## PC v4.0

> 2022-03-11

### Added
#### PC specific

- Sync with System (Zalo theme will match your system settings)
- Changelog (https://short.ncdaistudio.com/zadark-github/blob/main/CHANGELOG.md)

## v3.8

> 2022-03-10

### Added
#### PC specific
- Add warning: "TO BE SAFE, before installing make sure you have downloaded this program from: https://sourceforge.net/projects/zadark/files/ZaDarkPC/" (PC only)

### Fixed
- `#scroll-vertical > div`
- `.file-icon__ext-text`
- `.conv-message.progress-bar .progress-track`
- `.file-progress__track`

## v3.7

> 2022-03-09

### Added
#### Browser specific
- Opera Extension

### Fixed
- `.chat-input__img-preview__thumb__title`
- `.za-screenshot`
- `::selection` (background)

## v3.6

> 2022-03-08

### Added
#### Browser specific
- Allows users to Enable/Disable notifications when ZaDark updates

### Changed
- `.chat-input__content.highlight`

### Fixed
- `.tipv2 .tip-close-button`

#### PC specific
- `.app-lock__main__input`

## v3.5

> 2022-03-07

### Fixed
- `.toast`

## v3.4

> 2022-03-04

### Fixed
- `.overlay__video__duration`
- `.overlay__video i`
- `.zl-avatar`

### Changed
#### Browser specific
- ZaDark Docs URL

## v3.3

> 2022-03-03

### Fixed
- `.friend-profile__addfriend__msg`

## v3.2

> 2022-02-19

### Added
#### Browser specific
- Firefox Extension

### Changed
- Delete the old build system
- Use gulp to automate the product build process
- Updated README to be more professional

### Fixed
- `.call-msg.me`
#### Browser specific
- Extension Popup: font-smoothing

## v3.1

> 2022-02-15

### Fixed
- Tab Friend Request List, Tab Joined Group List
- font-smoothing (Light Theme)
- `.image-show__caption`
- `.contact-list-item`
- `.zavi-sidebar-list-item`
- `.conv-item`
- `.file-sidebar__option`
- `.contact-list.web`
#### PC specific
- `.zavi-clock__date`
- `zavi-clock__time`
- `.zavi-btn`

## v3.0

> 2022-02-13

### Added
- Dark dimmed theme
#### Browser specific
- Welcome, Changelog page

### Changed
#### Browser specific
- Extension Popup
