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
