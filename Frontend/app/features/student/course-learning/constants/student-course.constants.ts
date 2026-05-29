import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type {
  LearningTab,
  StudentCourseChapter,
  StudentFlashcard,
  StudentNavItem,
  StudentTest,
} from "../../types/student.types";

export const studentCourseProfile = {
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBmgAhUdjynIgoYXjFQKl6-QVgquMDt6-XNmSn5I-pchog6m0f7d2qIeDCmq14SAIXIDE9hu4GL3BZca0xuDBQevwNkMR6a86kLQ_Fve6xOglFT_jXZWd0r1zPy3y8RFzJBLw27WqRBirNueH7xS_Qv1OTsJ5JzMftijJiyYUAUvIRtnK9vEcMPiQJHwlgArKajFsvIK5j-2f1mWtpLc48CsWtJV7_LqZoXrL69fLWjLWHWKNp85Voh2YOUJ6YpR-2EWlRnOv1wyIXB",
};

export const studentCourseDetail = {
  title: "Triết học Mác - Lênin",
  lecturer: "PGS.TS Nguyễn Văn A",
  progress: 45,
  slide: 12,
  totalSlides: 48,
  slideImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxBPVzl67z0sMbGwy9tBS846reWCygsE4qhPy7omCCCjXEjhddKS3OZcMJz4wuRDaAqRIrxLLAsUFzB6QNvX4WugVi9lGJhX0bwUhElGNuVtHgoTaW0pM17mG-U8bvu5mKK5NzRX-SldPtZIa8kFotnCcR0ydua6TzRrbVU7oUELGXvZwKGt2z1Tg3g_N5b3545IZ5NUld0otwX7pUNv-wo67CL7LjRPkX82rZt5VtCN_N_9oAfBtRbbPeIBr62C8xKE1urXrvfr5z",
};

export const studentCourseTabs: Array<{ id: LearningTab; label: string }> = [
  { id: "lectures", label: "Bài giảng" },
  { id: "flashcards", label: "Flashcard" },
  { id: "tests", label: "Kiểm tra" },
];

export const studentCourseChapters: StudentCourseChapter[] = [
  {
    number: "Chương 1",
    title: "Khái lược về Triết học và Triết học Mác - Lênin",
    state: "done",
  },
  {
    number: "Chương 2",
    title: "Chủ nghĩa duy vật biện chứng",
    state: "active",
  },
  {
    number: "Chương 3",
    title: "Phép biện chứng duy vật",
    state: "open",
  },
  {
    number: "Chương 4",
    title: "Học thuyết giá trị thặng dư",
    state: "locked",
  },
  {
    number: "Chương 5",
    title: "Chủ nghĩa duy vật lịch sử",
    state: "locked",
  },
];

export const studentCourseFlashcards: StudentFlashcard[] = [
  {
    front: "Vấn đề cơ bản của triết học là gì?",
    back: "Quan hệ giữa vật chất và ý thức, gồm mặt bản thể luận và nhận thức luận.",
  },
  {
    front: "Chủ nghĩa duy vật biện chứng nhấn mạnh điều gì?",
    back: "Thế giới vật chất tồn tại khách quan và vận động theo các quy luật phổ biến.",
  },
  {
    front: "Vai trò của thực tiễn trong nhận thức?",
    back: "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  },
];

export const studentCourseTests: StudentTest[] = [
  { title: "Kiểm tra nhanh Chương 1", questions: 10, duration: "12 phút" },
  { title: "Luyện tập Chương 2", questions: 15, duration: "18 phút" },
  { title: "Đề tổng hợp giữa kỳ", questions: 30, duration: "45 phút" },
];

export const studentCourseBottomNavItems: StudentNavItem[] = [
  { label: "Home", icon: "home", href: STUDENT_ROUTES.dashboard },
  { label: "Library", icon: "menu_book", active: true, href: "#" },
  { label: "Progress", icon: "query_stats", href: `${STUDENT_ROUTES.dashboard}#analytics` },
  { label: "Profile", icon: "person", href: "#" },
];
