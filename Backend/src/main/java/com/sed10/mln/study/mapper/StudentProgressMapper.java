package com.sed10.mln.study.mapper;

import com.sed10.mln.study.dto.response.StudentProgressResponse;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.StudentProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentProgressMapper {
    @Mapping(target = "studentId", source = "id.studentId")
    @Mapping(target = "lessonId", source = "id.lessonId")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    @Mapping(target = "chapterId", source = "lesson.chapter.id")
    StudentProgressResponse toResponse(StudentProgress progress);

    default StudentProgressResponse toDefaultResponse(Long studentId, Lesson lesson, String status) {
        return StudentProgressResponse.builder()
                .studentId(studentId)
                .lessonId(lesson.getId())
                .lessonTitle(lesson.getTitle())
                .chapterId(lesson.getChapter() != null ? lesson.getChapter().getId() : null)
                .status(status)
                .build();
    }
}
