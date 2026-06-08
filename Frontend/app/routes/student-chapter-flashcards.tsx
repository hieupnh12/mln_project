import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { fetchChapterDetailApi } from "../features/teacher/course-structure/api/course-structure.api";
import { fetchFlashcardsByChapter } from "../features/teacher/api/flashcard.api";
import type { Flashcard } from "../features/teacher/types/flashcard.types";
import { getAuthSession } from "~/shared/services/auth-session.service";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import {
  ArrowLeft,
  Volume2,
  HelpCircle,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Timer,
  Brain,
  Star,
  Bell,
  User,
} from "lucide-react";

export function meta() {
  return [{ title: "Thẻ ghi nhớ Chương | M-L Master" }];
}

export default function StudentChapterFlashcardsPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const numericChapterId = Number(chapterId);

  // Core details
  const [chapterTitle, setChapterTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Flashcards state
  const [originalCards, setOriginalCards] = useState<Flashcard[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isIndexLoaded, setIsIndexLoaded] = useState(false);

  // Student progress state (Mastered flashcard IDs)
  const [masteredCardIds, setMasteredCardIds] = useState<Set<number>>(new Set());

  // Resolve current student ID to scope progress
  const studentId = useMemo(() => {
    const session = getAuthSession();
    return session ? session.role + "_" + session.accessToken.substring(0, 8) : "guest";
  }, []);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mln_flashcards_mastered_${studentId}_chapter_${numericChapterId}`);
      if (saved) {
        setMasteredCardIds(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
  }, [studentId, numericChapterId]);

  // Load last studied index from localStorage once cards are loaded
  useEffect(() => {
    if (cards.length > 0 && !isIndexLoaded) {
      try {
        const savedIndex = localStorage.getItem(`mln_flashcards_current_index_${studentId}_chapter_${numericChapterId}`);
        if (savedIndex) {
          const parsed = parseInt(savedIndex, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < cards.length) {
            setCurrentIndex(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load current index from localStorage", e);
      } finally {
        setIsIndexLoaded(true);
      }
    }
  }, [studentId, numericChapterId, cards.length, isIndexLoaded]);

  // Save active index to localStorage whenever it changes, but only after it has been initially loaded
  useEffect(() => {
    if (cards.length > 0 && isIndexLoaded) {
      try {
        localStorage.setItem(
          `mln_flashcards_current_index_${studentId}_chapter_${numericChapterId}`,
          String(currentIndex)
        );
      } catch (e) {
        console.error("Failed to save current index to localStorage", e);
      }
    }
  }, [currentIndex, studentId, numericChapterId, cards.length, isIndexLoaded]);

  // Save progress helper
  const saveProgress = useCallback((newIds: Set<number>) => {
    setMasteredCardIds(newIds);
    try {
      localStorage.setItem(
        `mln_flashcards_mastered_${studentId}_chapter_${numericChapterId}`,
        JSON.stringify(Array.from(newIds))
      );
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  }, [studentId, numericChapterId]);

  // Fetch chapter & flashcards
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [chapterData, cardsData] = await Promise.all([
          fetchChapterDetailApi(numericChapterId),
          fetchFlashcardsByChapter(numericChapterId),
        ]);

        setChapterTitle(chapterData.title);
        setOriginalCards(cardsData || []);
        setCards(cardsData || []);
      } catch (err) {
        showErrorToast("Không thể tải thông tin chương học hoặc thẻ ghi nhớ.");
      } finally {
        setIsLoading(false);
      }
    }

    if (numericChapterId) {
      loadData();
    }
  }, [numericChapterId]);

  // Slide navigation
  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
    }, 150);
  }, [cards.length]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    }, 150);
  }, [cards.length]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        toggleFlip();
      } else if (event.code === "ArrowLeft") {
        handlePrev();
      } else if (event.code === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFlip, handlePrev, handleNext]);

  // Toggle master status
  const handleToggleMaster = useCallback((cardId: number) => {
    const newIds = new Set(masteredCardIds);
    if (newIds.has(cardId)) {
      newIds.delete(cardId);
    } else {
      newIds.add(cardId);
    }
    saveProgress(newIds);
  }, [masteredCardIds, saveProgress]);

  // Shuffle action
  const handleToggleShuffle = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      if (isShuffled) {
        setCards(originalCards);
        setIsShuffled(false);
      } else {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setIsShuffled(true);
      }
      setCurrentIndex(0);
    }, 150);
  }, [cards, originalCards, isShuffled]);

  // Reset progress action
  const handleResetProgress = useCallback(() => {
    if (window.confirm("Bạn có chắc chắn muốn làm mới tiến trình học của chương này?")) {
      setIsFlipped(false);
      setTimeout(() => {
        saveProgress(new Set());
        setCurrentIndex(0);
        showSuccessToast("Đã làm mới tiến trình học tập.");
      }, 150);
    }
  }, [saveProgress]);


  // TTS text reader
  const handleSpeak = useCallback((e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Avoid flipping the card
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

  // Completion & metrics calculations
  const masteredCount = useMemo(() => {
    return originalCards.filter((c) => masteredCardIds.has(c.id)).length;
  }, [originalCards, masteredCardIds]);

  const completionPercentage = useMemo(() => {
    if (originalCards.length === 0) return 0;
    return Math.round((masteredCount / originalCards.length) * 100);
  }, [originalCards.length, masteredCount]);

  const masteryLevel = useMemo(() => {
    if (completionPercentage >= 80) return "Advanced";
    if (completionPercentage >= 40) return "Intermediate";
    return "Beginner";
  }, [completionPercentage]);

  const estimatedMinutes = useMemo(() => {
    // Approx 20 seconds per card as estimated study duration
    return Math.max(3, Math.round((originalCards.length * 20) / 60));
  }, [originalCards.length]);

  const currentCard = cards[currentIndex];

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F4F1EA]">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-outline-variant border-t-primary"></div>
        <p className="font-medium text-on-surface-variant">Đang tải thẻ ghi nhớ...</p>
      </div>
    );
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="bg-[#F4F1EA] text-on-surface font-body-md min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      
      {/* 3D X-axis flip card CSS classes inlined for absolute rendering safety */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective {
          perspective: 1200px;
          -webkit-perspective: 1200px;
        }
        .card-inner {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
        .card-inner.is-flipped {
          transform: rotateX(180deg);
          -webkit-transform: rotateX(180deg);
        }
        .card-front, .card-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .card-back {
          transform: rotateX(180deg);
          -webkit-transform: rotateX(180deg);
        }
      `}} />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-outline-variant/50 bg-surface/95 shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              to="/student"
              className="min-w-0 truncate text-headline-md font-bold text-primary hover:opacity-85"
            >
              ML Learning
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                to="/student"
                className="text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <button
                onClick={handleBack}
                className="border-b-2 border-secondary pb-1 text-label-md font-medium text-primary text-left cursor-pointer"
              >
                Curriculum
              </button>
              <a
                className="text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
                href="#catalog"
              >
                Resources
              </a>
              <a
                className="text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
                href="#analytics"
              >
                Analytics
              </a>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <button
              aria-label="Thông báo"
              className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50 active:scale-95"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              aria-label="Tài khoản"
              className="flex h-9 w-9 items-center justify-center rounded-full p-1 transition hover:bg-surface-variant/50 text-on-surface-variant"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-margin-mobile md:px-margin-desktop py-base md:py-lg">
        
        {/* Course Header */}
        <header className="mb-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div className="space-y-2">
              <button onClick={handleBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-label-md font-label-md">Back to Curriculum</span>
              </button>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                Học thuyết & Khái niệm
              </span>
              <h1 className="text-headline-lg font-headline-lg text-primary">{chapterTitle}</h1>
              <p className="text-body-md text-on-surface-variant max-w-2xl">
                Khám phá các khái niệm cốt lõi, định nghĩa học thuyết và rèn luyện tư duy lý luận thông qua hệ thống thẻ ghi nhớ thông minh của chương.
              </p>
            </div>
          </div>
        </header>

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-outline-variant/60 rounded-xl p-md text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
            <HelpCircle className="h-16 w-16 text-on-surface-variant mb-4 scale-120 opacity-70" />
            <h2 className="text-headline-md font-headline-md text-primary">Bộ thẻ trống</h2>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-sm">
              Chương học này hiện chưa được cấu hình thẻ ghi nhớ nào. Vui lòng quay lại sau!
            </p>
            <button onClick={handleBack} className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 active:scale-95 cursor-pointer">
              Quay lại học phần
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Main Interactive study dashboard area in a 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
              
              {/* LEFT COLUMN: Study Area */}
              <div className="flex flex-col items-center">
                
                {/* Active Card Header with index & nice status indicator */}
                <div className="w-full max-w-5xl flex items-center justify-between mb-4 bg-white px-6 py-3.5 rounded-2xl border-2 border-outline-variant/80 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-label-md font-semibold text-primary">
                      Học thuyết & Khái niệm cốt lõi của Chương
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary-container/50 px-3 py-1 rounded-full text-secondary text-xs font-bold">
                    Thẻ {currentIndex + 1} / {cards.length}
                  </div>
                </div>

                {/* Progress bar neat integration right above card slider */}
                <div className="w-full max-w-5xl h-1.5 bg-outline-variant/30 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                  />
                </div>

                {/* The 3D Flip Card Container - Enlarged by 30% */}
                <div className="perspective w-full max-w-5xl h-[560px] md:h-[620px] cursor-pointer" onClick={toggleFlip}>
                  <div className={`card-inner relative w-full h-full shadow-[0_12px_40px_rgba(14,18,30,0.06)] ${isFlipped ? "is-flipped" : ""}`} id="flashcard">
                    
                    {/* Front State: Clean white background */}
                    <div className="card-front bg-white rounded-[24px] flex flex-col items-center justify-between p-gutter text-center border border-outline-variant/60 relative shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                      
                      {/* Speaker and Star actions */}
                      <div className="absolute top-6 right-6 flex items-center gap-3">
                        <button
                          onClick={(e) => handleSpeak(e, currentCard.term)}
                          className="h-9 w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low flex items-center justify-center transition-colors"
                          title="Đọc thuật ngữ"
                          type="button"
                        >
                          <Volume2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMaster(currentCard.id);
                          }}
                          className={`h-9 w-9 rounded-full transition-colors flex items-center justify-center hover:bg-surface-container-low ${
                            masteredCardIds.has(currentCard.id)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-on-surface-variant hover:text-yellow-500"
                          }`}
                          title={masteredCardIds.has(currentCard.id) ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                          type="button"
                        >
                          <Star size={18} />
                        </button>
                      </div>

                      <span className="flex items-center gap-1.5 text-on-surface-variant/60 font-semibold mt-12">
                        <HelpCircle size={16} />
                        <span className="text-xs uppercase tracking-widest font-bold">Thuật ngữ</span>
                      </span>
                      
                      <h2 className="text-[30px] md:text-[42px] font-bold font-serif text-primary px-8 leading-snug my-auto tracking-wide">
                        {currentCard.term}
                      </h2>
                      
                      <p className="text-label-sm font-label-sm text-on-surface-variant/50 mb-2">Nhấp chuột hoặc phím Space để lật</p>
                    </div>

                    {/* Back State: Clean white background */}
                    <div className="card-back bg-white rounded-[24px] flex flex-col items-center justify-between p-gutter text-center border border-outline-variant/60 relative shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                      
                      {/* Speaker and Star actions */}
                      <div className="absolute top-6 right-6 flex items-center gap-3">
                        <button
                          onClick={(e) => handleSpeak(e, currentCard.definition)}
                          className="h-9 w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low flex items-center justify-center transition-colors"
                          title="Đọc định nghĩa"
                          type="button"
                        >
                          <Volume2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMaster(currentCard.id);
                          }}
                          className={`h-9 w-9 rounded-full transition-colors flex items-center justify-center hover:bg-surface-container-low ${
                            masteredCardIds.has(currentCard.id)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-on-surface-variant hover:text-yellow-500"
                          }`}
                          title={masteredCardIds.has(currentCard.id) ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                          type="button"
                        >
                          <Star size={18} />
                        </button>
                      </div>

                      <span className="flex items-center gap-1.5 text-on-surface-variant/60 font-semibold mt-12">
                        <Brain size={16} className="text-secondary" />
                        <span className="text-xs uppercase tracking-widest font-bold">Định nghĩa</span>
                      </span>

                      <div className="px-12 my-auto max-h-[70%] overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-[20px] md:text-[28px] font-medium text-primary leading-relaxed font-sans">
                          {currentCard.definition}
                        </p>
                      </div>

                      <p className="text-label-sm font-label-sm text-on-surface-variant/50 mb-2">Nhấp chuột để ẩn định nghĩa</p>
                    </div>

                  </div>
                </div>

                {/* Card Controls Panel */}
                <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-outline-variant/80 shadow-sm w-full max-w-5xl mx-auto">
                  <button
                    onClick={handleToggleShuffle}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md border transition-all ${isShuffled
                      ? "bg-secondary-container border-secondary/35 text-primary font-semibold"
                      : "border-outline-variant/60 text-on-surface hover:bg-surface-variant/40"
                      }`}
                  >
                    <Shuffle size={15} />
                    <span>{isShuffled ? "Đang Trộn" : "Xáo trộn"}</span>
                  </button>

                  <div className="flex items-center gap-4 bg-surface-container-low/60 px-2 py-2 rounded-full border border-outline-variant/40">
                    <button
                      onClick={handlePrev}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-container-high/70 text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
                      title="Thẻ trước"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <span className="text-label-md font-semibold text-on-surface-variant min-w-[60px] text-center tabular-nums">
                      {currentIndex + 1} / {cards.length}
                    </span>

                    <button
                      onClick={handleNext}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-container-high/70 text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
                      title="Thẻ sau"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleResetProgress}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md border border-outline-variant/60 text-on-surface hover:bg-surface-variant/40 transition-all"
                  >
                    <RotateCcw size={15} />
                    <span>Làm mới</span>
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: Sidebar Statistics Dashboard - Boxed with border-2 */}
              <aside className="bg-white border-2 border-outline-variant/80 rounded-2xl p-6 shadow-sm space-y-6" id="analytics">
                
                {/* Learning Progress circular summary */}
                <div className="pb-6 border-b border-outline-variant/40">
                  <h4 className="text-label-md font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Brain className="h-4.5 w-4.5 text-secondary" />
                    Tiến trình học tập
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-on-surface-variant">Thẻ đã thuộc</span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {masteredCount} / {originalCards.length}
                    </span>
                  </div>
                  
                  <div className="w-full h-2 bg-outline-variant/40 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant/80 mt-3 leading-relaxed">
                    Đánh dấu thẻ đã thuộc bằng cách nhấn biểu tượng ✔ trên thẻ hoặc trong danh sách catalog phía dưới.
                  </p>
                </div>

                {/* Training metrics dashboard details */}
                <div className="space-y-4 pb-6 border-b border-outline-variant/40">
                  <h4 className="text-label-md font-bold text-primary uppercase tracking-wider mb-2">
                    Chỉ số rèn luyện
                  </h4>
                  
                  <div className="flex items-center gap-3.5 bg-surface-container-low/60 p-3 rounded-xl border border-outline-variant/20">
                    <div className="bg-secondary-container p-2 rounded-lg text-secondary shrink-0">
                      <Timer className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-on-surface-variant">Thời gian dự kiến</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{estimatedMinutes} phút</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-surface-container-low/60 p-3 rounded-xl border border-outline-variant/20">
                    <div className="bg-secondary-container p-2 rounded-lg text-secondary shrink-0">
                      <Brain className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-on-surface-variant">Độ thông thuộc</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{masteryLevel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-surface-container-low/60 p-3 rounded-xl border border-outline-variant/20">
                    <div className="bg-secondary-container p-2 rounded-lg text-secondary shrink-0">
                      <Star className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-on-surface-variant">Tỷ lệ hoàn thành</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{completionPercentage}% mục tiêu</p>
                    </div>
                  </div>
                </div>

                {/* Helpful study shortcuts */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Phím tắt học nhanh</span>
                  <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
                    <div className="flex items-center justify-between bg-surface-container-high/40 px-3 py-2 rounded-lg border border-outline-variant/10">
                      <span>Lật thẻ</span>
                      <kbd className="bg-white border border-outline-variant px-2 py-0.5 rounded-sm shadow-2xs font-mono font-bold">Space</kbd>
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-high/40 px-3 py-2 rounded-lg border border-outline-variant/10">
                      <span>Thẻ tiếp theo</span>
                      <kbd className="bg-white border border-outline-variant px-2 py-0.5 rounded-sm shadow-2xs font-mono font-bold">→</kbd>
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-high/40 px-3 py-2 rounded-lg border border-outline-variant/10">
                      <span>Thẻ trước đó</span>
                      <kbd className="bg-white border border-outline-variant px-2 py-0.5 rounded-sm shadow-2xs font-mono font-bold">←</kbd>
                    </div>
                  </div>
                </div>

              </aside>

            </div>

            {/* Detailed vocabulary catalog below - Boxed in a beautiful white border-2 card */}
            <div className="w-full mt-12 bg-white border-2 border-outline-variant/80 rounded-2xl p-6 shadow-sm space-y-gutter" id="catalog">
              <div className="border-b border-outline-variant/40 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                  <h3 className="text-headline-md font-headline-md text-primary font-bold">
                    Từ vựng & Khái niệm trong chương ({originalCards.length})
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Tra cứu nhanh toàn bộ danh sách câu hỏi học tập và định nghĩa.
                  </p>
                </div>
                <span className="text-xs text-secondary font-semibold bg-secondary-container px-4 py-1.5 rounded-full w-fit">
                  Đã thuộc {masteredCount} thẻ
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {originalCards.map((card, idx) => {
                  const isMastered = masteredCardIds.has(card.id);
                  return (
                    <article
                      key={card.id}
                      className="grid grid-cols-1 md:grid-cols-[60px_1.2fr_2fr_90px] items-center gap-4 p-6 rounded-2xl transition duration-300 border bg-white border-outline-variant/60 hover:border-outline-variant hover:shadow-md"
                    >
                      {/* Index */}
                      <span className="text-xs font-black tracking-widest text-on-surface-variant/50">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Term */}
                      <div className="font-bold text-primary font-serif text-lg md:pr-4 tracking-wide leading-snug">
                        {card.term}
                      </div>

                      {/* Definition */}
                      <div className="text-[15px] leading-relaxed md:border-l md:border-outline-variant/30 md:pl-6 py-2 md:py-1 text-on-surface-variant">
                        {card.definition}
                      </div>

                      {/* Speaker and star toggler */}
                      <div className="flex items-center justify-end gap-3 pr-1">
                        <button
                          onClick={(e) => handleSpeak(e, card.term + ". " + card.definition)}
                          className="h-9 w-9 rounded-full flex items-center justify-center transition-colors text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                          title="Đọc thẻ"
                        >
                          <Volume2 size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleMaster(card.id)}
                          className={`h-9 w-9 rounded-full transition-all flex items-center justify-center hover:bg-surface-container-low ${isMastered
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-on-surface-variant hover:text-yellow-500"
                            }`}
                          title={isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                        >
                          <Star size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 backdrop-blur-md shadow-[0_-4px_24px_rgba(14,18,30,0.04)] rounded-t-2xl border-t border-outline-variant/30">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors" to="/student">
          <span className="material-symbols-outlined"><Bell className="h-5 w-5" /></span>
          <span className="text-label-sm font-label-sm mt-1">Home</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 cursor-pointer" onClick={handleBack}>
          <span className="material-symbols-outlined"><Brain className="h-5 w-5" /></span>
          <span className="text-label-sm font-label-sm mt-1">Library</span>
        </button>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#analytics">
          <span className="material-symbols-outlined"><Brain className="h-5 w-5" /></span>
          <span className="text-label-sm font-label-sm mt-1">Progress</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#catalog">
          <span className="material-symbols-outlined"><Star className="h-5 w-5" /></span>
          <span className="text-label-sm font-label-sm mt-1">Catalog</span>
        </a>
      </nav>

    </div>
  );
}
