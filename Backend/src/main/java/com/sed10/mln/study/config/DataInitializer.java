package com.sed10.mln.study.config;

import com.sed10.mln.study.entity.*;
import com.sed10.mln.study.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataInitializer implements CommandLineRunner {

    UserRepository userRepository;
    SubjectRepository subjectRepository;
    ChapterRepository chapterRepository;
    LessonRepository lessonRepository;
    FlashcardRepository flashcardRepository;

    @Override
    public void run(String... args) throws Exception {
        // If there's no user, seed a default teacher
        if (userRepository.count() == 0) {
            User teacher = User.builder()
                    .username("teacher_nguyen")
                    .fullName("Giảng viên Nguyen")
                    .email("nguyen.teacher@mlmaster.edu.vn")
                    .role("teacher")
                    .isActive(true)
                    .build();
            userRepository.save(teacher);

            Subject subject = Subject.builder()
                    .title("Triết học Mác - Lênin")
                    .subjectCode("MLN")
                    .description("Môn học lý luận chính trị cốt lõi")
                    .build();
            subjectRepository.save(subject);

            Chapter chapter1 = Chapter.builder()
                    .subject(subject)
                    .title("Khái lược về Triết học Mác - Lênin")
                    .build();
            chapterRepository.save(chapter1);

            Lesson lesson1 = Lesson.builder()
                    .chapter(chapter1)
                    .teacher(teacher)
                    .title("Khái niệm nền tảng")
                    .build();
            Lesson lesson2 = Lesson.builder()
                    .chapter(chapter1)
                    .teacher(teacher)
                    .title("Quy luật phép biện chứng")
                    .build();
            Lesson lesson3 = Lesson.builder()
                    .chapter(chapter1)
                    .teacher(teacher)
                    .title("Nhận thức luận")
                    .build();
            
            lessonRepository.saveAll(List.of(lesson1, lesson2, lesson3));

            // Seed flashcards for Concept (Lesson 1)
            flashcardRepository.saveAll(List.of(
                    Flashcard.builder()
                            .lesson(lesson1)
                            .term("Triết học là gì?")
                            .definition("Hệ thống tri thức lý luận chung nhất của con người về thế giới, về bản thân con người và vị trí của con người trong thế giới đó.")
                            .build(),
                    Flashcard.builder()
                            .lesson(lesson1)
                            .term("Thế giới quan là gì?")
                            .definition("Toàn bộ những quan điểm, quan niệm của con người về thế giới và về bản thân con người, về cuộc sống và vị trí của con người trong cuộc sống đó.")
                            .build(),
                    Flashcard.builder()
                            .lesson(lesson1)
                            .term("Vấn đề cơ bản của triết học là gì?")
                            .definition("Mối quan hệ giữa vật chất và ý thức (giữa tư duy và tồn tại). Gồm 2 mặt: Bản thể luận (vật chất hay ý thức có trước) và Nhận thức luận (con người có nhận thức được thế giới không).")
                            .build()
            ));

            // Seed flashcards for Dialectics (Lesson 2)
            flashcardRepository.saveAll(List.of(
                    Flashcard.builder()
                            .lesson(lesson2)
                            .term("Phép biện chứng là gì?")
                            .definition("Học thuyết về sự liên hệ phổ biến và sự phát triển dưới hình thức hoàn bị nhất, sâu sắc nhất và không phiến diện.")
                            .build(),
                    Flashcard.builder()
                            .lesson(lesson2)
                            .term("Quy luật lượng - chất?")
                            .definition("Chỉ ra cách thức của sự vận động và phát triển: Những thay đổi dần dần về lượng đạt đến giới hạn (độ) sẽ dẫn đến sự thay đổi nhảy vọt về chất.")
                            .build()
            ));

            System.out.println(">>> SEEDED MOCK DATA FOR TEACHER FLASHCARDS SUCCESSFULLY!");
        }
    }
}
