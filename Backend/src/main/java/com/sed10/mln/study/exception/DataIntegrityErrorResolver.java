package com.sed10.mln.study.exception;

import org.springframework.dao.DataIntegrityViolationException;

/**
 * Maps low-level DB integrity failures to user-facing {@link ErrorCode}s.
 * The legacy handler always returned "đang được liên kết", which misled import flows
 * when the real cause was data-too-long or unique-key conflicts.
 */
public final class DataIntegrityErrorResolver {
    private DataIntegrityErrorResolver() {}

    public static ErrorCode resolve(DataIntegrityViolationException exception) {
        String detail = buildDetail(exception).toLowerCase();

        if (containsAny(
                detail,
                "data too long",
                "data truncation",
                "too long for column",
                "value too long")) {
            return ErrorCode.DATA_TOO_LONG;
        }

        if (containsAny(
                detail,
                "duplicate entry",
                "unique constraint",
                "uk_tag_name",
                "unique_key")) {
            return ErrorCode.DATA_DUPLICATE;
        }

        if (containsAny(
                detail,
                "foreign key",
                "cannot delete",
                "cannot update",
                "referential integrity",
                "a foreign key constraint fails")) {
            return ErrorCode.DATA_REFERENCED;
        }

        return ErrorCode.DATA_REFERENCED;
    }

    private static String buildDetail(DataIntegrityViolationException exception) {
        StringBuilder detail = new StringBuilder();
        if (exception.getMessage() != null) {
            detail.append(exception.getMessage()).append(' ');
        }
        Throwable root = exception.getMostSpecificCause();
        if (root != null && root.getMessage() != null) {
            detail.append(root.getMessage());
        }
        return detail.toString();
    }

    private static boolean containsAny(String haystack, String... needles) {
        for (String needle : needles) {
            if (haystack.contains(needle)) {
                return true;
            }
        }
        return false;
    }
}
