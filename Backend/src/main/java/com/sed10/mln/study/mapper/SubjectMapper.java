package com.sed10.mln.study.mapper;

import org.mapstruct.*;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.dto.request.SubjectRequest;
import com.sed10.mln.study.dto.response.SubjectResponse;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    // SubjectMapper INSTANCE = Mappers.getMapper(SubjectMapper.class);
    @Mapping(target = "subjectId", source = "subject.id")
    SubjectResponse toSubjectResponse(Subject subject);
    
    Subject toSubject(SubjectRequest subjectRequest);

    void updateSubjectFromRequest(SubjectRequest subjectRequest, @MappingTarget Subject subject);
    
}
