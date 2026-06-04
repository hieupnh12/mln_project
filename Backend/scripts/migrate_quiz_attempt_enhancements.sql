-- Bổ sung elapsed_seconds + snapshot câu hỏi cho mỗi lần làm bài
-- Chạy trên DB mln_database (MySQL).

ALTER TABLE quiz_attempt
    ADD COLUMN elapsed_seconds INT NULL AFTER attempted_at;

CREATE TABLE IF NOT EXISTS quiz_attempt_question (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_qaq_attempt FOREIGN KEY (attempt_id) REFERENCES quiz_attempt (id) ON DELETE CASCADE,
    CONSTRAINT fk_qaq_question FOREIGN KEY (question_id) REFERENCES question (id),
    UNIQUE KEY uk_qaq_attempt_question (attempt_id, question_id)
);

CREATE INDEX idx_qaq_attempt ON quiz_attempt_question (attempt_id);
