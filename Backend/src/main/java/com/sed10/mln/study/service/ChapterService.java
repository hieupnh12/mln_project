package com.sed10.mln.study.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import com.sed10.mln.study.repository.*;

import com.sed10.mln.study.dto.request.ChapterRequest;
import com.sed10.mln.study.dto.response.ChapterResponse;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.ChapterMapper;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChapterService {
    final ChapterRepository chapterRepo;
    final ChapterMapper chapterMap;
    final SubjectRepository subjectRepo;
    final LessonRepository lessonRepo;
    final LessonService lessonSer;
    

    
    public ChapterResponse createChapter(ChapterRequest request, Long subjectId) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
        Chapter chapter = chapterMap.toChapterCreate(request, subject);
        chapter = chapterRepo.save(chapter);
        return chapterMap.toChapterResponse(chapter);
    }



    public List<ChapterResponse> getChapterBySubjectId(Long subjectId) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
        List<Chapter> chapters = chapterRepo.findAllBySubject(subject);
        return chapterMap.toChapterResponseList(chapters);
    }




    public List<ChapterResponse> getAllChapters() {
        return chapterRepo.findAll().stream()
        .map(chapterMap::toChapterResponse)
        .collect(Collectors.toList());
    }



    public ChapterResponse updateChapter(Long id, ChapterRequest request) {
        Chapter chapter = chapterRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        chapterMap.updateChapterFromRequest(request, chapter);
        chapter = chapterRepo.save(chapter);
        return chapterMap.toChapterResponse(chapter);
    }

    public void deleteChapter(Long id) {
        Chapter chapter = chapterRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        lessonRepo.listlessonAndMaterialByChapterId(id).forEach(lesson -> lessonSer.deleteLesson(lesson.getId()));
        chapterRepo.delete(chapter);
    }
    

    
}
