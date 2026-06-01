package com.sed10.mln.study.mapper;

import java.util.List;

import org.mapstruct.*;

import com.sed10.mln.study.entity.Material;
import com.sed10.mln.study.dto.request.MaterialRequest;
import com.sed10.mln.study.dto.response.MaterialDetailResponse;
import com.sed10.mln.study.dto.response.MaterialResponse;

@Mapper(componentModel = "spring", uses = SlideMapper.class)
public interface MaterialMapper {

    @Mapping(target = "MaterialId", source = "id")
    @Mapping(target = "lessonId", source = "lesson.id")
    MaterialResponse toMaterialResponse(Material material);

    @Mapping(target = "materialId", source = "id")
    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "youtubeVideoId", ignore = true)
    @Mapping(target = "youtubeEmbedUrl", ignore = true)
    MaterialDetailResponse toMaterialDetailResponse(Material material);

    List<MaterialResponse> toMaterialListResponse(List<Material> materials);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "slides", ignore = true)
    @Mapping(target = "slideCount", ignore = true)
    @Mapping(target = "contentType", ignore = true)
    @Mapping(target = "resourceUrl", ignore = true)
    void updateMaterialFromRequest(MaterialRequest materialRequest, @MappingTarget Material material);
}
