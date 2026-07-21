-- User presence + website traffic analytics
-- Chạy trên DB mln_database (MySQL). Hibernate ddl-auto=update cũng có thể tự cột mới.

ALTER TABLE `user`
    ADD COLUMN created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER google_id,
    ADD COLUMN last_seen_at DATETIME NULL AFTER created_at;

UPDATE `user`
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

CREATE TABLE IF NOT EXISTS page_view (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(500) NOT NULL,
    viewer_key VARCHAR(64) NULL,
    user_id BIGINT NULL,
    viewed_at DATETIME NOT NULL,
    INDEX idx_page_view_viewed_at (viewed_at),
    INDEX idx_page_view_path (path)
);
