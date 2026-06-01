package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "material")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    Lesson lesson;

    @Column(length = 255)
    String title;

    @Column(name = "content_type", length = 20)
    String contentType;

    /** URL file gốc (PDF) nếu giáo viên upload dạng PDF */
    @Column(name = "resource_url", length = 500)
    String resourceUrl;

    @Column(name = "slide_count")
    Integer slideCount;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("slideIndex ASC")
    @Builder.Default
    List<Slide> slides = new ArrayList<>();
}
