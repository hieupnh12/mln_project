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
@Table(name = "flashcard")
public class Flashcard {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @ManyToOne @JoinColumn(name = "chapter_id") Chapter chapter;
    @Column(length = 255) String term;
    @Column(columnDefinition = "LONGTEXT") String definition;
}
