package com.sed10.mln.study.service;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoogleUserInfo {
    String googleId;
    String email;
    String name;
    String picture;
}
