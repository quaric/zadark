# Changelog

## ZaDark v22.11.2
> PC v6.0 && Web v7.0

### Fixed
- Sửa lỗi hiển thị sai màu sắc do Zalo Web có sự thay đổi lớn lần 2 về bảng màu (Colors CSS Variables) từ ngày 22/11/2022
- Sẵn sàng cho sự thay đổi lớn về bảng màu (Colors CSS Variables) trên Zalo PC

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
