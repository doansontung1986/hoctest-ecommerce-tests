# HocTest E-commerce Tests - Automation Testing Framework

## 📋 Mô tả

Project automation test cho website **E-commerce site testing** (WordPress + WooCommerce) của Better Bytes Academy, viết bằng **Playwright + TypeScript** theo mô hình **Page Object Model**.

Framework kiểm thử 2 phần của hệ thống:

| Phần | URL | Nội dung kiểm thử |
|------|-----|-------------------|
| **CMS** (trang quản trị) | `/wp-admin` | Đăng nhập / đăng ký / quên mật khẩu, tạo - kiểm tra - xoá sản phẩm |
| **E-commerce** (trang người mua) | `/` | Trang chủ, tìm kiếm, trang danh sách (PLP), trang chi tiết sản phẩm (PDP), review |

Môi trường test: https://e-commerce-dev.betterbytesvn.com/

## 🛠️ Công nghệ sử dụng

- **Ngôn ngữ**: TypeScript
- **Automation Tool / Test Runner**: [Playwright Test](https://playwright.dev/)
- **Test data**: [@faker-js/faker](https://fakerjs.dev/)
- **Design pattern**: Page Object Model (POM)
- **Reporting**: Playwright HTML Report (kèm trace và screenshot khi fail)
- **CI/CD**: GitHub Actions

## 📁 Cấu trúc thư mục

```
hoctest-ecommerce-tests/
├── .github/workflows/
│   └── playwright.yml              # CI: chạy test khi push / pull request
├── src/
│   ├── pages/                      # Page Object Models
│   │   ├── base-page.ts
│   │   ├── cms/                    # Trang quản trị (wp-admin)
│   │   │   ├── login-page.ts
│   │   │   ├── register-page.ts
│   │   │   ├── lost-your-password-page.ts
│   │   │   ├── dashboard-page.ts
│   │   │   ├── left-menu.ts
│   │   │   ├── products-page.ts
│   │   │   └── add-new-product-page.ts
│   │   └── ecommerce/              # Trang người mua
│   │       ├── home-page.ts
│   │       ├── top-menu.ts
│   │       ├── search-result-page.ts
│   │       ├── product-listing-page.ts
│   │       └── product-detail-page.ts
│   ├── tests/                      # Test specs
│   │   ├── cms/
│   │   │   ├── authentication-tests.spec.ts
│   │   │   └── product-tests.spec.ts
│   │   └── ecommerce/
│   │       └── home-page.spec.ts
│   └── utils/
│       ├── generate-test-data.ts   # Sinh test data (faker): credential, product, review
│       └── format-data.ts          # Helper định dạng dữ liệu hiển thị (giá tiền...)
├── playwright.config.ts
└── package.json
```

## 🧪 Danh sách test case

| ID | Tag | Mô tả |
|----|-----|-------|
| AUTH_001 | `@authentication` | Verify UI trang Login, Register, Lost Your Password |
| AUTH_002 | `@authentication` | Đăng nhập thành công với tài khoản hợp lệ |
| AUTH_003 | `@authentication` | Đăng nhập thất bại: user không tồn tại / sai mật khẩu |
| PRODUCT_001 | `@product` | Verify UI trang Add New Product: các block đóng/mở, field trong từng tab Product data |
| PRODUCT_002 | `@product` | Tạo sản phẩm trên CMS → verify trên PDP, PLP → xoá sản phẩm → verify đã biến mất |
| HOME_001 | `@home` | Trang chủ tải thành công (title, searchbox, menu) |
| HOME_002 | `@home` | Tìm kiếm sản phẩm, số kết quả khớp với số product card |
| HOME_003 | `@home` | Thông tin sản phẩm trên PDP, nút Add to Cart, tab Review |
| HOME_004 | `@home` | Gửi review và kiểm tra review được lưu lại |

## ⚙️ Cài đặt & Cấu hình

### Yêu cầu hệ thống

- Node.js (bản LTS)
- npm
- Git

### Các bước cài đặt

1. Clone repository:

```bash
git clone https://github.com/doansontung1986/hoctest-ecommerce-tests.git
cd hoctest-ecommerce-tests
```

2. Cài đặt dependencies:

```bash
npm ci
```

3. Cài đặt browser cho Playwright:

```bash
npx playwright install --with-deps chromium
```

4. Tạo file `.env` ở thư mục gốc để chứa tài khoản CMS (file này **không được commit**):

```properties
CMS_USERNAME=your-username
CMS_PASSWORD=your-password
```

> ⚠️ Không đưa username / password thật vào code hoặc commit lên GitHub.

### Cấu hình chính (`playwright.config.ts`)

| Thiết lập | Giá trị |
|-----------|---------|
| `baseURL` | `https://e-commerce-dev.betterbytesvn.com/` |
| Browser | Chromium (Firefox / WebKit đang tắt) |
| `retries` | 2 trên CI, 0 khi chạy local |
| `workers` | 1 trên CI |
| `trace` | Ghi lại khi retry (`on-all-retries`) |
| `screenshot` | Chỉ chụp khi fail |

## 🚀 Chạy Tests

### Chạy tất cả tests

```bash
npx playwright test
```

### Chạy theo nhóm (tag)

```bash
npx playwright test --grep @authentication
npx playwright test --grep @product
npx playwright test --grep @home
```

### Chạy một file hoặc một test case

```bash
npx playwright test src/tests/cms/product-tests.spec.ts
npx playwright test --grep "PRODUCT_002"
```

### Chạy có giao diện / debug

```bash
npx playwright test --headed          # mở browser khi chạy
npx playwright test --ui              # UI mode
npx playwright test --debug           # debug từng bước
```

## 📊 Test Reports

- Report HTML được tạo trong thư mục `playwright-report/`
- Xem report:

```bash
npx playwright show-report
```

- Trên CI (GitHub Actions), report được upload thành artifact **`playwright-report`**, lưu 30 ngày.

## 📝 Quy tắc viết test

- Dùng **Page Object Model**: locator và thao tác đặt trong `src/pages/`, file spec chỉ chứa luồng test và assert.
- Đặt tên test theo dạng `<MODULE>_<số>: <mô tả>`, ví dụ `PRODUCT_002: Verify that user can add and remove a product`.
- Gắn **tag** cho mỗi `test.describe` (`@authentication`, `@product`, `@home`) để chạy theo nhóm.
- Chia test thành các **`test.step`** rõ ràng để dễ đọc trong report.
- Sinh test data bằng các hàm trong `utils/generate-test-data.ts`. Tên sản phẩm có số ngẫu nhiên để tránh trùng lặp.
- Mỗi test phải **độc lập** và **tự dọn dẹp**: sản phẩm tạo ra phải được xoá, panel đã đóng phải được mở lại.
- Ưu tiên locator ổn định: `id`, `getByRole`, `getByLabel`. Tránh locator phụ thuộc vị trí (`.first()`, `nth`) nếu có thể lọc theo nội dung.

## 🐛 Troubleshooting

### Lỗi thường gặp

**Lỗi: Text trên trang người mua không khớp dù nhìn giống nhau** (ví dụ tên sản phẩm có dấu `-`)

- Nguyên nhân: khi hiển thị, WordPress tự đổi ` - ` thành ` – ` (en dash), và đổi nháy thẳng thành nháy cong.
- Giải pháp: chuyển expected theo cách hiển thị, ví dụ `name.replace(/ - /g, " – ")`.

**Lỗi: Giá hiển thị `1.000 $` nhưng expected là `1000`**

- Nguyên nhân: WooCommerce định dạng giá theo cấu hình của site (dấu `.` phân cách hàng nghìn, `$` đứng sau).
- Giải pháp: dùng helper `formatPrice()` trong `utils/format-data.ts` cho mọi assert về giá.

**Lỗi: Block trên trang Add New Product lúc đóng lúc mở, test fail không ổn định**

- Nguyên nhân: WordPress lưu trạng thái đóng/mở của từng block **theo user**. Lần chạy trước fail giữa chừng, hoặc click quá nhanh, sẽ để lại trạng thái sai cho lần chạy sau.
- Giải pháp: đưa tất cả block về trạng thái mở trước khi test, chờ request lưu trạng thái hoàn tất sau mỗi lần click, và mở lại các block sau khi test.

**Lỗi: `strict mode violation ... resolved to N elements`**

- Nguyên nhân: locator khớp nhiều element, ví dụ `selectOption` gọi trên các thẻ `<option>` thay vì thẻ `<select>`, hoặc có nhiều nút cùng tên "Apply".
- Giải pháp: locator phải trỏ đúng một element (dùng `id`, hoặc giới hạn phạm vi trong một vùng cha).

**Lỗi: `Target page, context or browser has been closed`**

- Nguyên nhân: thường do locator không tồn tại, Playwright chờ đến hết timeout của test rồi đóng page.
- Giải pháp: kiểm tra lại locator trong DevTools hoặc bằng `npx playwright codegen`.

## 👥 Contributors

- **Đoàn Sơn Tùng** - QA / Test Automation Engineer

## 📄 License

ISC License

---
**Last Updated**: 18/10/2026
