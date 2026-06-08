package com.sed10.mln.study.service;

import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Flashcard;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.repository.ChapterRepository;
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

    ChapterRepository chapterRepository;
    FlashcardRepository flashcardRepository;
    LessonRepository lessonRepository;

    public List<Chapter> getAllChapters() {
        List<Lesson> lessons = lessonRepository.findAllWithChapterAndSubject();
        return lessons.stream()
                .map(Lesson::getChapter)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    public List<Flashcard> getFlashcardsByChapter(Long chapterId) {
        if (!chapterRepository.existsById(chapterId)) {
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        }
        return flashcardRepository.findByChapterId(chapterId);
    }

    public long countFlashcardsInChapter(Long chapterId) {
        return flashcardRepository.countByChapterId(chapterId);
    }

    @Transactional
    public Flashcard createFlashcard(Long chapterId, Flashcard flashcard) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        
        flashcard.setChapter(chapter);
        return flashcardRepository.save(flashcard);
    }

    @Transactional
    public List<Flashcard> createFlashcardsBulk(Long chapterId, List<Flashcard> flashcards) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
        
        for (Flashcard flashcard : flashcards) {
            flashcard.setChapter(chapter);
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
