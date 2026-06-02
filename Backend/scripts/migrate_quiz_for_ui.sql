-- Quiz Management UI — migration + seed mẫu
-- Chạy trên DB mln_database (MySQL).
-- Kiểm tra schema hiện tại: python Backend/scripts/inspect_quiz_schema.py

-- =============================================================================
-- PHẦN 1: BỔ SUNG CỘT CHO BẢNG quiz (khớp UI QuizSettings + QuizListItem)
-- =============================================================================

ALTER TABLE quiz
    ADD COLUMN subject_id BIGINT NULL AFTER lesson_id,
    ADD COLUMN chapter_id BIGINT NULL AFTER subject_id,
    ADD COLUMN passing_score INT NOT NULL DEFAULT 70 AFTER time_limit,
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' AFTER passing_score,
    ADD COLUMN shuffle_answers TINYINT(1) NOT NULL DEFAULT 1 AFTER status,
    ADD COLUMN random_questions TINYINT(1) NOT NULL DEFAULT 0 AFTER shuffle_answers,
    ADD COLUMN random_question_count INT NULL AFTER random_questions,
    ADD COLUMN created_by BIGINT NULL AFTER random_question_count,
    ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER created_by,
    ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- lesson_id NULL = "Tất cả bài" trong chương (UI: lesson = all)
ALTER TABLE quiz MODIFY COLUMN lesson_id BIGINT NULL;

-- FK (bỏ qua nếu đã tồn tại / DB không cho phép)
-- ALTER TABLE quiz ADD CONSTRAINT fk_quiz_subject FOREIGN KEY (subject_id) REFERENCES subject(id);
-- ALTER TABLE quiz ADD CONSTRAINT fk_quiz_chapter FOREIGN KEY (chapter_id) REFERENCES chapter(id);

-- Index phục vụ list/filter
CREATE INDEX idx_quiz_status_updated ON quiz (status, updated_at DESC);
CREATE INDEX idx_quiz_subject ON quiz (subject_id);

-- =============================================================================
-- PHẦN 2: SEED MẪU (dùng ID thật từ DB hiện tại — subject 1, chapter 1, lesson 1)
-- Câu PUBLISHED: 2, 3, 4, 5, 6, 7, 39 (lesson_id=1, chapter_id=1, subject_id=1)
-- Chỉnh lại question_id nếu DB của bạn khác.
-- =============================================================================

INSERT INTO quiz (
    title,
    time_limit,
    passing_score,
    status,
    shuffle_answers,
    random_questions,
    random_question_count,
    subject_id,
    chapter_id,
    lesson_id,
    created_by
) VALUES
(
    'Quiz chương 1',
    15,
    70,
    'PUBLISHED',
    1,
    0,
    NULL,
    1,
    1,
    NULL,
    1
),
(
    'Ôn tập giữa kỳ',
    45,
    75,
    'DRAFT',
    1,
    1,
    10,
    1,
    1,
    NULL,
    1
),
(
    'Kiểm tra nhanh bài 2',
    10,
    60,
    'DRAFT',
    1,
    0,
    NULL,
    1,
    1,
    2,
    1
);

-- Quiz 1: 6 câu đã xuất bản, có thứ tự
INSERT INTO quizQuestion (quiz_id, question_id, sort_order, points) VALUES
((SELECT id FROM quiz WHERE title = 'Quiz chương 1' ORDER BY id DESC LIMIT 1), 2, 1, 1.00),
((SELECT id FROM quiz WHERE title = 'Quiz chương 1' ORDER BY id DESC LIMIT 1), 3, 2, 1.00),
((SELECT id FROM quiz WHERE title = 'Quiz chương 1' ORDER BY id DESC LIMIT 1), 4, 3, 1.00),
((SELECT id FROM quiz WHERE title = 'Quiz chương 1' ORDER BY id DESC LIMIT 1), 5, 4, 1.00),
((SELECT id FROM quiz WHERE title = 'Quiz chương 1' ORDER BY id DESC LIMIT 1), 6, 5, 1.00),
((SELECT id FROM quiz WHERE title = 'Quiz chương 1' ORDER BY id DESC LIMIT 1), 7, 6, 1.00);

-- Quiz 3: 2 câu (draft)
INSERT INTO quizQuestion (quiz_id, question_id, sort_order, points) VALUES
((SELECT id FROM quiz WHERE title = 'Kiểm tra nhanh bài 2' ORDER BY id DESC LIMIT 1), 2, 1, 1.00),
((SELECT id FROM quiz WHERE title = 'Kiểm tra nhanh bài 2' ORDER BY id DESC LIMIT 1), 3, 2, 1.00);

-- =============================================================================
-- PHẦN 3: KIỂM TRA SAU KHI INSERT
-- =============================================================================
-- SELECT q.id, q.title, q.status, q.time_limit, q.passing_score,
--        s.title AS course, c.title AS chapter, l.title AS lesson,
--        (SELECT COUNT(*) FROM quizQuestion qq WHERE qq.quiz_id = q.id) AS question_count
-- FROM quiz q
-- LEFT JOIN subject s ON q.subject_id = s.id
-- LEFT JOIN chapter c ON q.chapter_id = c.id
-- LEFT JOIN lesson l ON q.lesson_id = l.id
-- ORDER BY q.updated_at DESC;

-- Lưu ý: KHÔNG dùng cột question.quiz_id (legacy). Quan hệ quiz–câu hỏi qua quizQuestion.
