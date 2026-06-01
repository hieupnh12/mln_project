package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "question")
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;

    @ManyToOne @JoinColumn(name = "lesson_id", nullable = false) Lesson lesson;

    @Column(length = 500, nullable = false) String title;
    @Column(columnDefinition = "LONGTEXT") String content;
    @Column(name = "content_hash", length = 64) String contentHash;
    @Column(name = "duplicate_warning", length = 255) String duplicateWarning;
    @Column(length = 50, nullable = false) String type;
    @Column(length = 50, nullable = false) String difficulty;
    @Column(length = 50, nullable = false) String status;
    @Column(name = "bloom_level", length = 50) String bloomLevel;
    @Column(columnDefinition = "LONGTEXT") String explanation;
    @Column(precision = 5, scale = 2, nullable = false) BigDecimal score;
    @Column(name = "estimated_time_seconds", nullable = false) Integer estimatedTimeSeconds;

    @ManyToOne @JoinColumn(name = "created_by") User createdBy;
    @ManyToOne @JoinColumn(name = "updated_by") User updatedBy;

    @Column(name = "created_at") LocalDateTime createdAt;
    @Column(name = "updated_at") LocalDateTime updatedAt;
    @Column(name = "published_at") LocalDateTime publishedAt;
}
