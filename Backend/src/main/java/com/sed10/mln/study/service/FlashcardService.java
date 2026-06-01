package com.sed10.mln.study.service;

import com.sed10.mln.study.entity.Flashcard;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.repository.FlashcardRepository;
import com.sed10.mln.study.repository.LessonRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FlashcardService {

    FlashcardRepository flashcardRepository;
    LessonRepository lessonRepository;

    public List<Lesson> getAllLessonsForTeacher(Long teacherId) {
        return lessonRepository.findByTeacherId(teacherId);
    }

    public List<Flashcard> getFlashcardsByLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new AppException(ErrorCode.LESSON_NOT_FOUND);
        }
        return flashcardRepository.findByLessonId(lessonId);
    }

    public long countFlashcardsInLesson(Long lessonId) {
        return flashcardRepository.countByLessonId(lessonId);
    }

    @Transactional
    public Flashcard createFlashcard(Long lessonId, Flashcard flashcard) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        
        flashcard.setLesson(lesson);
        return flashcardRepository.save(flashcard);
    }

    @Transactional
    public List<Flashcard> createFlashcardsBulk(Long lessonId, List<Flashcard> flashcards) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        
        for (Flashcard flashcard : flashcards) {
            flashcard.setLesson(lesson);
        }
        return flashcardRepository.saveAll(flashcards);
    }

    @Transactional
    public Flashcard updateFlashcard(Long id, Flashcard flashcardDetails) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));

        flashcard.setTerm(flashcardDetails.getTerm());
        flashcard.setDefinition(flashcardDetails.getDefinition());
        
        return flashcardRepository.save(flashcard);
    }

    @Transactional
    public void deleteFlashcard(Long id) {
        if (!flashcardRepository.existsById(id)) {
            throw new AppException(ErrorCode.FLASHCARD_NOT_FOUND);
        }
        flashcardRepository.deleteById(id);
    }
}
