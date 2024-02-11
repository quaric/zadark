# Changelog

## ZaDark 24.2.2
> PC 12.7 và Web 9.24

- Sửa lỗi Dark Mode: Sticker mùa lễ hội
- Cho phép tắt dịch tin nhắn

## ZaDark 24.2.1
> PC 12.6 và Web 9.23

- Sửa lỗi Dark Mode: My Cloud > "Lưu bền Cloud (Cloud saved)"
- Sửa lỗi Dark Mode: Group Chat > Danh thiếp > "Thêm thành viên" ([#106](https://github.com/quaric/zadark/issues/106))
- Thêm chức năng "Dịch tin nhắn" (Beta) ([#107](https://github.com/quaric/zadark/issues/107))

## ZaDark 24.1.2
> PC 12.5 và Web 9.22

- Tối ưu mã nguồn
- **[Windows, macOS]** Thêm lệnh `-v`, `--version` để xem phiên bản ZaDark
- **[macOS]** Hỗ trợ cài đặt ZaDark từ **Homebrew** ([Hướng dẫn sử dụng](https://zadark.com/pc/macos#install-zadark-with-homebrew)) ([#104](https://github.com/quaric/zadark/issues/104))

## ZaDark 24.1.1
> PC 12.4 và Web 9.21

- Sửa lỗi Dark Mode của Popup danh sách đã xem tin nhắn ([#102](https://github.com/quaric/zadark/issues/102))
- Cập nhật cỡ chữ của khung soạn tin nhắn (không hỗ trợ chế độ định dạng tin nhắn) bằng với cỡ chữ của tin nhắn (Tuỳ chỉnh cỡ chữ trong phần ZaDark Settings)

## ZaDark 23.12.5
> PC 12.3 và Web 9.20

### Changed
- Giao diện ZaDark Settings mới

## ZaDark 23.12.4
> PC 12.2 và Web 9.19

### Fixed
- Sửa lỗi Ẩn tên cuộc trò chuyện "Cộng đồng" ([#97](https://github.com/quaric/zadark/issues/97))
- Sửa lỗi Dark Mode giao diện "Gửi lời mời kết bạn" ([#96](https://github.com/quaric/zadark/issues/96))

## ZaDark 23.12.3
> PC 12.1 và Web 9.18

### Fixed
- Sửa lỗi không ẩn được nội dung của tin nhắn kèm hình ảnh ([#93](https://github.com/quaric/zadark/issues/93))
- Sửa lỗi Dark Mode giao diện "Hồ sơ của bạn"

### Changed
- Ẩn ảnh đại diện và Tên cuộc trò chuyện: Khi rê chuột vào cuộc trò chuyện nào thì sẽ hiển thị Ảnh đại diện và Tên cuộc trò chuyện đó (trước đây chỉ cần rê chuột vào Sidebar là sẽ hiển thị tất cả cuộc trò chuyện), thay đổi này giúp chống nhìn trộm tốt hơn ([#94](https://github.com/quaric/zadark/issues/94))

## ZaDark 23.12.2
> PC 12.0

### Changed
- **[macOS]** Bỏ định dạng tập tin cài đặt ***pkg**, thay thế bằng định dạng gốc **Unix Executable File**
  - Sửa lỗi nghiêm trọng khi cài đặt `zsh: terminated...`
  - Giúp cài đặt ZaDark nhanh hơn
- **[macOS]** Bỏ thực hiện việc ký (codesign) và xác nhận (notarize) ứng dụng trên macOS với Apple, vì không thể thực hiện với tập tin **Unix Executable File**
- Cải thiện quá trình cài đặt ZaDark PC
- Cải thiện mã nguồn ZaDark PC

## ZaDark 23.12.1
> PC 11.8

### Added
- Hiển thị chi tiết các bước cài đặt, gỡ cài đặt ZaDark.
  - Nâng cao trải nghiệm người dùng.
  - Nhà phát triển dễ dàng biết được lỗi ở bước nào khi người dùng báo lỗi.

### Changed
- Cải thiện mã nguồn ZaDark PC.
- Cập nhật địa chỉ hướng dẫn.
  - Windows: https://zadark.com/pc/windows
  - macOS: https://zadark.com/pc/macos

## ZaDark 23.11.2
> PC 11.7 và Web 9.17

### Fixed
- Sửa lỗi Dark Mode cho trình xem ảnh/video (Media Viewer)

## ZaDark 23.11.1
> PC 11.6 và Web 9.16

### Fixed
- Sửa lỗi không ẩn được hình ảnh ([#86](https://github.com/quaric/zadark/issues/86)).
- Sửa lỗi Dark Mode trạng thái đã xem tin nhắn ([#87](https://github.com/quaric/zadark/issues/87)).

### Added
- Thêm bản cài đặt **arm64** cho macOS.
- Thêm Google AdSense vào Website ZaDark.com để tìm kiếm kinh phí phát triển sản phẩm. Chúng tôi xin lỗi nếu quảng cáo làm phiền mọi người khi truy cập Website.

### Changed
- Ẩn tiêu đề TitleBar ([#88](https://github.com/quaric/zadark/issues/88)).

## ZaDark 23.10.1
> PC 11.5 và Web 9.15

### Fixed
- Sửa lỗi không thể đặt Tên gợi nhớ/Nhãn cho cuộc trò chuyện khi bật **Ẩn Tên cuộc trò chuyện**

### Changed
- Cập nhật địa chỉ Website chính thức sang https://zadark.com
- Ẩn cài đặt giao diện của Zalo vì chỉ có 1 lựa chọn giao diện Mặc định
#### PC specific
- Thêm dòng chữ "**Vui long cho trong giay lat. Co the se mat vai phut ...**" để người dùng hiểu quá trình cài đặt có thể kéo dài vài phút.

## ZaDark 23.9.3
> PC 11.4 và Web 9.14

### Changed
- **[Safari]** Chỉ yêu cầu cấp quyền truy cập nội dung và sửa đổi đối với website chat.zalo.me ([Bảo mật và quyền riêng tư](https://zadark.com/privacy-policy#bao-mat-va-quyen-rieng-tu)).
- Cập nhật giao diện Cài đặt ZaDark.

## ZaDark 23.9.2
> PC 11.3 và Web 9.13

### Fixed
- Tăng độ đậm cho nội dung được tô đậm (bold) trong tin nhắn ([#78](https://github.com/quaric/zadark/issues/78)).
- Sửa lỗi Dark Mode biểu tượng Phó nhóm ([#80](https://github.com/quaric/zadark/issues/80)).

### Added
- Bổ sung phím tắt chuyển chế độ Sáng/Tối ([#79](https://github.com/quaric/zadark/issues/79))
  - Windows: `Alt+D`
  - macOS: `⌘D`

### Removed
- Bỏ phím tắt mở Cài đặt ZaDark & thay bằng phím tắt chuyển chế độ Sáng/Tối.

## ZaDark 23.9.1
> PC 11.2 và Web 9.12

### Changed
- Cập nhật thông tin nhà phát hành thành "ZaDark by Quaric"

## ZaDark 23.8.5
> PC 11.1 và Web 9.11

### Fixed
- Sửa lỗi Dark Mode trình xem Video (Video Player)

### Changed

- Cập nhật thuật ngữ, nội dung thông báo

#### Web specific

- Cập nhật chức năng **Ẩn trạng thái (Đang soạn tin, Đã nhận, Đã xem)**: `declarative_net_request.rule_resources`
- **[Safari]** Tối ưu Logo Quaric SVG

## ZaDark 23.8.4
> PC 11.0 và Web 9.10

### Added
#### PC specific
- Mang tính năng **Ẩn trạng thái (Đang soạn tin, Đã nhận, Đã xem)** trở lại trên **Zalo PC 23.7.1** trở lên.
  - Thay đổi lớn về Logic xử lí.
  - Cập nhật `filterUrls`.
  - **Giới hạn kĩ thuật**: Xem mục Notes bên dưới.

### Changed
- Thay đổi màu của Logo nhà phát hành Quaric.

### Notes
- Vì Zalo PC giới hạn quyền sử dụng các [API của Electron](https://www.electronjs.org/docs/latest/api/app) nên các tính năng sau sẽ bị ảnh hưởng:
  - Bật/Tắt **Ẩn trạng thái (Đang soạn tin, Đã nhận, Đã xem)**: Người dùng phải khởi động lại Zalo PC để áp dụng thay đổi.
  - **[Windows]** Hộp thoại thông báo chỉ hỗ trợ Dark Mode trên **Zalo PC 23.7.1** trở lên. Light Mode, ẩn tin nhắn, ảnh đại diện và tên không khả dụng.
  - Mặc dù các tính năng bị ảnh hưởng, nhưng đây là điểm cộng khi Zalo luôn cải tiến mã nguồn trở nên tốt hơn.

## ZaDark 23.8.3

> PC 10.2 và Web 9.8

### Fixed
#### Web specific
- **[Firefox]** Sửa lỗi không thể cài đặt phông chữ ([#74](https://github.com/quaric/zadark/issues/74))

### Changed
- Thay đổi màu sắc nhãn "Pro"
- Thay đổi vị trí Popup Cài đặt ZaDark

## ZaDark 23.8.2

> PC 10.1 và Web 9.7

### Added
- **[Safari]** Gia hạn tài khoản Apple Developer, mang **ZaDark for Safari** trở lại Mac App Store
- Thêm nhãn `Pro` giúp nhận diện **ZaDark Pro**

### Changed
#### Web specific
- Cải thiện tuỳ chỉnh phông chữ từ Google
- Sửa lỗi CSP (Content Security Policy) khi tuỳ chỉnh phông chữ từ Google
- Cập nhật phím tắt tương thích với Safari

## ZaDark 23.8.1

> PC 10.0

### Fixed

- **[Windows]** Sửa lỗi ZaDark không hoạt động trên **Zalo PC 23.7.1** trở lên (Vì Zalo nâng cấp mã nguồn)

### Removed
- Tính năng **Ẩn trạng thái (Đang soạn tin, Đã nhận, Đã xem)** không khả dụng trên **Zalo PC 23.7.1** trở lên
- **[Windows]** Hộp thoại thông báo chỉ hỗ trợ Dark Mode (Light Mode, ẩn tin nhắn, ảnh đại diện và tên không khả dụng) trên **Zalo PC 23.7.1** trở lên
> Vì Zalo nâng cấp mã nguồn, ZaDark sẽ cập nhật trong thời gian tới

## ZaDark 23.7.5
> PC 9.6 và Web 9.6

### Added
- Bổ sung giải thích (Tooltip) cho chức năng
  - Ẩn trạng thái Đang soạn tin (Typing) ...
  - Ẩn trạng thái Đã nhận (Received)
  - Ẩn trạng thái Đã xem (Seen)

#### PC specific
- Thêm chế độ cài đặt / gỡ cài đặt nhanh **bằng câu lệnh**
  - Windows
    - Giải nén file `ZaDark.zip`, mở **Terminal** hoặc **Command Prompt**
    - Nhập cú pháp cài ZaDark
      - `"\Thu_Muc_Chua_File_ZaDark\ZaDark 9.6.exe" install` hoặc
      - `"\Thu_Muc_Chua_File_ZaDark\ZaDark 9.6.exe" in`
    - Nhập cú pháp gỡ ZaDark
      - `"\Thu_Muc_Chua_File_ZaDark\ZaDark 9.6.exe" uninstall` hoặc
      - `"\Thu_Muc_Chua_File_ZaDark\ZaDark 9.6.exe" un`
    - Ví dụ
      - `"C:\Users\ncdai\Downloads\ZaDark 9.6\ZaDark 9.6.exe" install`
  - macOS
    - Sau khi chạy file `ZaDark.pkg`, mở **Terminal**
    - Nhập cú pháp cài ZaDark
      - `/Applications/ZaDark install` hoặc
      - `/Applications/ZaDark in`
    - Nhập cú pháp gỡ ZaDark
      - `/Applications/ZaDark uninstall` hoặc
      - `/Applications/ZaDark un`
- Chỉ mở Feedback Unsintall khi người dùng gỡ cài đặt ZaDark lần đầu
- ZaDark lưu cài đặt vào đường dẫn
  - Windows: `C:\Users\TenNguoiDung\.zadarkconfig`
  - macOS: `/Users/TenNguoiDung/.zadarkconfig`
  - Mục đích
    - Xác định có phải người dùng gỡ cài đặt lần đầu không
    - Chuẩn bị cho tính năng Auto Update ZaDark, Auto Reinstall ZaDark
- **[Windows]** Thay thay đổi đường dẫn chứa chương trình [**fastlist**](https://github.com/MarkTiedemann/fastlist) (Chương trình giúp ZaDark xác định Process ID của Zalo để tắt Zalo trước khi cài đặt)
  - `C:\Users\TenNguoiDung\.zadark\fastlist-0.3.0.exe`

### Changed
- Thêm màu nền tối (Overlay) giúp người dùng tập trung vào Popup cài đặt ZaDark hơn
- Bỏ nhãn BETA của cài đặt phông chữ từ Google Fonts
- Ẩn Tin nhắn gần nhất: Giữ lại Nhãn (Label) cuộc trò chuyện ([#57](https://github.com/quaric/zadark/issues/57))

## ZaDark 23.7.4
> PC 9.5 và Web 9.5

### Added
- Cập nhật chức năng: Ẩn Tin nhắn trong cuộc trò chuyện
  - Hỗ trợ Ẩn nội dung khung soạn tin nhắn ([#62](https://github.com/quaric/zadark/issues/62))
  - Thêm minh hoạ cách sử dụng (Thay thế Tooltip khó hiểu)
- Kích hoạt/Vô hiệu hoá sử dụng phím tắt ([#68](https://github.com/quaric/zadark/issues/68))

### Changed
- Thay đổi màu của Logo nhà phát hành Quaric

## ZaDark 23.7.3
> PC 9.4 và Web 9.4

### Fixed

- Sửa lỗi màu nền không thay đổi khi rê chuột/lựa chọn tin nhắn nhanh ([#65](https://github.com/quaric/zadark/issues/65))

#### Windows specific
- Sửa lỗi phím tắt "Ẩn ảnh đại diện, tên cuộc trò chuyện" bị trùng ([#66](https://github.com/quaric/zadark/issues/66))

## ZaDark 23.7.2
> PC 9.3 và Web 9.3

### Fixed

#### Windows specific
  - Sửa lỗi tính năng Ẩn trạng thái "Đang soạn tin...", "Đã nhận", "Đã xem" không hoạt động
  - Sửa lỗi hộp thoại thông báo (góc phải dưới)
    - Lỗi Dark Mode
    - Lỗi ẩn tin nhắn gần nhất
    - Lỗi ẩn ảnh đại diện & tên cuộc trò chuyện

#### Web specific
- **[Opera, Edge, Firefox]** Sửa lỗi không thể tuỳ chỉnh phông chữ

### Changed
- Tách tính năng Ẩn Ảnh đại diện & Tên cuộc trò chuyện ra 2 mục cài đặt

## ZaDark 23.7.1
> PC 9.2 và Web 9.2

### Fixed
- Sửa lỗi collapse/expand các session ở mục Thông tin hội thoại ([#60](https://github.com/quaric/zadark/issues/60))

### Added
- Tuỳ chỉnh phông chữ từ Google Fonts (BETA) ([#55](https://github.com/quaric/zadark/issues/55), [#52](https://github.com/quaric/zadark/issues/52))

### Changed
- Làm nổi bật phím tắt tin nhắn nhanh (VD: /hello) ([#59](https://github.com/quaric/zadark/issues/59))
- Sửa lỗi Dark Mode nhãn thời gian của tin nhắn
- Thay đổi phím tắt tuỳ chỉnh cỡ chữ ([#58](https://github.com/quaric/zadark/issues/58))

| Tên chức năng                            | Windows             | macOS         |
| ---------------------------------------- | ------------------- | ------------- |
| Tuỳ chỉnh cỡ chữ của tin nhắn            | `Ctrl+9` / `Ctrl+0` | `⌘9` / `⌘0`   |
| Mở cài đặt ZaDark                        | `Ctrl+D`            | `⌘D`          |

- Tối ưu mã nguồn

## ZaDark 23.6.4
> PC 9.1 và Web 9.1

### Changed
- Hỗ trợ Dark Mode nhãn trạng thái "Đã nhận", "Đã gửi" (`.bubble-message-status`)
- Hỗ trợ Ẩn ảnh đại diện ở nhãn trạng thái "Đã xem" (`.seen-msg-stt`)
- Sửa lỗi Dark Mode nhãn tin nhắn chưa đọc (`.conv-action__unread-v2 .conv-unread`)

## ZaDark 23.6.3
> PC 9.0 và Web 9.0

### Added

Hỗ trợ phím tắt để bật/tắt nhanh các chức năng

| Tên chức năng                            | Windows           | macOS         |
| ---------------------------------------- | ----------------- | ------------- |
| Tuỳ chỉnh cỡ chữ của tin nhắn            | `Alt+-` / `Alt+=` | `⌥+-` / `⌥+=` |
| Ẩn Tin nhắn gần nhất                     | `Ctrl+1`          | `⌘1`          |
| Ẩn Tin nhắn trong cuộc trò chuyện        | `Ctrl+2`          | `⌘2`          |
| Ẩn Ảnh đại diện & Tên cuộc trò chuyện    | `Ctrl+3`          | `⌘3`          |
| Ẩn trạng thái Đang soạn tin (Typing) ... | `Ctrl+4`          | `⌘4`          |
| Ẩn trạng thái Đã nhận (Received)         | `Ctrl+5`          | `⌘5`          |
| Ẩn trạng thái Đã xem (Seen)              | `Ctrl+6`          | `⌘6`          |
| Mở cài đặt ZaDark                        | `Alt+Z`           | `⌥Z`          |

### Changed
- Cập nhật chức năng: Ẩn Ảnh đại diện & Tên cuộc trò chuyện
  - Hỗ trợ danh sách tìm kiếm gần đây
  - Hỗ trợ danh sách kết quả tìm kiếm
  - Ẩn tên trong ô nhập tin nhắn (placeholder)
- Bo tròn góc (8px) giúp tạo cảm giác dễ chịu hơn
- Tối ưu mã nguồn

## ZaDark 23.6.2
> PC 8.5 và Web 8.17

### Added

- **[Core]** Thêm chức năng "Ẩn Ảnh đại diện & Tên cuộc trò chuyện"
- **[Core]** Mở Google Forms "Phản hồi ZaDark (Uninstall)" sau khi gỡ ZaDark

#### Web specific
- **[Firefox specific]** Thêm chức năng cho Firefox 113 trở lên
  - Ẩn trạng thái Đang soạn tin (Typing) ...
  - Ẩn trạng thái Đã nhận (Received)
  - Ẩn trạng thái Đã xem (Seen)

### Changed
- **[ZaDark Settings]** Thêm "Ly Café" (Donate)
- **[Source code]** Tối ưu mã nguồn
- **[UX]** Tách tính năng "Chống nhìn trộm tin nhắn" thành (quay về phiên bản trước)
  - Ẩn Tin nhắn gần nhất trong danh sách trò chuyện
  - Ẩn Tin nhắn trong cuộc trò chuyện
- **[UX]** Giảm hiệu ứng (transition duration) chuyển màu khi rê chuột (hover) vào các nội dung
- **[UX]** Bỏ tất cả hiệu ứng mờ (filter blur)

## ZaDark 23.6.1
> PC 8.4 và Web 8.16

### Added
- **[Core]** Bổ sung cho chức năng "Thay đổi cỡ chữ của tin nhắn" : Áp dụng cho tin nhắn có hình ảnh

### Changed
- **[ZaDark Settings]**
  - Giảm sáng cho biểu tượng màu trắng của công tắc (switch)
  - Thay đổi địa chỉ Phản hồi (sử dụng Canny thay Google Forms)
  - Hợp nhất tính năng "Ẩn Tin nhắn gần nhất ở Danh sách trò chuyện" và "Ẩn Tin nhắn trong Cuộc trò chuyện" thành "Chống nhìn trộm tin nhắn" (Rê chuột vào dấu chấm hỏi để xem giải thích chi tiết)
  - Cập nhật một số chi tiết nhỏ khác
- **[Source code]**
  - Thay đổi flow thoát Zalo PC
  - Thay đổi cấu trúc đặt tên cho tập tin cài đặt ngắn gọn hơn

## ZaDark 23.5.7
> PC 8.3 và Web 8.15

### Added
- Tuỳ chỉnh cỡ chữ trong Tin nhắn

## ZaDark 23.5.6
> PC 8.2 và Web 8.14

### Fixed
- **[Search]** Sửa lỗi màu nền của từ khoá trùng khớp có màu vàng
- **[Format message]** Sửa lỗi menu tuỳ chọn màu chữ ở chế độ "Định dạng tin nhắn" (Format message)

### Changed
- **[ZaDark Settings]** Cập nhật biểu tượng ZaDark trên menu trái

#### PC specific
- **[CLI]** Thay đổi giao diện chọn chức năng : Người dùng sử dụng mũi tên lên/xuống để chọn chức năng
- **[CLI]** Thêm menu "Hướng dẫn"
- **[Windows specific]** Thêm biểu tượng ZaDark cho tập tin cài đặt
- **[macOS specific]** Tự động tắt ứng dụng Terminal sau khi cài đặt ZaDark thành công
- **[macOS specific]** Cải thiện trải nghiệm (UX) cài đặt ZaDark
  - Không cần tắt GateKeeper
    - ZaDark đã thực hiện việc ký và xác nhận ứng dụng trên macOS với Apple
    - Tài liệu kỹ thuật : https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution
  - Không yêu cầu quyền Root
    - Trong một vài trường hợp ZaDark báo lỗi "EACCES: permission denied, ...", bạn cần mở Terminal nhập lệnh "sudo /Applications/ZaDark" để sử dụng
  - Đóng gói ZaDark dưới dạng "pkg"
    - Khi chạy tập tin pkg, ZaDark for macOS sẽ được giải nén vào "Finder > Applications > ZaDark"
    - Hệ thống sẽ tự khởi động ZaDark khi giải nén thành công
    - Để chạy lại ZaDark, truy cập "Finder > Applications > ZaDark"
- **[Source code]** : Nâng cấp công cụ ký và xác nhận ứng dụng macOS (notarytool)
- **[Source code]** : Tối ưu mã nguồn

## ZaDark 23.5.5
> PC 8.1

### Added
#### PC specific
- Giao diện của Hộp thoại thông báo thay đổi theo cài đặt ZaDark (Ưindows)
- Ẩn tin nhắn trong Hộp thoại thông báo khi bật Ẩn "Tin nhắn" trong Cuộc trò chuyện & Thông báo (Windows)
- Tự động thoát Zalo PC trước khi cài đặt, gỡ cài đặt ZaDark

### Changed
#### PC specific
- Giảm thông tin trên giao diện
- Giảm số lần nhấn phím khi sử dụng

## ZaDark 23.5.4
> PC 8.0 và Web 8.13

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

## ZaDark 23.5.3
> PC 7.14 và Web 8.12

### Added
- Thêm cài đặt Riêng tư : Ẩn "Tin nhắn" trong Cuộc trò chuyện
  - Chức năng giúp ngăn chặn người khác nhìn trộm tin nhắn của bạn
  - Di chuyển chuột vào Vùng hiển thị tin nhắn xem tin nhắn
- Thêm Tooltip giải thích cho các cài đặt Riêng tư

### Fixed
- `.zadark-select`: cursor pointer

## ZaDark 23.5.2
> PC 7.13 và Web 8.11

### Fixed
- Modal: Bỏ hiệu ứng mờ khi mờ nền (Hiệu ứng mờ nền có thể làm Zalo bị dựt khi mở Modal ở những máy tính có cấu hình thấp)
- ZaDark Popup: Bỏ định dạng rtl (right to left) ở lựa chọn Phông chữ
- ZaDark Popup: Sửa lỗi màu nền của danh sách lựa chọn Phông chữ

## ZaDark 23.5.1
> PC 7.12 và Web 8.10

### Added
- ZaDark Popup: Thêm Menu Bình chọn, Phản hồi

### Changed
- ZaDark Popup: Làm gọn lựa chọn Phông chữ

## ZaDark 23.4.4
> PC 7.11 và Web 8.9

### Changed
- Giảm độ mờ (blur) và tối ưu Modal Backdrop

### Fixed
- Canh giữa theo chiều dọc của tin nhắn được ẩn (••••••)
- Khắc phục lỗi biểu tượng "Play" tin nhắn audio bị mất

## ZaDark 23.4.3
> PC 7.10 và Web 8.8

### Added
- Thêm dấu hiệu nhận biết khi ZaDark cập nhật phiên bản mới (Dấu chấm đỏ ở Menu ZaDark trên Zalo)
  - Tính năng giúp bạn biết được ZaDark đã thay đổi những gì ở mỗi bản cập nhật
  - Nhấn vào Menu ZaDark > Tên phiên bản để xem thay đổi trong bản cập nhật
- Thêm cài đặt Riêng tư : Ẩn "Tin nhắn gần nhất" ở Danh sách trò chuyện (Bên trái)
  - Tính năng hạn chế người khác nhìn lén nội dung tin nhắn gần nhất của bạn với bạn bè ở Danh sách trò chuyện (Bên trái)
  - Tin nhắn sẽ hiển thị khi bạn rê chuột vào cuộc trò chuyện
  - Tin nhắn của cuộc trò chuyện hiện tại sẽ không bị ẩn

## ZaDark 23.4.2
> PC 7.9 và Web 8.7

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

## ZaDark 23.4.1
> PC 7.8 và Web 8.6

### Added
- Thêm nhãn `Chưa hỗ trợ trên [Zalo PC, Firefox]` cho tính năng Riêng tư

### Changed
- Làm gọn nhãn `Business` ở tên cuộc trò chuyện
- Làm gọn Cài đặt phông chữ
- Bỏ nội dung giới thiệu ZaDark ở màn hình Chào mừng

## ZaDark 23.3.2
> PC 7.7 và Web 8.5

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

## ZaDark 23.3.1

### Changed
- Thay thế dấu `.` thành `_` ở tên phiên bản trong tên của tập tin cài đặt (Giải quyết vấn đề macOS không xác định được định dạng của tập tin cài đặt là `Unix Executable File`)

## ZaDark 23.2.1
> PC 7.6 và Web 8.4

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

## ZaDark 23.1.3
> PC 7.5 và Web 8.3

### Added
#### PC specific (Windows)
- Notification : Hỗ trợ Dark Mode cho Hộp thoại thông báo ở góc phải dưới trên Windows

### Fixed
- `.leftbar-unread` : Làm gọn kích thước nhãn chưa đọc tin nhắn
- `.conv-action__unread` : Thay đổi màu nền (xanh dương thành đỏ)

## ZaDark 23.1.2
> PC 7.4 và Web 8.2

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

## ZaDark 23.1.1
> PC 7.3 và Web 8.1

### Fixed
- Button: Cập nhật bảng màu theo cập nhật của Zalo
- Settings: Cập nhật màu nền MenuLeft

#### PC specific (macOS)
- Sửa lỗi khoảng cách Avatar và macOS TitleBar ở Zalo Tabs quá lớn

### Changed
- LeftTab: Thay đổi giao diện khi Hover, Selected TabItem
- QuoteLine: Thay đổi chiều rộng và bo tròn của trích dẫn tin nhắn

## ZaDark 22.12.5
> PC 7.2

### Fixed
#### PC specific
- Sửa lỗi khoảng cách giữa phần "Giao diện" và "ZaDark from Quaric" ở ZaDark Popup
- Cập nhật mô tả cho "Giao diện tự động"

## ZaDark 22.12.4

### Changed
#### PC (macOS) specific
- Thay đổi cách đóng gói ZaDark PC (macOS)

## ZaDark 22.12.3
> PC 7.1

### Fixed
#### PC specific
- Sửa lỗi hiển thị sai phần Cài đặt riêng tư. Cài đặt riêng tư chỉ có trên ZaDark Web

## ZaDark 22.12.2
> PC 7.0 và Web 8.0

### Added
- Thêm Menu tuỳ chỉnh ZaDark ào Menu bên trái của Zalo. Kể từ PC 7.0, Web 8.0 người dùng có thể tuỳ chỉnh ZaDark ngay trên Zalo

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

## ZaDark 22.12.1
> PC 6.1 và Web 7.1

### Changed
- Thêm nhận diện thương hiệu của Nhà phát hành
- Cập nhật địa chỉ Website chính thức sang https://zadark.com
- Thêm Menu "Donate"

## ZaDark 22.11.2
> PC 6.0 và Web 7.0

### Fixed
- Sửa lỗi hiển thị sai màu sắc do Zalo Web có sự thay đổi lớn lần 2 về bảng màu (Colors CSS Variables) từ ngày 22/11/2022
- Sẵn sàng cho sự thay đổi lớn về bảng màu (Colors CSS Variables) trên Zalo PC
- `.quote-line`
- `.card a`

## ZaDark 22.11.1
> PC 5.6 và Web .6.6

### Fixed
- `.item-calendar-preview > .date` : Sửa lỗi màu sắc của "Ngày" trong Calendar Preview
- `.message-view` : Sửa lỗi Font chữ của nội dung tin nhắn không phải là Font "Open Sans"
- `.reminder-info-v2 > .wd-time__txt` : Sửa lỗi màu sắc của "Ngày" của Calendar trong Reminder

## ZaDark 22.9.6
> PC 5.5 và Web 6.5

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

## PC 5.4 và Web 6.4
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

## PC 5.3
### Added
- ZaDark PC 5.x
### Fixed
- `.zl-avatar__badge` : Sửa lỗi màu sắc của biểu tượng "Đang trực tuyến" ở Avatar
- `.title-name.unfocus` : Sửa lỗi tiêu đề TitleBar hiển thị màu đen khi Unfocus Zalo
### Removed
- ZaDark PC <= v4.x

## PC 4.14 và PC 5.2 và Web 6.3
### Changed
- `.leftbar-mark-unread` : Thay đổi kích thước và vị trí đẹp hơn

## PC 4.12
### Changed
- macOS : Mở trang hướng dẫn [ZaDark for macOS](https://zadark.ncdaistudio.com/pc/macos) sau khi giải nén tập tin pkg
### Fixed
- Sửa lỗi màu sắc cho giao diện "Đặt mã PIN" ẩn cuộc trò chuyện
- macOS : Sửa lỗi các chức năng không hoạt động khi không chạy ZaDark for macOS với quyền Root

## PC 5.1 và Browser v6.2
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

## PC 4.11 và Browser v5.6
### Changed
- `.zl-modal` : Thêm hiệu ứng mờ cho nền.

## PC 4.10 và Browser v5.5
### Fixed
- Zalo Business

## PC 4.9 & Browser v5.4
### Fixed
- `.setting-menu` : Sửa lỗi chữ "Resource management" xuống dòng.
- `.cb-info-file-item__actions-container` : Sửa lỗi màu nền sai khi rê chuột vào File (Media Store Preview).
- `.chat-info-link__action` : Sửa lỗi mất màu nền khi rê chuột vào Link (Media Store Preview).
- `.media-store-preview-item > .image-menu-container` : Sửa lỗi màu nền sai khi rê chuột vào Photo/Video (Media Store Preview).
- `.z-business-label` : Sửa lỗi nhãn "Business" quá to không đẹp.

### Changed
#### Browser specific (Edge)
- Upgrade manifest `v2` to `v3`

## PC 4.8 & Browser v5.3
### Fixed
- Chat Onboard : `.slideshow__page__image` `.slideshow__page__text__title` `.slideshow__bottom`
#### PC specific
- Fixed a bug that sometimes needed sudo privileges to install ZaDark for macOS

## PC 4.7 & Browser v5.2
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

## PC 4.6 & Browser v5.1

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

## PC 4.5

### Changed
#### PC specific
- Convert English to Vietnamese

## PC 4.4 & Browser v4.2

### Changed
- `zadark brand` : change "ZaDark – Best Dark Theme for Zalo" to "ZaDark – Zalo Dark Mode"
- `chat-input highlight` : remove blue line
- `conv-item pinned` : remove background

### Fixed
- `font` : update font files

## PC 4.3 & Browser v4.1

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

## PC 4.2 & Browser v4.0

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

## PC 4.1 & Browser v3.9

> 2022-03-18

### Added
- Edge Extension

### Fixed
- `.z-toggle > div`
- `.todo-filter-input`

## PC 4.0

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
