# VII. TÓM TẮT KẾ HOẠCH VÀ LỊCH TRÌNH TRIỂN KHAI NGHIÊN CỨU

**Đề tài:** Xây dựng nền tảng học tập trực quan và hệ thống hóa tri thức chủ nghĩa Mác – Lênin  
**Thời gian thực hiện:** 11/05/2026 – 31/12/2026  
**Phương pháp:** Agile/Scrum (Sprint 2 tuần, review cuối mỗi tháng)

---

| TT | Các nội dung, công việc chủ yếu cần được thực hiện; các mục đánh giá chủ yếu | Kết quả phải đạt | Thời gian (bắt đầu – kết thúc) | Cá nhân, tổ chức thực hiện |
|:---:|---|---|---|---|
| **1** | **Khảo sát nhu cầu & phân tích giáo trình**<br>– Khảo sát sinh viên kỳ cuối (đang thực tập/đi làm) về khó khăn ôn tập môn Triết học Mác – Lênin.<br>– Phân tích giáo trình chính thức, phân rã thành các đơn vị tri thức nhỏ (Atomic Knowledge).<br>– Xác định use case theo vai trò: Sinh viên, Giảng viên, Quản trị.<br>*Đánh giá:* Báo cáo khảo sát; danh mục module nội dung; bảng phân công chức năng. | Báo cáo khảo sát (≥ 50 phiếu); sơ đồ use case; danh mục ≥ 5 chương / ≥ 20 bài học micro-learning. | 11/05/2026 – 31/05/2026 | Cả nhóm (phụ trách: **Ngọc Như Phan Nguyên**); tham vấn giảng viên hướng dẫn |
| **2** | **Thiết kế kiến trúc hệ thống & cơ sở dữ liệu**<br>– Thiết kế kiến trúc 3 lớp: React Router (Frontend) – Spring Boot (Backend) – MySQL.<br>– Thiết kế ERD: Subject → Chapter → Lesson → Material; Question → Quiz → QuizAttempt; Flashcard; Knowledge Graph.<br>– Thiết kế UI theo hướng Serene Academic / Calm UI; wireframe các màn hình chính.<br>*Đánh giá:* Tài liệu thiết kế; ERD; mockup giao diện được mentor phê duyệt. | Tài liệu thiết kế hệ thống; ERD hoàn chỉnh; bộ wireframe ≥ 15 màn hình; repository GitHub khởi tạo. | 01/06/2026 – 21/06/2026 | **Nguyễn Minh Hiệu**, **Lê Mỹ Lộc** (thiết kế); **Trần Minh Cường** (ERD); mentor duyệt |
| **3** | **Sprint 1–2: Nền tảng kỹ thuật & xác thực người dùng**<br>– Cấu hình môi trường dev, Docker, CI/CD.<br>– Triển khai đăng nhập Google OAuth2 + JWT; phân quyền Role-based (Student / Teacher / Admin).<br>– Xây dựng layout theo vai trò và landing page giới thiệu.<br>*Đánh giá:* Demo đăng nhập; kiểm thử phân quyền truy cập route. | Hệ thống chạy local + deploy VPS; 3 vai trò hoạt động; landing page hoàn chỉnh. | 22/06/2026 – 19/07/2026 | **Nguyễn Văn Linh** (Auth, DevOps); **Nguyễn Nhật Sinh** (Landing, layout) |
| **4** | **Sprint 3–4: CMS & cấu trúc khóa học (phía Giảng viên)**<br>– CRUD Subject – Chapter – Lesson; upload tài liệu (PDF, PPTX, ảnh, YouTube).<br>– Trình xem slide/bài giảng; quản lý tiến độ nội dung theo học phần.<br>– Quy trình duyệt nội dung (Approval workflow) trước khi công bố.<br>*Đánh giá:* Giảng viên thao tác CRUD thành công; ≥ 1 học phần pilot được nhập đủ bài giảng. | Module CMS giảng viên hoàn chỉnh; ≥ 1 khóa học pilot (Triết học Mác – Lênin) có đủ chương/bài/tài liệu. | 20/07/2026 – 16/08/2026 | **Lê Mỹ Lộc**, **Trần Minh Cường** (Backend API); **Ngọc Như Phan Nguyên** (Frontend giảng viên) |
| **5** | **Sprint 5–6: Ngân hàng câu hỏi, Quiz & Flashcard**<br>– Ngân hàng câu hỏi: tạo/sửa, import Excel, kiểm tra trùng lặp, duyệt hàng loạt, xuất đề.<br>– Quản lý Quiz: cấu hình, gắn câu hỏi, xuất bản/đóng đề.<br>– Flashcard theo chương; bulk create; liên kết với nội dung bài học.<br>*Đánh giá:* ≥ 200 câu hỏi trắc nghiệm; ≥ 10 bộ quiz; ≥ 5 bộ flashcard được duyệt. | Module đánh giá (Question Library + Quiz + Flashcard) vận hành ổn định; dữ liệu pilot đạt ngưỡng trên. | 17/08/2026 – 13/09/2026 | **Nguyễn Minh Hiệu** (Question Library); **Nguyễn Nhật Sinh** (Quiz); **Nguyễn Văn Linh** (Flashcard API) |
| **6** | **Sprint 7–8: Module học tập Sinh viên & kiểm tra**<br>– Giao diện học bài: tab Bài giảng – Flashcard – Luyện tập – Kiểm tra.<br>– Luyện tập theo phạm vi (môn/chương/bài); theo dõi tiến độ học.<br>– Thi trắc nghiệm có giới hạn thời gian; chấm điểm tự động; xem lại bài làm; phân tích điểm yếu.<br>– Tính năng Flash-review (ôn tập nhanh) trước kỳ thi.<br>*Đánh giá:* Sinh viên hoàn thành ≥ 1 bài thi thử; thời gian ôn tập giảm ≥ 30% so với đọc giáo trình (thang đo khảo sát). | Luồng học – luyện – thi end-to-end; báo cáo pilot 10–15 sinh viên; metric thời gian ôn tập. | 14/09/2026 – 11/10/2026 | **Ngọc Như Phan Nguyên**, **Lê Mỹ Lộc** (Student UI); **Trần Minh Cường** (Exam engine) |
| **7** | **Sprint 9: Mindmap & Knowledge Graph**<br>– Mindmap theo bài học (React Flow): giảng viên chỉnh sửa, sinh viên xem/điều hướng.<br>– Sơ đồ tri thức cấp khóa học; liên kết khái niệm – bài học – câu hỏi.<br>– Timeline tương tác trên landing / trong khóa học.<br>*Đánh giá:* ≥ 1 mindmap/bài học pilot; sinh viên đánh giá mức độ dễ hiểu khái niệm (thang Likert). | Module trực quan hóa tri thức hoạt động; mindmap + knowledge graph cho học phần pilot. | 12/10/2026 – 01/11/2026 | **Nguyễn Minh Hiệu** (Knowledge Graph); **Nguyễn Nhật Sinh** (Mindmap UI) |
| **8** | **Sprint 10: Chatbot AI hỗ trợ học tập**<br>– Tích hợp LLM (Spring AI / API ngoài) với RAG trên tài liệu khóa học và ngân hàng câu hỏi.<br>– Chatbot theo ngữ cảnh chương/bài; trích dẫn nguồn; giới hạn phạm vi trả lời theo giáo trình.<br>*Đánh giá:* ≥ 50 câu hỏi thử nghiệm; độ chính xác nội dung ≥ 85% (đánh giá bởi giảng viên). | Chatbot AI tích hợp vào nền tảng; báo cáo đánh giá chất lượng câu trả lời. | 02/11/2026 – 22/11/2026 | **Nguyễn Văn Linh** (Backend AI/RAG); **Trần Minh Cường** (Frontend chatbot) |
| **9** | **Kiểm thử tổng hợp, triển khai pilot & thu thập dữ liệu**<br>– Kiểm thử chức năng, bảo mật, responsive (mobile/tablet/desktop).<br>– Triển khai production (maclenin.io.vn); pilot với sinh viên FPT Đà Nẵng.<br>– Thu thập log học tập, điểm quiz, phản hồi khảo sát.<br>*Đánh giá:* Bug critical = 0; uptime ≥ 99%; ≥ 30 người dùng pilot. | Hệ thống production ổn định; bộ dữ liệu đánh giá hiệu quả (điểm số, thời gian, khảo sát). | 23/11/2026 – 14/12/2026 | Cả nhóm; **Ngọc Như Phan Nguyên** (điều phối pilot); mentor giám sát |
| **10** | **Hoàn thiện sản phẩm & báo cáo nghiên cứu**<br>– Tổng hợp kết quả: so sánh trước/sau, phân tích hiệu quả micro-learning.<br>– Hoàn thiện tài liệu: hướng dẫn sử dụng (giảng viên + sinh viên), README kỹ thuật.<br>– Viết báo cáo đề tài / thuyết minh kết quả; chuẩn bị demo & bảo vệ.<br>*Đánh giá:* Báo cáo đạt yêu cầu học thuật; sản phẩm đủ 4 module lõi (CMS – Học tập – Đánh giá – AI). | Báo cáo nghiên cứu hoàn chỉnh; sản phẩm M-L Master deploy; slide bảo vệ. | 15/12/2026 – 31/12/2026 | Cả nhóm; **Ngọc Như Phan Nguyên** (báo cáo tổng hợp) |

