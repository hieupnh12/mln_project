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
@Table(name = "subject")
public class Subject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @Column(name = "subject_code", length = 20) String subjectCode;
    @Column(length = 255) String title;
    @Column(columnDefinition = "LONGTEXT") String description;
}
