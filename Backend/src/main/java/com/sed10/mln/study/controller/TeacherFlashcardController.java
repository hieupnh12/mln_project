package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Flashcard;
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
    public record FlashcardResponse(Long id, Long chapterId, String term, String definition) {}

    // Request body DTO
    public record FlashcardRequest(String term, String definition) {}

    @GetMapping("/chapters")
    public ApiResponse<List<FlashcardSetResponse>> getFlashcardSets() {
        Long teacherId = com.sed10.mln.study.security.SecurityUtils.getCurrentUser().getId();
        List<Chapter> chapters = flashcardService.getAllChapters();
        
        List<FlashcardSetResponse> response = new ArrayList<>();
        for (Chapter chapter : chapters) {
            long cardsCount = flashcardService.countFlashcardsInChapter(chapter.getId());
            String status = cardsCount > 0 ? "Đã xuất bản" : "Bản nháp";
            
            // Generate stable mock accuracy based on chapter ID for UI visual richness
            int accuracy = 60 + (int) (chapter.getId() * 7) % 31;
            
            response.add(new FlashcardSetResponse(
                    chapter.getId(),
                    chapter.getTitle(),
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

    @GetMapping("/chapters/{chapterId}/flashcards")
    public ApiResponse<List<FlashcardResponse>> getFlashcards(@PathVariable Long chapterId) {
        List<Flashcard> flashcards = flashcardService.getFlashcardsByChapter(chapterId);
        List<FlashcardResponse> response = flashcards.stream()
                .map(fc -> new FlashcardResponse(
                        fc.getId(),
                        fc.getChapter().getId(),
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

    @PostMapping("/chapters/{chapterId}/flashcards")
    public ApiResponse<FlashcardResponse> createFlashcard(
            @PathVariable Long chapterId,
            @RequestBody FlashcardRequest request) {
        
        Flashcard flashcard = Flashcard.builder()
                .term(request.term())
                .definition(request.definition())
                .build();

        Flashcard saved = flashcardService.createFlashcard(chapterId, flashcard);
        FlashcardResponse response = new FlashcardResponse(
                saved.getId(),
                saved.getChapter().getId(),
                saved.getTerm(),
                saved.getDefinition()
        );

        return ApiResponse.<FlashcardResponse>builder()
                .code(1000)
                .message("Tạo thẻ ghi nhớ thành công")
                .result(response)
                .build();
    }

    @PostMapping("/chapters/{chapterId}/flashcards/bulk")
    public ApiResponse<List<FlashcardResponse>> createFlashcardsBulk(
            @PathVariable Long chapterId,
            @RequestBody List<FlashcardRequest> requests) {
        
        List<Flashcard> flashcards = requests.stream()
                .map(req -> Flashcard.builder()
                        .term(req.term())
                        .definition(req.definition())
                        .build())
                .toList();

        List<Flashcard> savedList = flashcardService.createFlashcardsBulk(chapterId, flashcards);
        
        List<FlashcardResponse> response = savedList.stream()
                .map(saved -> new FlashcardResponse(
                        saved.getId(),
                        saved.getChapter().getId(),
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
                updated.getChapter().getId(),
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
