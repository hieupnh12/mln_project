package com.sed10.mln.study.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.sed10.mln.study.entity.Lesson;
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    
    @Query(
        """
        SELECT DISTINCT l FROM Lesson l
        LEFT JOIN FETCH l.chapter c
        LEFT JOIN FETCH c.subject
        ORDER BY l.id
        """)
List<Lesson> findAllWithChapterAndSubject();
    
   @Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.materials m WHERE l.chapter.id = :chapterId")
    List<Lesson> listlessonAndMaterialByChapterId(Long chapterId);

    List<Lesson> findByTeacherId(Long teacherId);
}
