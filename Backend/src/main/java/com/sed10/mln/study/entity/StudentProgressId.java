package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class StudentProgressId implements Serializable {
    @Column(name = "student_id") Long studentId;
    @Column(name = "lesson_id") Long lessonId;
    @Override public boolean equals(Object o) { if (this == o) return true; if (o == null || getClass() != o.getClass()) return false; StudentProgressId that = (StudentProgressId) o; return studentId.equals(that.studentId) && lessonId.equals(that.lessonId); }
    @Override public int hashCode() { return java.util.Objects.hash(studentId, lessonId); }
}
