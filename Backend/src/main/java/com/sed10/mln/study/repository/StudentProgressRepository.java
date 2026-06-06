package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.StudentProgress;
import com.sed10.mln.study.entity.StudentProgressId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, StudentProgressId> {
    Optional<StudentProgress> findById_StudentIdAndId_LessonId(Long studentId, Long lessonId);

    List<StudentProgress> findById_StudentId(Long studentId);

    @Query("""
            SELECT sp FROM StudentProgress sp
            JOIN FETCH sp.lesson l
            JOIN FETCH l.chapter
            WHERE sp.id.studentId = :studentId AND l.chapter.id = :chapterId
            """)
    List<StudentProgress> findByStudentIdAndChapterId(
            @Param("studentId") Long studentId,
            @Param("chapterId") Long chapterId);

    @Query("""
            SELECT sp FROM StudentProgress sp
            JOIN FETCH sp.lesson l
            JOIN FETCH l.chapter c
            WHERE sp.id.studentId = :studentId AND c.subject.id = :subjectId
            """)
    List<StudentProgress> findByStudentIdAndSubjectId(
            @Param("studentId") Long studentId,
            @Param("subjectId") Long subjectId);
}
