package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {
    Optional<Question> findByContentHashAndLesson_Id(String contentHash, Long lessonId);

    List<Question> findByLesson_Id(Long lessonId);

    boolean existsByContentHashAndLesson_Id(String contentHash, Long lessonId);
}
