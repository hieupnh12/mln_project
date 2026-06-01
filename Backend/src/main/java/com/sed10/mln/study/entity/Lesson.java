package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "lesson")
public class Lesson {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;

    @ManyToOne @JoinColumn(name = "chapter_id") Chapter chapter;

    @ManyToOne @JoinColumn(name = "teacher_id") User teacher;

    @Column(length = 255) String title;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL) List<Material> materials;
}
