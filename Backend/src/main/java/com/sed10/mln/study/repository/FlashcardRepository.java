package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByChapterId(Long chapterId);
    long countByChapterId(Long chapterId);
    void deleteByChapterId(Long chapterId);
}
