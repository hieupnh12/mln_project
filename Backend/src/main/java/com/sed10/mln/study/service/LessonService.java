package com.sed10.mln.study.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;

import com.sed10.mln.study.dto.request.LessonRequest;
import com.sed10.mln.study.dto.response.LessonListResponse;
import com.sed10.mln.study.dto.response.LessonResponse;
import com.sed10.mln.study.entity.*;

import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.LessonMapper;
import com.sed10.mln.study.repository.ChapterRepository;
import com.sed10.mln.study.repository.LessonRepository;
import com.sed10.mln.study.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

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


    public LessonResponse createLesson(LessonRequest lessonRequest, Long chapterId, Long teacherId) {
        Chapter chapter = chapterRepo.findById(chapterId).orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        User teacher = userRepo.findById(teacherId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Lesson lesson = lessonMap.toLessonCreate(lessonRequest, chapter, teacher);
        lesson = lessonRepo.save(lesson);
        return lessonMap.toLessonResponse(lesson);
    }

    
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        lessonRepo.delete(lesson);
    }
     


    public void updateLesson(Long lessonId, LessonRequest lessonRequest) {
        Lesson lesson = lessonRepo.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        lessonMap.updateLessonFromRequest(lessonRequest, lesson);
        lessonRepo.save(lesson);       
    }
    
    public List<LessonListResponse> listlessonAndMaterialByChapterId(Long chapterId) {
        List<Lesson> lessons = lessonRepo.listlessonAndMaterialByChapterId(chapterId);
        return lessonMap.toLessonListResponse(lessons);
    }
    
} 
