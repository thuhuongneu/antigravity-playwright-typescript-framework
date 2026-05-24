# Playwright + TypeScript Automation Framework

Đây là một E2E Web UI Automation Framework được xây dựng bằng Playwright Test và TypeScript ở chế độ strict mode.

## Các tính năng chính
- Áp dụng mô hình thiết kế **Page Object Model (POM)**.
- Kích hoạt **Strict TypeScript Mode** giúp kiểm soát kiểu dữ liệu chặt chẽ và ổn định.
- Sử dụng **Custom Fixtures** để khởi tạo và đưa các Page Objects vào bài test một cách sạch sẽ.
- Quản lý môi trường (Environment Management) qua thư viện `dotenv`.
- **Tích hợp Allure Report**:
  - Tự động sinh báo cáo HTML chi tiết và có tính tương tác cao.
  - Loại bỏ các log API mặc định thô của Playwright để chỉ hiển thị các bước nghiệp vụ chính (nested steps) được custom bằng tiếng Anh rõ ràng.
  - Tự động chụp và đính kèm **ảnh chụp màn hình (screenshot) cho các test case thành công (passed)** ở bước cuối cùng.
  - Tự động đính kèm **ảnh chụp màn hình (screenshot), video hành trình và log lỗi chi tiết cho các test case thất bại (failed)** để hỗ trợ việc debug dễ dàng.
- Tích hợp sẵn báo cáo **HTML Report** mặc định của Playwright.
- **Tích hợp CI/CD** với GitHub Actions và tự động xuất bản (deploy) lên **GitHub Pages**.
- Sử dụng cơ chế đợi thông minh **Smart Waits** thông qua các assertion `expect()` của Playwright.

## Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- Trình quản lý gói npm hoặc yarn

## Thiết lập dự án

1. Cài đặt các thư viện phụ thuộc (dependencies):
   ```bash
   npm install
   ```

2. Cài đặt các trình duyệt kiểm thử của Playwright và thư viện hệ thống đi kèm:
   ```bash
   npx playwright install --with-deps
   ```

3. Cấu hình biến môi trường:
   Sao chép tệp `.env.example` thành `.env` và cập nhật các giá trị cấu hình thực tế của bạn.
   ```bash
   cp .env.example .env
   ```

## Chạy Kiểm thử (Running Tests)

### Chạy bằng công cụ Playwright mặc định
- Chạy toàn bộ test suite ở chế độ headless (chạy ẩn):
  ```bash
  npm test
  ```
- Chạy kiểm thử ở chế độ UI Mode (giao diện trực quan của Playwright):
  ```bash
  npm run test:ui
  ```
- Chạy kiểm thử ở chế độ headed (hiển thị trình duyệt thật):
  ```bash
  npm run test:headed
  ```
- Xem báo cáo HTML mặc định của Playwright:
  ```bash
  npm run report
  ```

### Chạy bằng Allure Report
- **Chạy kiểm thử & Tự động sinh báo cáo Allure** (Lệnh khuyên dùng):
  ```bash
  npm run test:allure
  ```
  *Lệnh này sẽ tự động dọn dẹp kết quả cũ, chạy toàn bộ bộ test suite và biên dịch báo cáo Allure HTML hoàn chỉnh.*

- **Mở báo cáo Allure** trên một local web server để xem kết quả trực quan trên trình duyệt:
  ```bash
  npm run allure:open
  ```

- **Tạo (biên dịch) báo cáo Allure** thủ công từ dữ liệu kết quả test hiện tại:
  ```bash
  npm run allure:generate
  ```

- **Dọn dẹp** dữ liệu kết quả test và thư mục báo cáo Allure cũ:
  ```bash
  npm run allure:clear
  ```

## Tích hợp CI/CD và GitHub Actions

