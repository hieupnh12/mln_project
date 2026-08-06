-- Fix answer.content: DB was varchar(255) while JPA entity expects LONGTEXT.
-- Import đề với đáp án dài (>255 ký tự) sẽ bị DataIntegrityViolation nếu chưa chạy script này.
-- Chạy trên DB mln_database (MySQL).

ALTER TABLE answer
    MODIFY COLUMN content LONGTEXT NULL;
