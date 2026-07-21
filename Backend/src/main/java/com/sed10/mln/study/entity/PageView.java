package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "page_view")
public class PageView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "path", length = 500, nullable = false)
    String path;

    @Column(name = "viewer_key", length = 64)
    String viewerKey;

    @Column(name = "user_id")
    Long userId;

    @Column(name = "viewed_at", nullable = false)
    LocalDateTime viewedAt;
}
