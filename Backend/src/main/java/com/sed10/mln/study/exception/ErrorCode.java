package com.sed10.mln.study.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    SMS_FAILED(2000, "Gửi SMS thất bại. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST),
    QUESTION_NOT_FOUND(3001, "Không tìm thấy câu hỏi", HttpStatus.NOT_FOUND),
    LESSON_NOT_FOUND(3002, "Không tìm thấy bài học", HttpStatus.NOT_FOUND),
    QUESTION_CONTENT_REQUIRED(3003, "Nội dung câu hỏi không được để trống", HttpStatus.BAD_REQUEST),
    QUESTION_DUPLICATE_EXACT(3004, "Câu hỏi đã tồn tại trong ngân hàng đề", HttpStatus.CONFLICT),
    SUBJECT_NOT_FOUND(1000, "Subject not found", HttpStatus.NOT_FOUND),
    CHAPTER_NOT_FOUND(1001, "Chapter not found", HttpStatus.NOT_FOUND),
    MATERIAL_NOT_FOUND(1002, "Material not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(1004, "User not found", HttpStatus.NOT_FOUND),
    LESSON_CREATE_FAILED(1005, "Lesson create failed", HttpStatus.BAD_REQUEST),
    INVALID_FILE_UPLOAD(1006, "File upload is empty or invalid", HttpStatus.BAD_REQUEST),

    UNSUPPORTED_FILE_TYPE(1007, "Unsupported file type. Use PNG, JPG, WEBP, PDF or PPTX", HttpStatus.BAD_REQUEST),
    SLIDE_PROCESSING_FAILED(1008, "Failed to process slide files", HttpStatus.BAD_REQUEST),
    FILE_DELETE_FAILED(1009, "Failed to delete stored files", HttpStatus.INTERNAL_SERVER_ERROR),
    MATERIAL_CONTENT_REQUIRED(1010, "Material must include slide files or a YouTube link", HttpStatus.BAD_REQUEST),
    MATERIAL_CONTENT_CONFLICT(1011, "Provide either slide files or a YouTube link, not both", HttpStatus.BAD_REQUEST),
    INVALID_YOUTUBE_URL(1012, "Invalid YouTube URL", HttpStatus.BAD_REQUEST),
    TITLE_REQUIRED(1013, "Material title is required", HttpStatus.BAD_REQUEST),
    CLOUDINARY_UPLOAD_FAILED(1014, "Failed to upload file to Cloudinary", HttpStatus.BAD_REQUEST),
    LIBREOFFICE_NOT_AVAILABLE(1015, "LibreOffice is required to convert PPTX. Install LibreOffice or export slides as PDF", HttpStatus.BAD_REQUEST),
    PPTX_CONVERSION_FAILED(1016, "Failed to convert PPTX to slides", HttpStatus.BAD_REQUEST),
    ;


    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
