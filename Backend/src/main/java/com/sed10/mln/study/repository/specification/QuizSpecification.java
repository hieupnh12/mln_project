package com.sed10.mln.study.repository.specification;

import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Quiz;
import com.sed10.mln.study.entity.Subject;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class QuizSpecification {
    private QuizSpecification() {}

    public static Specification<Quiz> withFilters(String search, String course, String status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Quiz, Subject> subjectJoin = root.join("subject", JoinType.LEFT);
            Join<Quiz, Chapter> chapterJoin = root.join("chapter", JoinType.LEFT);

            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("id").as(String.class)), keyword)));
            }
            if (course != null && !course.isBlank() && !"all".equalsIgnoreCase(course)) {
                predicates.add(criteriaBuilder.equal(subjectJoin.get("title"), course));
            }
            if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
                predicates.add(criteriaBuilder.equal(root.get("status"), QuizConstant.fromLabel(status)));
            }

            query.distinct(true);
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
