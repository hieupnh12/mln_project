package com.sed10.mln.study.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.thymeleaf.expression.Lists;

import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.dto.request.ChapterRequest;
import com.sed10.mln.study.dto.response.ChapterResponse;

@Mapper(componentModel = "spring")
public interface ChapterMapper {
    // ChapterMapper INSTANCE = Mappers.getMapper(ChapterMapper.class);

   @Mapping(target = "subjectId", source = "subject.id")
   @Mapping(target = "chapterId", source = "chapter.id")
    ChapterResponse toChapterResponse(Chapter chapter);

    
    default Chapter toChapterCreate (ChapterRequest chapterRequest , Subject subject){
        return Chapter.builder()
        .subject(subject)
        .title(chapterRequest.getTitle())
        .build();
    } 


    default List<ChapterResponse> toChapterResponseList(List<Chapter> chapters){
        return chapters.stream()
        .map(this::toChapterResponse)
        .collect(Collectors.toList());
    }

    
    void updateChapterFromRequest(ChapterRequest chapterRequest, @MappingTarget Chapter chapter);
}
