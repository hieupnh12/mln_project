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
@Table(name = "answer")
public class Answer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @ManyToOne @JoinColumn(name = "question_id") Question question;
    @Column(columnDefinition = "LONGTEXT", nullable = false) String content;
    @Column(name = "is_correct") Boolean isCorrect;
    @Column(name = "sort_order", nullable = false) Integer sortOrder;
}
