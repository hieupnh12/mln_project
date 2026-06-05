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
@Table(name = "quiz")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long id;

    @Column(length = 255)
    String title;

    @Column(name = "time_limit")
    Integer timeLimit;

    @Column(name = "passing_score")
    Integer passingScore;

    @Column(length = 20)
    String status;

    @Column(name = "shuffle_answers")
    Boolean shuffleAnswers;

    @Column(name = "random_questions")
    Boolean randomQuestions;

    @Column(name = "random_question_count")
    Integer randomQuestionCount;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    Subject subject;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    Chapter chapter;

    @ManyToOne
    @JoinColumn(name = "created_by")
    User createdBy;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "available_from")
    LocalDateTime availableFrom;

    @Column(name = "available_until")
    LocalDateTime availableUntil;
}
