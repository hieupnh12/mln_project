package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByLessonId(Long lessonId);
    long countByLessonId(Long lessonId);
    void deleteByLessonId(Long lessonId);
}