Dự án này được tích hợp đầy đủ với GitHub Actions (được cấu hình trong tệp `.github/workflows/playwright.yml`). Mỗi khi có code được push hoặc pull request vào các nhánh `main` hoặc `master`:
1. Các bài kiểm thử sẽ được thực thi tự động trên môi trường máy ảo Ubuntu.
2. Báo cáo Allure sẽ tự động được tạo ra kèm theo biểu đồ lịch sử chạy test qua các lần build (history trends).
3. Báo cáo sẽ được xuất bản (deploy) trực tiếp lên **GitHub Pages** (thông qua nhánh `gh-pages`).
4. Các tệp kết quả thô (cả Playwright HTML Report và các tệp Allure Report) sẽ được tải lên dưới dạng Artifacts của GitHub để bạn có thể tải về máy bất kỳ lúc nào.

### Để xem báo cáo Allure trực tuyến (online):
1. Truy cập vào GitHub Repository của bạn > chọn tab **Settings** > chọn mục **Pages** ở menu bên trái.
2. Tại phần **Build and deployment**, chọn Source là **Deploy from a branch**.
3. Chọn nhánh **gh-pages** (thư mục gốc `/ (root)`) và nhấn **Save**.
4. GitHub sẽ tiến hành deploy và cung cấp cho bạn một đường dẫn (URL) công khai để xem trực tiếp các báo cáo kiểm thử.

### Cách cấu hình Biến môi trường trên GitHub (Secrets/Variables):
Để cấu hình các biến môi trường cần thiết cho việc thực thi test (`BASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`):
1. Truy cập vào GitHub Repository của bạn > chọn tab **Settings**.
2. Tại menu bên trái, tìm mục **Security** > chọn **Secrets and variables** > nhấn **Actions**.
3. Tại tab **Secrets**, nhấn nút **New repository secret** để thêm các biến nhạy cảm (khuyên dùng cho thông tin đăng nhập):
   - **Name**: `ADMIN_USERNAME`, **Value**: *[email tài khoản admin của bạn]*
   - **Name**: `ADMIN_PASSWORD`, **Value**: *[mật khẩu tài khoản admin]*
4. Nếu bạn muốn cấu hình các biến không nhạy cảm (như `BASE_URL`), bạn có thể thêm chúng như secret thông thường hoặc chuyển sang tab **Variables** và nhấn **New repository variable**:
   - **Name**: `BASE_URL`, **Value**: `https://opensource-demo.orangehrmlive.com`

> [!NOTE]
> **Sự khác biệt giữa Secrets và Variables trên GitHub:**
> - **Secrets (`${{ secrets.VAR_NAME }}`)**: Dành cho các thông tin nhạy cảm như mật khẩu và thông tin đăng nhập. GitHub sẽ mã hóa và tự động ẩn giá trị của chúng trong logs chạy Actions (hiển thị dưới dạng `***`).
> - **Variables (`${{ vars.VAR_NAME }}`)**: Dành cho các cấu hình thông thường không nhạy cảm (như URL trang web, tên môi trường). Các giá trị này được lưu dưới dạng văn bản thường (plain-text) và hiển thị rõ ràng trong logs giúp hỗ trợ debug dễ dàng.
> - *Lưu ý*: Nếu bạn quyết định lưu trữ `BASE_URL` trong tab **Variables**, hãy nhớ cập nhật lại tham chiếu tương ứng trong tệp `.github/workflows/playwright.yml` từ `${{ secrets.BASE_URL }}` thành `${{ vars.BASE_URL }}`.

## Cấu trúc dự án
- `src/pages/` - Nơi chứa các class Page Object đóng gói các locators và các hành động tương tác trên giao diện.
- `src/fixtures/` - Nơi chứa các custom Playwright fixtures (bao gồm cả auto-fixture để chụp ảnh màn hình tự động khi test pass).
- `src/tests/` - Nơi chứa các tệp kịch bản kiểm thử (test specs) được tổ chức theo tính năng.
- `src/utils/` - Nơi chứa các tệp helper, bộ sinh dữ liệu và cấu hình môi trường.
- `playwright.config.ts` - Tệp cấu hình của Playwright runner (đã được cấu hình thêm allure-playwright reporter).
