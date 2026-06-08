package com.sed10.mln.study.service;

import com.sed10.mln.study.constant.StudentProgressConstant;
import com.sed10.mln.study.dto.request.UpdateStudentProgressRequest;
import com.sed10.mln.study.dto.response.StudentProgressResponse;
import com.sed10.mln.study.entity.*;

import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.StudentProgressMapper;
import com.sed10.mln.study.repository.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentProgressService {
    StudentProgressRepository progressRepo;
    StudentProgressMapper progressMapper;
    UserRepository userRepo;
    LessonRepository lessonRepo;
    ChapterRepository chapterRepo;
    SubjectRepository subjectRepo;

    @Transactional(readOnly = true)
    public StudentProgressResponse getLessonProgress(Long studentId, Long lessonId) {
        Lesson lesson = findLesson(lessonId);

        return progressRepo.findById_StudentIdAndId_LessonId(studentId, lessonId)
                .map(progressMapper::toResponse)
                .orElseGet(() -> progressMapper.toDefaultResponse(
                        studentId,
                        lesson,
                        StudentProgressConstant.NOT_STARTED));
    }

    public StudentProgressResponse updateLessonProgress(
            Long studentId,
            Long lessonId,
            UpdateStudentProgressRequest request) {
        String normalizedStatus = validateAndNormalizeStatus(request.getStatus());
        User student = findStudent(studentId);
        Lesson lesson = findLesson(lessonId);

        StudentProgressId id = StudentProgressId.builder()
                .studentId(studentId)
                .lessonId(lessonId)
                .build();

        StudentProgress saved = progressRepo.findById(id)
                .map(existing -> {
                    existing.setStatus(normalizedStatus);
                    return progressRepo.save(existing);
                })
                .orElseGet(() -> progressRepo.save(StudentProgress.builder()
                        .id(id)
                        .student(student)
                        .lesson(lesson)
                        .status(normalizedStatus)
                        .build()));

        return progressMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentProgressResponse> listProgressByChapter(Long studentId, Long chapterId) {
        chapterRepo.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));

        List<Lesson> lessons = lessonRepo.findByChapter_IdOrderByIdAsc(chapterId);
        return mergeLessonsWithProgress(studentId, lessons, progressRepo.findByStudentIdAndChapterId(studentId, chapterId));
    }

    @Transactional(readOnly = true)
    public List<StudentProgressResponse> listProgressBySubject(Long studentId, Long subjectId) {
        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        List<Lesson> lessons = new ArrayList<>();
        chapterRepo.findAllBySubject(subject).forEach(chapter ->
                lessons.addAll(lessonRepo.findByChapter_IdOrderByIdAsc(chapter.getId())));

        return mergeLessonsWithProgress(studentId, lessons, progressRepo.findByStudentIdAndSubjectId(studentId, subjectId));
    }

    private List<StudentProgressResponse> mergeLessonsWithProgress(
            Long studentId,
            List<Lesson> lessons,
            List<StudentProgress> progressRecords) {
        Map<Long, StudentProgress> progressByLessonId = progressRecords.stream()
                .collect(Collectors.toMap(
                        progress -> progress.getId().getLessonId(),
                        Function.identity(),
                        (left, right) -> left,
                        LinkedHashMap::new));

        return lessons.stream()
                .map(lesson -> {
                    StudentProgress progress = progressByLessonId.get(lesson.getId());
                    if (progress != null) {
                        return progressMapper.toResponse(progress);
                    }
                    return progressMapper.toDefaultResponse(
                            studentId,
                            lesson,
                            StudentProgressConstant.NOT_STARTED);
                })
                .toList();
    }

    private User findStudent(Long studentId) {
        return userRepo.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Lesson findLesson(Long lessonId) {
        return lessonRepo.findByIdWithChapter(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
    }

    private String validateAndNormalizeStatus(String status) {
        if (!StudentProgressConstant.isValidStatus(status)) {
            throw new AppException(ErrorCode.INVALID_PROGRESS_STATUS);
        }
        return StudentProgressConstant.normalizeStatus(status);
    }
}
