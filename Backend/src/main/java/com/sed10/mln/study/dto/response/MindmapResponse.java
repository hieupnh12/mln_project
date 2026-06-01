package com.sed10.mln.study.dto.response;

import com.sed10.mln.study.dto.mindmap.MindmapNodeDTO;
import com.sed10.mln.study.dto.mindmap.MindmapEdgeDTO;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MindmapResponse {
    private String courseId;
    private List<MindmapNodeDTO> nodes;
    private List<MindmapEdgeDTO> edges;
}
