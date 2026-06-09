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
@Table(name = "student_progress")
public class StudentProgress {
    @EmbeddedId StudentProgressId id;
    @ManyToOne @MapsId("studentId") @JoinColumn(name = "student_id") User student;
    @ManyToOne @MapsId("lessonId") @JoinColumn(name = "lesson_id") Lesson lesson;
    @Column(length = 20) String status;
    @Column(name = "updated_at") LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void touchUpdatedAt() {
        updatedAt = LocalDateTime.now();
    }
}