---

## Sản phẩm dự kiến

| STT | Sản phẩm | Mô tả ngắn |
|:---:|---|---|
| 1 | **Nền tảng web M-L Master** | Ứng dụng full-stack (React + Spring Boot + MySQL), deploy production, hỗ trợ 3 vai trò người dùng. |
| 2 | **Kho nội dung micro-learning** | ≥ 1 học phần Triết học Mác – Lênin số hóa: bài giảng, flashcard, quiz, mindmap. |
| 3 | **Module đánh giá & Flash-review** | Ngân hàng câu hỏi, thi trắc nghiệm có thời gian, ôn tập nhanh trước kỳ thi. |
| 4 | **Chatbot AI có RAG** | Trợ lý học tập theo ngữ cảnh giáo trình, trích dẫn nguồn. |
| 5 | **Báo cáo nghiên cứu khoa học** | Đánh giá hiệu quả giảm thời gian ôn tập, mức độ hài lòng và kết quả kiểm tra của sinh viên pilot. |
| 6 | **Tài liệu kỹ thuật & hướng dẫn** | Tài liệu thiết kế, API (Swagger), hướng dẫn vận hành cho giảng viên. |

---

## Ghi chú phân công nhóm

| Thành viên | Mảng phụ trách chính |
|---|---|
| Ngọc Như Phan Nguyên | Trưởng nhóm – khảo sát, điều phối, UI giảng viên/sinh viên, báo cáo |
| Nguyễn Minh Hiệu | Kiến trúc hệ thống, Question Library, Knowledge Graph |
| Lê Mỹ Lộc | Thiết kế UI/UX, CMS khóa học, module học sinh viên |
| Trần Minh Cường | Database, Backend API, Exam engine, Chatbot frontend |
| Nguyễn Văn Linh | Authentication, DevOps/CI-CD, Flashcard API, AI/RAG backend |
| Nguyễn Nhật Sinh | Landing page, layout, Quiz management, Mindmap UI |

---

*Đà Nẵng, ngày …… tháng …… năm 2026*

**CHỦ NHIỆM / TRƯỞNG NHÓM ĐỀ TÀI**

*(Ký và ghi rõ họ tên)*

**Ngọc Như Phan Nguyên**
