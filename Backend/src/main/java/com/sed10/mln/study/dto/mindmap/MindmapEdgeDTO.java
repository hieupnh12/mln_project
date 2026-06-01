package com.sed10.mln.study.dto.mindmap;

import lombok.Data;

@Data
public class MindmapEdgeDTO {
    private String id;
    private String source;
    private String target;
    private String type;
}
