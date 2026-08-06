-- Optional manual migration when ddl-auto is not used.
CREATE TABLE IF NOT EXISTS subject_document (
    id BIGINT NOT NULL AUTO_INCREMENT,
    subject_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    resource_url VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NULL,
    content_type VARCHAR(120) NULL,
    file_size BIGINT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_subject_document_subject
        FOREIGN KEY (subject_id) REFERENCES subject (id)
);
