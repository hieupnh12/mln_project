package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    @Query(
            """
            SELECT DISTINCT l FROM Lesson l
            LEFT JOIN FETCH l.chapter c
            LEFT JOIN FETCH c.subject
            ORDER BY l.id
            """)
    List<Lesson> findAllWithChapterAndSubject();
}