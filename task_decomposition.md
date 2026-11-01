# Exercise 2 — Task Decomposition

## Mục tiêu

Nâng cấp `smartPeople` từ các bài Exercise 0.4, 2.2, 3.8 và 4.3 thành danh bạ Scientist & Pioneer có tìm kiếm, lọc, sắp xếp, xóa và khôi phục; giữ dữ liệu ổn định qua các lần render và tính danh sách hiển thị trực tiếp trong render.

**Phạm vi:** Đây là checklist triển khai, không phải thay đổi mã ứng dụng. Thực hiện đúng thứ tự và tạo ba commit tính năng dưới đây. Có thể commit riêng checklist này khi được yêu cầu.

## Task 0 — Khảo sát dự án và xác định điểm triển khai

- [ ] **Công việc:** Đọc cấu trúc dự án, hướng dẫn hiện có, mã liên quan đến `smartPeople`, các component hiển thị danh sách, cấu hình package manager và test/build scripts. Xác định file cần sửa, cách chạy kiểm tra và cách lưu `SMART_PEOPLE` làm snapshot gốc.
- **Kết quả mong đợi:** Có danh sách chính xác các file dữ liệu, component, test và lệnh kiểm tra sẽ dùng cho ba task tiếp theo; ghi nhận trạng thái kiểm tra ban đầu nếu dự án có lệnh phù hợp.
- **Tiêu chí hoàn thành:** Đường dẫn và lệnh được xác minh từ repository, không phỏng đoán; không có mã ứng dụng nào bị thay đổi trong task này.

## Task 1 — Chuẩn hóa schema `smartPeople` với ID ổn định

- [ ] **Commit bắt buộc:** `feat(ex2): normalize smartPeople schema with stable IDs`
- **Công việc:** Chuẩn hóa các bản ghi `smartPeople` theo schema có `id`, `name`, `age`, `iq`; cấp ID ổn định và duy nhất cho từng người. Giữ snapshot dữ liệu gốc `SMART_PEOPLE` để task reset có thể khôi phục.
- **Kết quả mong đợi:** Danh sách dùng chung schema nhất quán; React có thể dùng ID ổn định làm key thay vì vị trí phần tử.
- **Tiêu chí hoàn thành:** Mỗi bản ghi có đủ bốn trường; ID không rỗng và không trùng; dữ liệu nền tảng cần thiết cho các bài trước được chuyển đổi; kiểm tra hiện có liên quan đến dữ liệu chạy đạt.

## Task 2 — Thêm tìm kiếm, lọc IQ và sắp xếp bằng `toSorted`

- [ ] **Commit bắt buộc:** `feat(ex2): add search, IQ filter & toSorted`
- **Công việc:** Thêm tìm kiếm tên không phân biệt chữ hoa/chữ thường, bộ lọc IQ tối thiểu dùng `event.target.valueAsNumber`, và sắp xếp theo IQ hoặc tuổi bằng ES2023 `.toSorted()`. Lưu trong `useState` chỉ những đầu vào độc lập dạng thô; tính `visiblePeople` ngay trong render, không dùng `useEffect` để đồng bộ danh sách dẫn xuất.
- **Kết quả mong đợi:** Tìm kiếm, lọc và sắp xếp phối hợp để tạo danh sách hiển thị; dữ liệu nguồn không bị mutate bởi thao tác sắp xếp.
- **Tiêu chí hoàn thành:** Tìm kiếm không phân biệt hoa/thường; ngưỡng lọc đọc bằng `valueAsNumber`; các lựa chọn sắp xếp IQ/tuổi dùng `.toSorted()`; `visiblePeople` được dẫn xuất trong render và không có state/effect dư thừa; kiểm tra liên quan đạt.

## Task 3 — Thêm xóa/khôi phục và trạng thái thông báo trực tiếp

- [ ] **Commit bắt buộc:** `feat(ex2): add delete/reset & live status`
- **Công việc:** Thêm xóa người bằng cập nhật bất biến với `filter` và nút reset khôi phục snapshot `SMART_PEOPLE`. Gắn nhãn cho input bằng `htmlFor`/`id` và ID tạo từ `useId()`. Hiển thị số kết quả bằng `role="status"` và `aria-live="polite"`.
- **Kết quả mong đợi:** Người dùng có thể xóa từng người hoặc khôi phục danh sách; các điều khiển và số kết quả có ngữ nghĩa truy cập phù hợp.
- **Tiêu chí hoàn thành:** Xóa tạo mảng mới và không mutate dữ liệu; reset khôi phục đúng snapshot; mỗi input có nhãn liên kết; vùng đếm kết quả có cả hai thuộc tính ARIA yêu cầu; kiểm tra liên quan đạt.

## Kiểm tra nghiệm thu cuối

- [ ] Chạy các lệnh test/build phù hợp đã xác định ở Task 0; tất cả đều đạt.
- [ ] Trong React DevTools Profiler, xác nhận một lượt render cho mỗi ký tự được nhập khi gõ tìm kiếm.
- [ ] Xóa Johann Goethe và xác nhận focus vẫn hợp lý, các mục còn lại giữ đúng danh tính nhờ ID ổn định.
- [ ] Xác nhận reset khôi phục danh sách gốc và các điều kiện tìm kiếm/lọc/sắp xếp cho kết quả như mong đợi.
- [ ] Xác nhận có đúng ba commit bắt buộc, theo đúng thứ tự ở trên; không có commit bổ sung cho bài này.
