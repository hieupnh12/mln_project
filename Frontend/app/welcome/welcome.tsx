import { useEffect, useMemo, useState } from "react";

type DashboardTab = "flashcard" | "chat" | "jlpt";
type Level = "N5" | "N4" | "N3" | "N2" | "N1";

type ChatMessage = {
  id: string;
  sender: "ai" | "user";
  text: string;
  romaji?: string;
  translation?: string;
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "courses", label: "Courses" },
  { id: "features", label: "Features" },
  { id: "pronunciation", label: "Speaking Match" },
  { id: "testimonials", label: "Testimonials" },
  { id: "about", label: "About" },
];

const courses: Array<{
  level: Level;
  title: string;
  lessons: number;
  weeks: number;
  description: string;
  points: string[];
}> = [
  {
    level: "N5",
    title: "Beginner Foundations",
    lessons: 45,
    weeks: 8,
    description:
      "Hiragana, Katakana, greetings, basic particles, and the first conversations you need for travel or self-study.",
    points: ["は vs が", "です / ます", "Question marker か", "Location particles"],
  },
  {
    level: "N4",
    title: "Daily Conversationalist",
    lessons: 60,
    weeks: 10,
    description:
      "Move beyond survival Japanese with potential forms, giving and receiving, and everyday casual dialogue.",
    points: ["Potential form", "ている patterns", "あげる / もらう", "Conditional たら"],
  },
  {
    level: "N3",
    title: "Bridge to Fluency",
    lessons: 75,
    weeks: 12,
    description:
      "Understand richer sentence structures, news-style passages, social nuance, and longer listening prompts.",
    points: ["Passive / causative", "はずだ", "Connectors", "Reading drills"],
  },
  {
    level: "N2",
    title: "Business Proficient",
    lessons: 90,
    weeks: 14,
    description:
      "Formal Japanese, dense reading, business scenarios, and advanced grammar for work or university life.",
    points: ["Keigo", "Formal emails", "Nuance shifts", "Mock interviews"],
  },
  {
    level: "N1",
    title: "Native-Level Polish",
    lessons: 110,
    weeks: 16,
    description:
      "Advanced prose, academic vocabulary, precise listening, and polished expression for high-stakes contexts.",
    points: ["Academic texts", "Idioms", "Classical phrases", "Presentation flow"],
  },
];

const flashcards = [
  {
    kanji: "桜",
    kana: "さくら",
    romaji: "sakura",
    english: "Cherry blossom",
    example: "春には桜が美しく咲きます。",
  },
  {
    kanji: "富士山",
    kana: "ふじさん",
    romaji: "fujisan",
    english: "Mount Fuji",
    example: "富士山は日本で一番高い山です。",
  },
  {
    kanji: "木漏れ日",
    kana: "こもれび",
    romaji: "komorebi",
    english: "Sunlight filtering through trees",
    example: "森の中で木漏れ日がきれいです。",
  },
];

const pronunciationPrompts = [
  {
    word: "こんにちは",
    romaji: "Konnichiwa",
    meaning: "Hello / Good afternoon",
    tip: "Keep the rhythm even and let the final は sound like wa.",
  },
  {
    word: "ありがとうございます",
    romaji: "Arigatou gozaimasu",
    meaning: "Thank you very much",
    tip: "Blend the long vowel in arigatou and keep gozaimasu light.",
  },
  {
    word: "一生懸命",
    romaji: "Isshoukenmei",
    meaning: "With all one's effort",
    tip: "Pause softly on the double consonant before shou.",
  },
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Expat in Tokyo",
    result: "Passed JLPT N3",
    quote:
      "The speaking drills made convenience-store and station conversations feel normal instead of scary.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  },
  {
    name: "Kenji Suzuki",
    role: "Software Engineer",
    result: "Passed JLPT N2",
    quote:
      "The flashcard review and mock exam flow exposed weak grammar points faster than my old notes.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
  },
  {
    name: "Amelie Laurent",
    role: "Language Enthusiast",
    result: "Passed JLPT N1",
    quote:
      "The course roadmap kept advanced reading, kanji, and listening practice in one calm routine.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
  },
];

