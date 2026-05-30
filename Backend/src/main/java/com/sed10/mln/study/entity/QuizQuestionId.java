package com.sed10.mln.study.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class QuizQuestionId implements Serializable {
    @Column(name = "quiz_id") Long quizId;
    @Column(name = "question_id") Long questionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuizQuestionId that = (QuizQuestionId) o;
        return Objects.equals(quizId, that.quizId)
                && Objects.equals(questionId, that.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(quizId, questionId);
    }
}
