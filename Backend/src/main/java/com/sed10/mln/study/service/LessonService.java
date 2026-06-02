package com.sed10.mln.study.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;

import com.sed10.mln.study.dto.request.LessonRequest;
import com.sed10.mln.study.dto.response.LessonListResponse;
import com.sed10.mln.study.dto.response.LessonResponse;
import com.sed10.mln.study.entity.*;

import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.LessonMapper;
import com.sed10.mln.study.repository.*;

import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessonService {
    final LessonRepository lessonRepo;
    final LessonMapper lessonMap;
    final ChapterRepository chapterRepo;
    final UserRepository userRepo;
    final MaterialRepository materialRepo;
    final MaterialService materialSer;


    public LessonResponse createLesson(LessonRequest lessonRequest, Long chapterId, Long teacherId) {
        Chapter chapter = chapterRepo.findById(chapterId).orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        User teacher = userRepo.findById(teacherId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Lesson lesson = lessonMap.toLessonCreate(lessonRequest, chapter, teacher);
        lesson = lessonRepo.save(lesson);
        return lessonMap.toLessonResponse(lesson);
    }

    
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        materialRepo.findByLessonId(lessonId).forEach(material -> materialSer.deleteMaterial(material.getId()));
        lessonRepo.delete(lesson);
    }
     


    public void updateLesson(Long lessonId, LessonRequest lessonRequest) {
        Lesson lesson = lessonRepo.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        if (lessonRequest.getTitle() != null) {
            lesson.setTitle(lessonRequest.getTitle());
        }
        if (lessonRequest.getContent() != null) {
            lesson.setContent(lessonRequest.getContent());
        }
        lessonRepo.save(lesson);       
    }
    
    public LessonResponse getLessonById(Long lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        return lessonMap.toLessonResponse(lesson);
    }
    
    public List<LessonListResponse> listlessonAndMaterialByChapterId(Long chapterId) {
        List<Lesson> lessons = lessonRepo.listlessonAndMaterialByChapterId(chapterId);
        return lessons.stream().map(lesson -> {
            LessonListResponse response = lessonMap.toLessonListResponse(lesson);
            if (lesson.getMaterials() != null && !lesson.getMaterials().isEmpty()) {
                response.setMaterials(lesson.getMaterials().stream()
                        .map(materialSer::toMaterialResponseWithPreview)
                        .toList());
            }
            return response;
        }).toList();
    }
    
}
