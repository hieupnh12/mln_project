package com.sed10.mln.study.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.libreoffice")
public class LibreOfficeProperties {
    /** Bật chuyển đổi PPTX → PDF qua LibreOffice */
    private boolean enabled = true;

    /**
     * Đường dẫn soffice.exe (Windows) hoặc soffice (Linux/Mac).
     * Windows mặc định: C:/Program Files/LibreOffice/program/soffice.exe
     */
    private String path = "C:/Program Files/LibreOffice/program/soffice.exe";

    /** Timeout chuyển đổi (giây) */
    private int convertTimeoutSeconds = 120;
}
