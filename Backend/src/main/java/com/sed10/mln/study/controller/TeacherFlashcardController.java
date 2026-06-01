package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.entity.Flashcard;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.service.FlashcardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherFlashcardController {

    FlashcardService flashcardService;

    // DTO for Flashcard Set mapping
    public record FlashcardSetResponse(Long id, String title, long cards, String status, int accuracy) {}

    // DTO for Flashcard details mapping
    public record FlashcardResponse(Long id, Long lessonId, String term, String definition) {}

    // Request body DTO
    public record FlashcardRequest(String term, String definition) {}

    @GetMapping("/lessons")
    public ApiResponse<List<FlashcardSetResponse>> getFlashcardSets() {
        // Mock teacherId as 1 for simplicity of this implementation
        Long teacherId = 1L;
        List<Lesson> lessons = flashcardService.getAllLessonsForTeacher(teacherId);
        
        List<FlashcardSetResponse> response = new ArrayList<>();
        for (Lesson lesson : lessons) {
            long cardsCount = flashcardService.countFlashcardsInLesson(lesson.getId());
            String status = cardsCount > 0 ? "Đã xuất bản" : "Bản nháp";
            
            // Generate stable mock accuracy based on lesson ID for UI visual richness
            int accuracy = 60 + (int) (lesson.getId() * 7) % 31;
            
            response.add(new FlashcardSetResponse(
                    lesson.getId(),
                    lesson.getTitle(),
                    cardsCount,
                    status,
                    accuracy
            ));
        }
        
        return ApiResponse.<List<FlashcardSetResponse>>builder()
                .code(1000)
                .message("Lấy danh sách bộ thẻ thành công")
                .result(response)
                .build();
    }

    @GetMapping("/lessons/{lessonId}/flashcards")
    public ApiResponse<List<FlashcardResponse>> getFlashcards(@PathVariable Long lessonId) {
        List<Flashcard> flashcards = flashcardService.getFlashcardsByLesson(lessonId);
        List<FlashcardResponse> response = flashcards.stream()
                .map(fc -> new FlashcardResponse(
                        fc.getId(),
                        fc.getLesson().getId(),
                        fc.getTerm(),
                        fc.getDefinition()
                ))
                .toList();

        return ApiResponse.<List<FlashcardResponse>>builder()
                .code(1000)
                .message("Lấy danh sách thẻ thành công")
                .result(response)
                .build();
    }

    @PostMapping("/lessons/{lessonId}/flashcards")
    public ApiResponse<FlashcardResponse> createFlashcard(
            @PathVariable Long lessonId,
            @RequestBody FlashcardRequest request) {
        
        Flashcard flashcard = Flashcard.builder()
                .term(request.term())
                .definition(request.definition())
                .build();

        Flashcard saved = flashcardService.createFlashcard(lessonId, flashcard);
        FlashcardResponse response = new FlashcardResponse(
                saved.getId(),
                saved.getLesson().getId(),
                saved.getTerm(),
                saved.getDefinition()
        );

        return ApiResponse.<FlashcardResponse>builder()
                .code(1000)
                .message("Tạo thẻ ghi nhớ thành công")
                .result(response)
                .build();
    }

    @PostMapping("/lessons/{lessonId}/flashcards/bulk")
    public ApiResponse<List<FlashcardResponse>> createFlashcardsBulk(
            @PathVariable Long lessonId,
            @RequestBody List<FlashcardRequest> requests) {
        
        List<Flashcard> flashcards = requests.stream()
                .map(req -> Flashcard.builder()
                        .term(req.term())
                        .definition(req.definition())
                        .build())
                .toList();

        List<Flashcard> savedList = flashcardService.createFlashcardsBulk(lessonId, flashcards);
        
        List<FlashcardResponse> response = savedList.stream()
                .map(saved -> new FlashcardResponse(
                        saved.getId(),
                        saved.getLesson().getId(),
                        saved.getTerm(),
                        saved.getDefinition()
                ))
                .toList();

        return ApiResponse.<List<FlashcardResponse>>builder()
                .code(1000)
                .message("Tạo danh sách thẻ ghi nhớ thành công")
                .result(response)
                .build();
    }

    @PutMapping("/flashcards/{id}")
    public ApiResponse<FlashcardResponse> updateFlashcard(
            @PathVariable Long id,
            @RequestBody FlashcardRequest request) {
        
        Flashcard details = Flashcard.builder()
                .term(request.term())
                .definition(request.definition())
                .build();

        Flashcard updated = flashcardService.updateFlashcard(id, details);
        FlashcardResponse response = new FlashcardResponse(
                updated.getId(),
                updated.getLesson().getId(),
                updated.getTerm(),
                updated.getDefinition()
        );

        return ApiResponse.<FlashcardResponse>builder()
                .code(1000)
                .message("Cập nhật thẻ ghi nhớ thành công")
                .result(response)
                .build();
    }

    @DeleteMapping("/flashcards/{id}")
    public ApiResponse<Void> deleteFlashcard(@PathVariable Long id) {
        flashcardService.deleteFlashcard(id);
        
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Xóa thẻ ghi nhớ thành công")
                .build();
    }
}
