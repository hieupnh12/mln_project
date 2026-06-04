package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "quiz_attempt_question")
public class QuizAttemptQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long id;

    @ManyToOne
    @JoinColumn(name = "attempt_id")
    QuizAttempt attempt;

    @ManyToOne
    @JoinColumn(name = "question_id")
    Question question;

    @Column(name = "sort_order")
    int sortOrder;
}
