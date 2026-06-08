package com.sed10.mln.study.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    SMS_FAILED(2000, "Gửi SMS thất bại. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST),
    LESSON_NOT_FOUND(2001, "Không tìm thấy bài học", HttpStatus.NOT_FOUND),
    FLASHCARD_NOT_FOUND(2002, "Không tìm thấy thẻ ghi nhớ", HttpStatus.NOT_FOUND),
    QUESTION_NOT_FOUND(3001, "Không tìm thấy câu hỏi", HttpStatus.NOT_FOUND),
    QUESTION_CONTENT_REQUIRED(3003, "Nội dung câu hỏi không được để trống", HttpStatus.BAD_REQUEST),
    QUESTION_DUPLICATE_EXACT(3004, "Câu hỏi đã tồn tại trong ngân hàng đề", HttpStatus.CONFLICT),
    QUESTION_NOT_PENDING(3005, "Chỉ có thể duyệt câu hỏi đang ở trạng thái cần duyệt", HttpStatus.CONFLICT),
    QUESTION_PUBLISHED_NOT_EDITABLE(3006, "Câu hỏi đã duyệt không thể chỉnh sửa", HttpStatus.CONFLICT),
    QUIZ_NOT_FOUND(3010, "Không tìm thấy quiz", HttpStatus.NOT_FOUND),
    QUIZ_SCOPE_INVALID(3011, "Phạm vi môn/chương/bài không hợp lệ", HttpStatus.BAD_REQUEST),
    QUIZ_PUBLISH_INVALID(3012, "Quiz chưa đủ điều kiện xuất bản", HttpStatus.BAD_REQUEST),
    QUIZ_DELETE_NOT_ALLOWED(3013, "Chỉ có thể xóa quiz bản nháp", HttpStatus.CONFLICT),
    QUIZ_CLOSE_INVALID(3014, "Chỉ có thể tắt quiz đang live", HttpStatus.CONFLICT),
    QUIZ_NOT_AVAILABLE(3015, "Quiz không còn trong thời gian làm bài", HttpStatus.CONFLICT),
    STUDENT_ACCESS_DENIED(3020, "Không có quyền truy cập dữ liệu học sinh khác", HttpStatus.FORBIDDEN),
    SUBJECT_NOT_FOUND(1000, "Subject not found", HttpStatus.NOT_FOUND),
    CHAPTER_NOT_FOUND(1001, "Chapter not found", HttpStatus.NOT_FOUND),
    MATERIAL_NOT_FOUND(1002, "Material not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(1004, "User not found", HttpStatus.NOT_FOUND),
    LESSON_CREATE_FAILED(1005, "Lesson create failed", HttpStatus.BAD_REQUEST),
    INVALID_FILE_UPLOAD(1006, "File upload is empty or invalid", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1020, "Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN),

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
    INVALID_PROGRESS_STATUS(1017, "Trạng thái tiến độ không hợp lệ", HttpStatus.BAD_REQUEST),
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