const onboardingQuestions = [
  {
    id: "level",
    question: "What is your current Japanese level?",
    options: [
      { code: "new", label: "Complete beginner", level: "N5" },
      { code: "n5", label: "I know kana and simple phrases", level: "N5" },
      { code: "n3", label: "Intermediate grammar learner", level: "N3" },
      { code: "n1", label: "Advanced / business target", level: "N1" },
    ],
  },
  {
    id: "goal",
    question: "What do you want Japanese for?",
    options: [
      { code: "travel", label: "Travel and daily life" },
      { code: "culture", label: "Anime, manga, and culture" },
      { code: "career", label: "Career or study in Japan" },
      { code: "exam", label: "JLPT exam preparation" },
    ],
  },
  {
    id: "pace",
    question: "How much can you practice each day?",
    options: [
      { code: "casual", label: "10-15 minutes" },
      { code: "steady", label: "20-30 minutes" },
      { code: "intense", label: "45+ minutes" },
    ],
  },
] as const;

export function Welcome() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("flashcard");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(12);
  const [mastery, setMastery] = useState(64);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>("N5");
  const [pronounceIndex, setPronounceIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "done">("idle");
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [loginDone, setLoginDone] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "start",
      sender: "ai",
      text: "こんにちは！Ready for a tiny practice session?",
      romaji: "Konnichiwa!",
      translation: "Hello!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const activeCourse = useMemo(
    () => courses.find((course) => course.level === selectedLevel) ?? courses[0],
    [selectedLevel],
  );
  const currentCard = flashcards[flashcardIndex];
  const currentPrompt = pronunciationPrompts[pronounceIndex];
  const quizCorrect = quizChoice === 0;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (!element) continue;

        if (
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rateFlashcard = (quality: "hard" | "good" | "easy") => {
    setIsFlipped(false);
    setMastery((value) =>
      quality === "hard" ? Math.max(0, value - 2) : Math.min(100, value + (quality === "easy" ? 5 : 3)),
    );
    if (quality === "easy") setStreak((value) => value + 1);
    setTimeout(() => setFlashcardIndex((value) => (value + 1) % flashcards.length), 160);
  };

  const chooseChatPrompt = (kind: "intro" | "coffee" | "thanks") => {
    if (isTyping) return;

    const replies = {
      intro: {
        prompt: "How do I introduce myself?",
        text: "はじめまして。ミナです。ベトナムから来ました。",
        romaji: "Hajimemashite. Mina desu. Betonamu kara kimashita.",
        translation: "Nice to meet you. I am Mina. I came from Vietnam.",
      },
      coffee: {
        prompt: "How do I order coffee politely?",
        text: "すみません、ホットコーヒーを一つお願いします。",
        romaji: "Sumimasen, hotto koohii o hitotsu onegai shimasu.",
        translation: "Excuse me, one hot coffee please.",
      },
      thanks: {
        prompt: "A formal thank you phrase?",
        text: "誠にありがとうございます。",
        romaji: "Makoto ni arigatou gozaimasu.",
        translation: "Thank you very much indeed.",
      },
    };

    const reply = replies[kind];
    setChatMessages((messages) => [
      ...messages,
      { id: `user-${Date.now()}`, sender: "user", text: reply.prompt },
    ]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((messages) => [
        ...messages,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: reply.text,
          romaji: reply.romaji,
          translation: reply.translation,
        },
      ]);
    }, 850);
  };

  const simulateRecording = () => {
    if (recordingState === "recording") return;

    setRecordingState("recording");
    setPronunciationScore(null);
    setTimeout(() => {
      setPronunciationScore(Math.floor(Math.random() * 10) + 90);
      setRecordingState("done");
    }, 1500);
  };

  const answerOnboarding = (option: { code: string; label: string; level?: string }) => {
    if (option.level) setSelectedLevel(option.level as Level);
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep((step) => step + 1);
    } else {
      setShowRoadmap(true);
    }
  };

  const resetOnboarding = () => {
    setOnboardingOpen(false);
    setOnboardingStep(0);
    setShowRoadmap(false);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#172235]">
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 text-left"
          >
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[#ffb7c5] text-sm font-black text-white shadow-sm">
              <span className="absolute bottom-[-18px] h-9 w-9 rounded-full bg-[#172235]" />
              <span className="relative">N</span>
            </span>
            <span className="text-xl font-black tracking-tight">
              Nihongo<span className="text-[#df7890]">Go</span>
            </span>
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative py-2 text-sm font-semibold transition ${
                  activeSection === item.id ? "text-[#172235]" : "text-slate-500 hover:text-[#172235]"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#df7890]" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="rounded-lg px-4 py-2 text-sm font-bold text-[#172235] hover:bg-slate-100"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setOnboardingOpen(true)}
              className="rounded-lg bg-[#172235] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#253a58]"
            >
              Start Learning
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 md:hidden"
            aria-label="Toggle navigation"
          >
            <span className="text-xl leading-none">{mobileMenuOpen ? "×" : "☰"}</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginOpen(true);
                  }}
                  className="rounded-lg border border-slate-200 py-2 text-sm font-bold"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setOnboardingOpen(true);
                  }}
                  className="rounded-lg bg-[#172235] py-2 text-sm font-bold text-white"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="bg-grid-pattern scroll-mt-24 pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f1a7b7] bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#172235] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#df7890]" />
              Learn Japanese Smarter
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-[#172235] sm:text-5xl lg:text-6xl">
                Master Japanese from zero to JLPT confidence
              </h1>
              <p className="mx-auto max-w-xl text-base leading-8 text-slate-600 lg:mx-0">
                Interactive lessons, SRS flashcards, practical AI-style chat prompts, JLPT quizzes,
                and speaking practice packed into a polished frontend mock for VPS testing.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={() => setOnboardingOpen(true)}
                className="rounded-xl bg-[#172235] px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#253a58]"
              >
                Build My Roadmap
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-[#172235] shadow-sm transition hover:border-[#df7890]"
              >
                Explore Demo
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 text-left">
              {[
                ["12", "Day streak"],
                ["5", "JLPT tracks"],
                ["2.4k", "Demo learners"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-black text-[#172235]">{value}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
              {[
                { id: "flashcard", label: "Flashcard" },
                { id: "chat", label: "Sensei Chat" },
                { id: "jlpt", label: "JLPT Quiz" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDashboardTab(tab.id as DashboardTab)}
                  className={`rounded-lg px-4 py-2 text-xs font-black transition ${
                    dashboardTab === tab.id
                      ? "bg-[#172235] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-5 py-5 lg:grid-cols-[1fr_220px]">
              {dashboardTab === "flashcard" && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setIsFlipped((value) => !value)}
                    className="flashcard-surface min-h-[260px] w-full rounded-2xl border border-slate-200 bg-[#fff7f8] p-6 text-center transition hover:border-[#df7890]"
                  >
                    {!isFlipped ? (
                      <div className="flex h-full min-h-[210px] flex-col items-center justify-center">
                        <div className="text-7xl font-black text-[#172235]">{currentCard.kanji}</div>
                        <div className="mt-4 text-xl font-bold text-[#df7890]">{currentCard.kana}</div>
                        <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                          {currentCard.romaji}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[210px] flex-col items-center justify-center gap-4">
                        <div className="text-2xl font-black text-[#172235]">{currentCard.english}</div>
                        <p className="max-w-md text-sm leading-7 text-slate-600">{currentCard.example}</p>
                      </div>
                    )}
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    {(["hard", "good", "easy"] as const).map((quality) => (
                      <button
                        key={quality}
                        type="button"
                        onClick={() => rateFlashcard(quality)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black capitalize text-slate-700 transition hover:border-[#df7890]"
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {dashboardTab === "chat" && (
                <div className="space-y-4">
                  <div className="h-[300px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm ${
                            message.sender === "user"
                              ? "ml-auto bg-[#172235] text-white"
                              : "bg-white text-slate-700 shadow-sm"
                          }`}
                        >
                          <div className="font-bold">{message.text}</div>
                          {message.romaji && (
                            <div className="mt-2 text-xs text-slate-500">{message.romaji}</div>
                          )}
                          {message.translation && (
                            <div className="mt-1 text-xs text-slate-500">{message.translation}</div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="inline-flex rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-500 shadow-sm">
                          Aiko is typing...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => chooseChatPrompt("intro")}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
                    >
                      Intro
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseChatPrompt("coffee")}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
                    >
                      Coffee
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseChatPrompt("thanks")}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
                    >
                      Thanks
                    </button>
                  </div>
                </div>
              )}

              {dashboardTab === "jlpt" && (
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-[#df7890]">
                      N5 grammar check
                    </div>
                    <h3 className="mt-3 text-xl font-black text-[#172235]">
                      Choose the correct particle
                    </h3>
                    <p className="mt-3 rounded-xl bg-slate-50 p-4 text-lg font-bold">
                      私 ___ 学生です。
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["が", "を", "に", "で"].map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setQuizChoice(index)}
                        className={`rounded-xl border px-4 py-3 text-xl font-black transition ${
                          quizChoice === index
                            ? index === 0
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-rose-300 bg-rose-50 text-rose-700"
                            : "border-slate-200 bg-white text-[#172235] hover:border-[#df7890]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {quizChoice !== null && (
                    <div
                      className={`rounded-xl px-4 py-3 text-sm font-bold ${
                        quizCorrect
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {quizCorrect
                        ? "Correct. が marks the subject here."
                        : "Try again. The subject marker が fits this sentence."}
                    </div>
                  )}
                </div>
              )}

              <aside className="space-y-4 rounded-2xl bg-[#172235] p-5 text-white">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#ffb7c5]">
                    Daily profile
                  </div>
                  <div className="mt-3 text-3xl font-black">{streak} days</div>
                  <div className="text-sm text-slate-300">learning streak</div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold">
                    <span>Mastery</span>
                    <span>{mastery}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-[#ffb7c5] transition-all"
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-xs font-bold text-slate-300">Today</div>
                  <div className="mt-1 text-sm font-black">18 reviews, 2 quizzes, 1 speaking drill</div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-24 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            eyebrow="Course tracks"
            title="JLPT roadmap from N5 to N1"
            copy="Switch tracks to preview a learner dashboard, syllabus focus, and weekly pacing."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {courses.map((course) => (
              <button
                key={course.level}
                type="button"
                onClick={() => setSelectedLevel(course.level)}
                className={`rounded-lg px-5 py-2.5 text-sm font-black transition ${
                  selectedLevel === course.level
                    ? "bg-[#172235] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#df7890]"
                }`}
              >
                {course.level}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm font-black uppercase tracking-widest text-[#df7890]">
                NihongoGo {activeCourse.level}
              </div>
              <h3 className="mt-3 text-3xl font-black text-[#172235]">{activeCourse.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{activeCourse.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Metric value={activeCourse.lessons.toString()} label="Lessons" />
                <Metric value={`${activeCourse.weeks}`} label="Weeks" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeCourse.points.map((point, index) => (
                <div key={point} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f3] text-sm font-black text-[#df7890]">
                    {index + 1}
                  </div>
                  <div className="mt-4 text-lg font-black text-[#172235]">{point}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Short lessons, example sentences, review cards, and a checkpoint quiz.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 bg-[#f8fafc] py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            eyebrow="Feature set"
            title="Everything is clickable enough for a VPS smoke test"
            copy="This is frontend-only: state is local, forms are mocked, and no backend call is required."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["SRS flashcards", "Flip cards, rate recall quality, and watch mastery update instantly."],
              ["AI-style chat", "Choose prompt chips and simulate guided Japanese conversation replies."],
              ["JLPT quiz", "Answer particle questions with immediate correct/incorrect feedback."],
              ["Course dashboard", "Preview N5-N1 tracks with lesson counts and grammar focus."],
              ["Onboarding wizard", "Three-step consultant modal creates a recommended study path."],
              ["Login mock", "Form validation and success state without any backend dependency."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-lg font-black text-[#172235]">{title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pronunciation" className="scroll-mt-24 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeader
            eyebrow="Speaking match"
            title="Pronunciation coach sandbox"
            copy="Pick a phrase, simulate recording, and show a generated score for UI testing."
          />
          <div className="rounded-2xl border border-slate-200 bg-[#172235] p-6 text-white shadow-xl">
            <div className="flex flex-wrap gap-2">
              {pronunciationPrompts.map((prompt, index) => (
                <button
                  key={prompt.word}
                  type="button"
                  onClick={() => {
                    setPronounceIndex(index);
                    setRecordingState("idle");
                    setPronunciationScore(null);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-black ${
                    pronounceIndex === index ? "bg-[#ffb7c5] text-[#172235]" : "bg-white/10 text-white"
                  }`}
                >
                  {prompt.romaji}
                </button>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-white p-6 text-[#172235]">
              <div className="text-5xl font-black">{currentPrompt.word}</div>
              <div className="mt-2 text-lg font-bold text-[#df7890]">{currentPrompt.romaji}</div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{currentPrompt.tip}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={simulateRecording}
                  className="rounded-xl bg-[#172235] px-5 py-3 text-sm font-black text-white"
                >
                  {recordingState === "recording" ? "Listening..." : "Record Practice"}
                </button>
                <button
                  type="button"
                  onClick={() => alert(`${currentPrompt.word} - ${currentPrompt.meaning}`)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-[#172235]"
                >
                  Play Native Audio
                </button>
              </div>
              {pronunciationScore && (
                <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-black text-emerald-700">
                  Match score: {pronunciationScore}/100. Rhythm and vowel length look strong.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-24 bg-[#f8fafc] py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeader
            eyebrow="Learner results"
            title="Social proof cards with real image assets"
            copy="Avatar images are remote and can help verify image loading on the VPS."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-black text-[#172235]">{testimonial.name}</div>
                    <div className="text-xs font-bold text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mt-5 inline-flex rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-black text-[#b9546c]">
                  {testimonial.result}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">"{testimonial.quote}"</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Newsletter"
              title="Collect emails with a mock success state"
              copy="Useful for verifying form styling, submission behavior, and responsive layout."
            />
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (newsletterEmail.trim()) setNewsletterDone(true);
            }}
            className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5"
          >
            {newsletterDone ? (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm font-black text-emerald-700">
                Subscribed. Your free N5 kanji guide is queued in this mock UI.
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="learner@example.com"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#df7890]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#172235] px-5 py-3 text-sm font-black text-white"
                >
                  Get Kanji Guide
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-[#172235] py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-slate-300 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="text-lg font-black text-white">NihongoGo</div>
            <p className="mt-1">Frontend-only VPS test build.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {courses.map((course) => (
              <button
                key={course.level}
                type="button"
                onClick={() => {
                  setSelectedLevel(course.level);
                  scrollToSection("courses");
                }}
                className="font-bold hover:text-[#ffb7c5]"
              >
                {course.level}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {onboardingOpen && (
        <Modal onClose={resetOnboarding}>
          <div className="bg-[#172235] p-6 text-white">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-xl font-black">NihongoGo Study Consultant</h2>
                <p className="mt-1 text-sm text-slate-300">Build a personal roadmap in three clicks.</p>
              </div>
              <button type="button" onClick={resetOnboarding} className="text-2xl leading-none">
                ×
              </button>
            </div>
          </div>
          {!showRoadmap ? (
            <div className="space-y-6 p-6">
              <div className="flex gap-1">
                {onboardingQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`h-1.5 flex-1 rounded-full ${
                      index <= onboardingStep ? "bg-[#df7890]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Question {onboardingStep + 1} of {onboardingQuestions.length}
                </div>
                <h3 className="mt-3 text-xl font-black text-[#172235]">
                  {onboardingQuestions[onboardingStep].question}
                </h3>
              </div>
              <div className="space-y-3">
                {onboardingQuestions[onboardingStep].options.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => answerOnboarding(option)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left text-sm font-black text-[#172235] hover:border-[#df7890]"
                  >
                    {option.label}
                    <span>›</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 p-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff0f3] text-2xl font-black text-[#df7890]">
                {selectedLevel}
              </div>
              <h3 className="text-xl font-black text-[#172235]">Your roadmap is ready</h3>
              <div className="rounded-xl bg-slate-50 p-5 text-left text-sm leading-7 text-slate-600">
                Recommended track: <strong>NihongoGo {selectedLevel}</strong>. Start with
                daily flashcards, one grammar checkpoint, and one speaking match per session.
              </div>
              <button
                type="button"
                onClick={() => {
                  resetOnboarding();
                  scrollToSection("courses");
                }}
                className="w-full rounded-xl bg-[#172235] px-5 py-3 text-sm font-black text-white"
              >
                Open {selectedLevel} Dashboard
              </button>
            </div>
          )}
        </Modal>
      )}

      {loginOpen && (
        <Modal onClose={() => setLoginOpen(false)} narrow>
          <div className="bg-[#172235] p-6 text-white">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-xl font-black">Learner Gate</h2>
                <p className="mt-1 text-sm text-slate-300">Mock login for frontend testing.</p>
              </div>
              <button type="button" onClick={() => setLoginOpen(false)} className="text-2xl leading-none">
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            {loginDone ? (
              <div className="rounded-xl bg-emerald-50 p-5 text-center text-sm font-black text-emerald-700">
                Gate unlocked. Dashboard sync simulated.
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setLoginDone(true);
                  setTimeout(() => {
                    setLoginOpen(false);
                    setLoginDone(false);
                  }, 1100);
                }}
              >
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Learner email
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#df7890]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Password
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#df7890]"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#172235] px-5 py-3 text-sm font-black text-white"
                >
                  Log In To Dashboard
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-[#df7890]">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#172235] sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-7 text-slate-600">{copy}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="text-2xl font-black text-[#172235]">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}

function Modal({
  children,
  onClose,
  narrow = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  narrow?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#172235]/60 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close modal" />
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${
          narrow ? "max-w-md" : "max-w-xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
