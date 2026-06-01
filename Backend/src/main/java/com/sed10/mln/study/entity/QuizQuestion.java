package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "quizQuestion")
public class QuizQuestion {
    @EmbeddedId QuizQuestionId id;

    @ManyToOne @MapsId("quizId") @JoinColumn(name = "quiz_id") Quiz quiz;
    @ManyToOne @MapsId("questionId") @JoinColumn(name = "question_id") Question question;

    @Column(name = "sort_order", nullable = false) Integer sortOrder;
    @Column(precision = 5, scale = 2) BigDecimal points;
}
