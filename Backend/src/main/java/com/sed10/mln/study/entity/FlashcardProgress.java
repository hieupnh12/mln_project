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
@Table(name = "flashcard_progress")
public class FlashcardProgress {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @ManyToOne @JoinColumn(name = "student_id") User student;
    @ManyToOne @JoinColumn(name = "flashcard_id") Flashcard flashcard;
    @Column(length = 20) String status;
}
