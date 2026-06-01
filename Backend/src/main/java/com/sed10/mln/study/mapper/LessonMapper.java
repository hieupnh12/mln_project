package com.sed10.mln.study.mapper;

import java.util.List;

import org.mapstruct.*;

import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.User;
import com.sed10.mln.study.dto.request.LessonRequest;
import com.sed10.mln.study.dto.response.LessonListResponse;
import com.sed10.mln.study.dto.response.LessonResponse;

@Mapper(componentModel = "spring", uses = MaterialMapper.class)
public interface LessonMapper {
    @Mapping(target = "LessonId", source = "id")
    @Mapping(target = "chapterName", source = "chapter.title")
    @Mapping(target = "teacherName", source = "teacher.fullName")
    LessonResponse toLessonResponse(Lesson lesson);

    @Mapping(target = "LessonId", source = "id")
    @Mapping(target = "chapterName", source = "chapter.title")
    @Mapping(target = "teacherName", source = "teacher.fullName")
    LessonListResponse toLessonListResponse(Lesson lesson);


    default Lesson toLessonCreate(LessonRequest lessonRequest, Chapter chapter, User teacher ){
        return Lesson.builder()
        .chapter(chapter)
        .teacher(teacher)
        .title(lessonRequest.getTitle())
        .build();
    }

    void updateLessonFromRequest(LessonRequest lessonRequest, @MappingTarget Lesson lesson);

    List<LessonListResponse> toLessonListResponse(List<Lesson> lessons);
}
