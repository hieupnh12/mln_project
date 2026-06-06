package com.sed10.mln.study.security;

import com.sed10.mln.study.entity.User;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }
        throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
    }
}
