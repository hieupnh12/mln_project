package com.sed10.mln.study.dto.mindmap;

import lombok.Data;

@Data
public class MindmapNodeDTO {
    private String id;
    private String type;
    private PositionDTO position;
    private NodeDataDTO data;
}
