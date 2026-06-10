package com.sed10.mln.study.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.sed10.mln.study.entity.Material;
@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("SELECT m FROM Material m LEFT JOIN FETCH m.lesson l WHERE l.id = :lessonId")
    List<Material> findByLessonId(Long lessonId);

    @Query("""
            SELECT m FROM Material m
            LEFT JOIN FETCH m.lesson l
            LEFT JOIN FETCH m.slides s
            WHERE m.id = :materialId
            ORDER BY s.slideIndex ASC
            """)
    Optional<Material> findByIdWithSlides(Long materialId);

    @Query("""
            SELECT m FROM Material m
            JOIN FETCH m.lesson l
            LEFT JOIN FETCH l.chapter c
            LEFT JOIN FETCH c.subject s
            WHERE m.resourceUrl IS NOT NULL
            ORDER BY s.title, c.title, l.title, m.title
            """)
    List<Material> findAllWithHierarchyAndResource();
}
