package com.sed10.mln.study.dto.request;

import com.sed10.mln.study.dto.mindmap.MindmapNodeDTO;
import com.sed10.mln.study.dto.mindmap.MindmapEdgeDTO;
import lombok.Data;
import java.util.List;

@Data
public class SaveMindmapRequest {
    private String courseId;
    private List<MindmapNodeDTO> nodes;
    private List<MindmapEdgeDTO> edges;
}
