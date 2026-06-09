package com.sed10.mln.study.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.sed10.mln.study.entity.Lesson;
import java.util.Optional;
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

    List<Lesson> findByChapter_IdOrderByIdAsc(Long chapterId);

    @Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.chapter WHERE l.id = :lessonId")
    java.util.Optional<Lesson> findByIdWithChapter(@Param("lessonId") Long lessonId);

    Optional<Lesson> findFirstByChapter_IdAndTitle(Long chapterId, String title);

    @Query("""
            SELECT l FROM Lesson l
            JOIN l.chapter c
            WHERE c.subject.id = :subjectId AND l.title = :title
            """)
    Optional<Lesson> findFirstBySubjectIdAndTitle(
            @Param("subjectId") Long subjectId,
            @Param("title") String title);
}
