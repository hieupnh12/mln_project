-- Hiệu năng catalog bài kiểm tra sinh viên (Phase 1 + 3)
-- Chạy trên DB mln_database (MySQL).

-- Bỏ qua nếu index đã tồn tại
CREATE INDEX idx_quiz_attempt_student_quiz_at
    ON quiz_attempt (student_id, quiz_id, attempted_at DESC);

-- Lịch mở/đóng bài kiểm tra (Phase 3 — NULL = không giới hạn)
ALTER TABLE quiz
    ADD COLUMN available_from DATETIME NULL AFTER updated_at,
    ADD COLUMN available_until DATETIME NULL AFTER available_from;
