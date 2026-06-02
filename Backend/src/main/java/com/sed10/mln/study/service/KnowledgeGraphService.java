package com.sed10.mln.study.service;

import com.sed10.mln.study.dto.mindmap.MindmapEdgeDTO;
import com.sed10.mln.study.dto.mindmap.MindmapNodeDTO;
import com.sed10.mln.study.dto.mindmap.NodeDataDTO;
import com.sed10.mln.study.dto.mindmap.PositionDTO;
import com.sed10.mln.study.dto.request.SaveMindmapRequest;
import com.sed10.mln.study.dto.response.MindmapResponse;
import com.sed10.mln.study.entity.KnowledgeGraphEdge;
import com.sed10.mln.study.entity.KnowledgeGraphNode;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.repository.KnowledgeGraphEdgeRepository;
import com.sed10.mln.study.repository.KnowledgeGraphNodeRepository;
import com.sed10.mln.study.repository.SubjectRepository;
import com.sed10.mln.study.repository.ChapterRepository;
import com.sed10.mln.study.repository.LessonRepository;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Lesson;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KnowledgeGraphService {

    private final KnowledgeGraphNodeRepository nodeRepository;
    private final KnowledgeGraphEdgeRepository edgeRepository;
    private final SubjectRepository subjectRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public MindmapResponse getMindmap(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        List<KnowledgeGraphNode> nodes = nodeRepository.findAllBySubjectId(subjectId);
        List<KnowledgeGraphEdge> edges = edgeRepository.findAllBySubjectId(subjectId);

        if (nodes.isEmpty()) {
            return generateDefaultMindmap(subject);
        }

        List<MindmapNodeDTO> nodeDTOs = nodes.stream().map(node -> {
            MindmapNodeDTO dto = new MindmapNodeDTO();
            dto.setId(node.getReactFlowId());
            dto.setType(node.getReactFlowType());
            
            PositionDTO position = new PositionDTO();
            position.setX(node.getPosX());
            position.setY(node.getPosY());
            dto.setPosition(position);
            
            NodeDataDTO data = new NodeDataDTO();
            data.setId(node.getReactFlowId());
            data.setTitle(node.getTitle());
            data.setEntityType(node.getEntityType());
            data.setEntityId(node.getEntityId());
            dto.setData(data);
            
            return dto;
        }).collect(Collectors.toList());

        List<MindmapEdgeDTO> edgeDTOs = edges.stream().map(edge -> {
            MindmapEdgeDTO dto = new MindmapEdgeDTO();
            dto.setId(edge.getReactFlowId());
            dto.setSource(edge.getSourceNode().getReactFlowId());
            dto.setTarget(edge.getTargetNode().getReactFlowId());
            dto.setType(edge.getRelationType());
            return dto;
        }).collect(Collectors.toList());

        return MindmapResponse.builder()
                .courseId(String.valueOf(subjectId))
                .nodes(nodeDTOs)
                .edges(edgeDTOs)
                .build();
    }

    private MindmapResponse generateDefaultMindmap(Subject subject) {
        List<MindmapNodeDTO> nodeDTOs = new ArrayList<>();
        List<MindmapEdgeDTO> edgeDTOs = new ArrayList<>();

        // Root Node (Subject)
        MindmapNodeDTO root = new MindmapNodeDTO();
        root.setId("root-" + subject.getId());
        root.setType("entity");
        
        NodeDataDTO rootData = new NodeDataDTO();
        rootData.setId(root.getId());
        rootData.setTitle(subject.getTitle());
        rootData.setEntityType("SUBJECT");
        rootData.setEntityId(subject.getId());
        root.setData(rootData);
        
        PositionDTO rootPos = new PositionDTO();
        rootPos.setX(0.0f);
        rootPos.setY(0.0f);
        root.setPosition(rootPos);
        
        nodeDTOs.add(root);

        List<Chapter> chapters = chapterRepository.findAllBySubject(subject);
        for (Chapter chapter : chapters) {
            MindmapNodeDTO chapterNode = new MindmapNodeDTO();
            chapterNode.setId("chapter-" + chapter.getId());
            chapterNode.setType("entity");
            
            NodeDataDTO chapterData = new NodeDataDTO();
            chapterData.setId(chapterNode.getId());
            chapterData.setTitle(chapter.getTitle());
            chapterData.setEntityType("CHAPTER");
            chapterData.setEntityId(chapter.getId());
            chapterNode.setData(chapterData);
            
            PositionDTO chapterPos = new PositionDTO();
            chapterPos.setX(0.0f);
            chapterPos.setY(0.0f);
            chapterNode.setPosition(chapterPos);
            
            nodeDTOs.add(chapterNode);

            MindmapEdgeDTO edge = new MindmapEdgeDTO();
            edge.setId("edge-root-" + chapter.getId());
            edge.setSource(root.getId());
            edge.setTarget(chapterNode.getId());
            edge.setType("smoothstep");
            edgeDTOs.add(edge);

            List<Lesson> lessons = lessonRepository.listlessonAndMaterialByChapterId(chapter.getId());
            for (Lesson lesson : lessons) {
                MindmapNodeDTO lessonNode = new MindmapNodeDTO();
                lessonNode.setId("lesson-" + lesson.getId());
                lessonNode.setType("entity");
                
                NodeDataDTO lessonData = new NodeDataDTO();
                lessonData.setId(lessonNode.getId());
                lessonData.setTitle(lesson.getTitle());
                lessonData.setEntityType("LESSON");
                lessonData.setEntityId(lesson.getId());
                lessonNode.setData(lessonData);
                
                PositionDTO lessonPos = new PositionDTO();
                lessonPos.setX(0.0f);
                lessonPos.setY(0.0f);
                lessonNode.setPosition(lessonPos);
                
                nodeDTOs.add(lessonNode);

                MindmapEdgeDTO lEdge = new MindmapEdgeDTO();
                lEdge.setId("edge-chapter-" + chapter.getId() + "-lesson-" + lesson.getId());
                lEdge.setSource(chapterNode.getId());
                lEdge.setTarget(lessonNode.getId());
                lEdge.setType("smoothstep");
                edgeDTOs.add(lEdge);
            }
        }

        return MindmapResponse.builder()
                .courseId(String.valueOf(subject.getId()))
                .nodes(nodeDTOs)
                .edges(edgeDTOs)
                .build();
    }

    @Transactional
    public void saveMindmap(Long subjectId, SaveMindmapRequest request) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        // Delete old graph
        edgeRepository.deleteAllBySubjectId(subjectId);
        nodeRepository.deleteAllBySubjectId(subjectId);

        // Map for fast lookup to create edges
        Map<String, KnowledgeGraphNode> nodeMap = new HashMap<>();

        // Save new nodes
        List<KnowledgeGraphNode> newNodes = new ArrayList<>();
        if (request.getNodes() != null) {
            for (MindmapNodeDTO nodeDTO : request.getNodes()) {
                KnowledgeGraphNode node = new KnowledgeGraphNode();
                node.setSubject(subject);
                node.setReactFlowId(nodeDTO.getId());
                node.setReactFlowType(nodeDTO.getType());
                
                if (nodeDTO.getPosition() != null) {
                    node.setPosX(nodeDTO.getPosition().getX());
                    node.setPosY(nodeDTO.getPosition().getY());
                }
                
                if (nodeDTO.getData() != null) {
                    node.setTitle(nodeDTO.getData().getTitle());
                    node.setEntityType(nodeDTO.getData().getEntityType());
                    node.setEntityId(nodeDTO.getData().getEntityId());
                }
                
                node.setIsRoot(false);
                node.setColor(null);
                
                newNodes.add(node);
                nodeMap.put(nodeDTO.getId(), node);
            }
            nodeRepository.saveAll(newNodes);
        }

        // Save new edges
        List<KnowledgeGraphEdge> newEdges = new ArrayList<>();
        if (request.getEdges() != null) {
            for (MindmapEdgeDTO edgeDTO : request.getEdges()) {
                KnowledgeGraphNode sourceNode = nodeMap.get(edgeDTO.getSource());
                KnowledgeGraphNode targetNode = nodeMap.get(edgeDTO.getTarget());
                
                if (sourceNode != null && targetNode != null) {
                    KnowledgeGraphEdge edge = new KnowledgeGraphEdge();
                    edge.setSubject(subject);
                    edge.setReactFlowId(edgeDTO.getId());
                    edge.setSourceNode(sourceNode);
                    edge.setTargetNode(targetNode);
                    edge.setRelationType(edgeDTO.getType());
                    newEdges.add(edge);
                }
            }
            edgeRepository.saveAll(newEdges);
        }
    }
}
