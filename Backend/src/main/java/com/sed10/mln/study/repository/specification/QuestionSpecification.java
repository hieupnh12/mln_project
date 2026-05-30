package com.sed10.mln.study.repository.specification;

import com.sed10.mln.study.constant.QuestionConstant;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.Question;
import com.sed10.mln.study.entity.Subject;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class QuestionSpecification {
    private QuestionSpecification() {}

    public static Specification<Question> withFilters(
            String search,
            String course,
            String chapter,
            String lesson,
            String difficulty,
            String type,
            String status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Question, Lesson> lessonJoin = root.join("lesson", JoinType.INNER);
            Join<Lesson, Chapter> chapterJoin = lessonJoin.join("chapter", JoinType.LEFT);
            Join<Chapter, Subject> subjectJoin = chapterJoin.join("subject", JoinType.LEFT);

            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), keyword)));
            }
            if (course != null && !course.isBlank() && !"all".equalsIgnoreCase(course)) {
                predicates.add(criteriaBuilder.equal(subjectJoin.get("title"), course));
            }
            if (chapter != null && !chapter.isBlank() && !"all".equalsIgnoreCase(chapter)) {
                predicates.add(criteriaBuilder.equal(chapterJoin.get("title"), chapter));
            }
            if (lesson != null && !lesson.isBlank() && !"all".equalsIgnoreCase(lesson)) {
                predicates.add(criteriaBuilder.equal(lessonJoin.get("title"), lesson));
            }
            if (difficulty != null && !difficulty.isBlank() && !"all".equalsIgnoreCase(difficulty)) {
                predicates.add(criteriaBuilder.equal(root.get("difficulty"), difficulty));
            }
            if (type != null && !type.isBlank() && !"all".equalsIgnoreCase(type)) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }
            if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
                predicates.add(criteriaBuilder.equal(root.get("status"), QuestionConstant.fromLabel(status)));
            }

            query.distinct(true);
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
