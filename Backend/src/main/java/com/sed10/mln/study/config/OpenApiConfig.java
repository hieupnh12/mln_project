package com.sed10.mln.study.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI mlnStudyOpenApi(@Value("${server.servlet.context-path:}") String contextPath) {
        String basePath = contextPath == null || contextPath.isBlank() ? "" : contextPath;

        return new OpenAPI()
                .info(new Info()
                        .title("MLN Study API")
                        .description("API test qua Swagger UI — chưa bật đăng nhập, không cần token.")
                        .version("v1")
                        .contact(new Contact().name("MLN Team")))
                .servers(List.of(new Server().url(basePath).description("Local server")));
    }
}
