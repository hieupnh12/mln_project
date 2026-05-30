package com.sed10.mln.study.mapper;

import java.util.List;

import org.mapstruct.*;

import com.sed10.mln.study.entity.Slide;
import com.sed10.mln.study.dto.response.SlideResponse;

@Mapper(componentModel = "spring")
public interface SlideMapper {

    @Mapping(target = "slideId", source = "id")
    SlideResponse toSlideResponse(Slide slide);

    List<SlideResponse> toSlideResponseList(List<Slide> slides);
}
