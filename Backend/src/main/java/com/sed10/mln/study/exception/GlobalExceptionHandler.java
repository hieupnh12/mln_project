package com.sed10.mln.study.exception;

import com.sed10.mln.study.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<Object>> handlingRuntimeException(Exception exception) {
        log.error("Unhandled exception", exception);
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handlingDataIntegrityViolationException(org.springframework.dao.DataIntegrityViolationException exception) {
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage("Không thể thực hiện vì dữ liệu này đang được liên kết ở nơi khác (ví dụ: đang có khóa học, bài giảng...).");

        return ResponseEntity.ok(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse<Object>> handlingAppException(AppException exception) {
        if (exception.getErrorCode() != ErrorCode.MATERIAL_NOT_FOUND
                && exception.getErrorCode() != ErrorCode.LESSON_NOT_FOUND) {
            log.warn("AppException [{}]: {}", exception.getErrorCode().getCode(), exception.getErrorCode().getMessage());
        }
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }
}
