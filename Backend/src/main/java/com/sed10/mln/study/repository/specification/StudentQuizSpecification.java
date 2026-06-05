package com.sed10.mln.study.repository.specification;

import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.entity.Quiz;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class StudentQuizSpecification {
    private StudentQuizSpecification() {}

    public static Specification<Quiz> forSubjectCatalog(Long subjectId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("subject").get("id"), subjectId));
            predicates.add(criteriaBuilder.equal(root.get("status"), QuizConstant.PUBLISHED));
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
