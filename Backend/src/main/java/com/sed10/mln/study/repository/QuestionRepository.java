package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {
    interface QuestionCountProjection {
        String getValue();

        long getTotal();
    }

    Optional<Question> findByContentHashAndLesson_Id(String contentHash, Long lessonId);

    List<Question> findByLesson_Id(Long lessonId);

    boolean existsByContentHashAndLesson_Id(String contentHash, Long lessonId);

    @Query("select q.difficulty as value, count(q) as total from Question q group by q.difficulty")
    List<QuestionCountProjection> countGroupedByDifficulty();

    @Query("select q.status as value, count(q) as total from Question q group by q.status")
    List<QuestionCountProjection> countGroupedByStatus();

    @Query("""
            select count(distinct subject.id)
            from Question q
            join q.lesson lesson
            join lesson.chapter chapter
            join chapter.subject subject
            """)
    long countDistinctCourses();
}
