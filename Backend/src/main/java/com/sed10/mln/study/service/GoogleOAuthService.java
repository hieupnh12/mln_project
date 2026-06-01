package com.sed10.mln.study.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoogleOAuthService {
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;
    
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();
    
    private static final String GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    
    public String getGoogleLoginUrl() throws UnsupportedEncodingException {
        String scope = URLEncoder.encode("email profile", "UTF-8");
        
        return GOOGLE_AUTH_URL + 
                "?client_id=" + clientId +
                "&redirect_uri=" + URLEncoder.encode(redirectUri, "UTF-8") +
                "&response_type=code" +
                "&scope=" + scope;
    }
    
    public GoogleUserInfo exchangeCodeForToken(String code) {
        try {
            // Exchange authorization code for token
            String tokenRequestBody = "code=" + code +
                    "&client_id=" + clientId +
                    "&client_secret=" + clientSecret +
                    "&redirect_uri=" + redirectUri +
                    "&grant_type=authorization_code";
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);
            
            org.springframework.http.HttpEntity<String> request = new org.springframework.http.HttpEntity<>(
                    tokenRequestBody, headers);
            
            org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(
                    GOOGLE_TOKEN_URL, request, String.class);
            
            JsonObject tokenResponse = gson.fromJson(response.getBody(), JsonObject.class);
            String accessToken = tokenResponse.get("access_token").getAsString();
            
            // Get user info using access token
            org.springframework.http.HttpHeaders userHeaders = new org.springframework.http.HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            org.springframework.http.HttpEntity<?> userRequest = new org.springframework.http.HttpEntity<>(userHeaders);
            
            org.springframework.http.ResponseEntity<String> userResponse = restTemplate.exchange(
                    GOOGLE_USER_INFO_URL,
                    org.springframework.http.HttpMethod.GET,
                    userRequest,
                    String.class
            );
            
            JsonObject userInfo = gson.fromJson(userResponse.getBody(), JsonObject.class);
            
            return GoogleUserInfo.builder()
                    .googleId(userInfo.get("id").getAsString())
                    .email(userInfo.get("email").getAsString())
                    .name(userInfo.get("name").getAsString())
                    .picture(userInfo.has("picture") ? userInfo.get("picture").getAsString() : null)
                    .build();
            
        } catch (Exception e) {
            log.error("Error exchanging code for token: {}", e.getMessage());
            throw new RuntimeException("Failed to exchange Google OAuth code", e);
        }
    }
}
