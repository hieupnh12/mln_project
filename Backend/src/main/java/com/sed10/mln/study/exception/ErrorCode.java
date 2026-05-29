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
