import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";

import { fetchFlashcardsByChapter } from "~/features/teacher/api/flashcard.api";
import { fetchChapterDetailApi } from "~/features/teacher/course-structure/api/course-structure.api";
import type { Flashcard } from "~/features/teacher/types/flashcard.types";
import { getAuthSession } from "~/shared/services/auth-session.service";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import {
  getFlashcardIndexStorageKey,
  getFlashcardMasteredStorageKey,
} from "../constants/flashcard-storage.constants";

export function useChapterFlashcardsSession(chapterId: number) {
  const [chapterTitle, setChapterTitle] = useState("");
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [originalCards, setOriginalCards] = useState<Flashcard[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isIndexLoaded, setIsIndexLoaded] = useState(false);
  const [masteredCardIds, setMasteredCardIds] = useState<Set<number>>(new Set());

  const studentId = useMemo(() => {
    const session = getAuthSession();
    return session ? `${session.role}_${session.accessToken.substring(0, 8)}` : "guest";
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getFlashcardMasteredStorageKey(studentId, chapterId));
      if (saved) {
        setMasteredCardIds(new Set(JSON.parse(saved) as number[]));
      }
    } catch {
      // Ignore corrupted storage.
    }
  }, [chapterId, studentId]);

  useEffect(() => {
    if (cards.length > 0 && !isIndexLoaded) {
      try {
        const savedIndex = localStorage.getItem(getFlashcardIndexStorageKey(studentId, chapterId));
        if (savedIndex) {
          const parsed = Number.parseInt(savedIndex, 10);
          if (!Number.isNaN(parsed) && parsed >= 0 && parsed < cards.length) {
            setCurrentIndex(parsed);
          }
        }
      } catch {
        // Ignore corrupted storage.
      } finally {
        setIsIndexLoaded(true);
      }
    }
  }, [cards.length, chapterId, isIndexLoaded, studentId]);

  useEffect(() => {
    if (cards.length > 0 && isIndexLoaded) {
      try {
        localStorage.setItem(
          getFlashcardIndexStorageKey(studentId, chapterId),
          String(currentIndex),
        );
      } catch {
        // Ignore storage errors.
      }
    }
  }, [cards.length, chapterId, currentIndex, isIndexLoaded, studentId]);

  const saveProgress = useCallback(
    (newIds: Set<number>) => {
      setMasteredCardIds(newIds);
      try {
        localStorage.setItem(
          getFlashcardMasteredStorageKey(studentId, chapterId),
          JSON.stringify(Array.from(newIds)),
        );
      } catch {
        // Ignore storage errors.
      }
    },
    [chapterId, studentId],
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [chapterData, cardsData] = await Promise.all([
          fetchChapterDetailApi(chapterId),
          fetchFlashcardsByChapter(chapterId),
        ]);

        setChapterTitle(chapterData.title);
        setSubjectId(chapterData.subjectId);
        setOriginalCards(cardsData ?? []);
        setCards(cardsData ?? []);
      } catch {
        showErrorToast("Không thể tải thông tin chương học hoặc thẻ ghi nhớ.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!Number.isNaN(chapterId)) {
      void loadData();
    }
  }, [chapterId]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    window.setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
    }, 150);
  }, [cards.length]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    window.setTimeout(() => {
      setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    }, 150);
  }, [cards.length]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault();
        toggleFlip();
      } else if (event.code === "ArrowLeft") {
        handlePrev();
      } else if (event.code === "ArrowRight") {
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, toggleFlip]);

  const handleToggleMaster = useCallback(
    (cardId: number) => {
      const newIds = new Set(masteredCardIds);
      if (newIds.has(cardId)) {
        newIds.delete(cardId);
      } else {
        newIds.add(cardId);
      }
      saveProgress(newIds);
    },
    [masteredCardIds, saveProgress],
  );

  const handleToggleShuffle = useCallback(() => {
    setIsFlipped(false);
    window.setTimeout(() => {
      if (isShuffled) {
        setCards(originalCards);
        setIsShuffled(false);
      } else {
        setCards([...cards].sort(() => Math.random() - 0.5));
        setIsShuffled(true);
      }
      setCurrentIndex(0);
    }, 150);
  }, [cards, isShuffled, originalCards]);

  const handleResetProgress = useCallback(() => {
    if (window.confirm("Bạn có chắc chắn muốn làm mới tiến trình học của chương này?")) {
      setIsFlipped(false);
      window.setTimeout(() => {
        saveProgress(new Set());
        setCurrentIndex(0);
        showSuccessToast("Đã làm mới tiến trình học tập.");
      }, 150);
    }
  }, [saveProgress]);

  const handleSpeak = useCallback((event: MouseEvent, text: string) => {
    event.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      showErrorToast("Trình duyệt không hỗ trợ đọc văn bản.");
    }
  }, []);

  const masteredCount = useMemo(
    () => originalCards.filter((card) => masteredCardIds.has(card.id)).length,
    [masteredCardIds, originalCards],
  );

  const completionPercentage = useMemo(() => {
    if (originalCards.length === 0) {
      return 0;
    }
    return Math.round((masteredCount / originalCards.length) * 100);
  }, [masteredCount, originalCards.length]);

  const masteryLevel = useMemo(() => {
    if (completionPercentage >= 80) {
      return "Nâng cao";
    }
    if (completionPercentage >= 40) {
      return "Trung bình";
    }
    return "Cơ bản";
  }, [completionPercentage]);

  const estimatedMinutes = useMemo(
    () => Math.max(3, Math.round((originalCards.length * 20) / 60)),
    [originalCards.length],
  );

  const currentCard = cards[currentIndex];

  return {
    cards,
    chapterTitle,
    completionPercentage,
    currentCard,
    currentIndex,
    estimatedMinutes,
    handleNext,
    handlePrev,
    handleResetProgress,
    handleSpeak,
    handleToggleMaster,
    handleToggleShuffle,
    isFlipped,
    isLoading,
    isShuffled,
    masteredCardIds,
    masteredCount,
    masteryLevel,
    originalCards,
    subjectId,
    toggleFlip,
  };
}
