import {
  Bot,
  BookOpenCheck,
  GalleryHorizontal,
  LibraryBig,
  Milestone,
  Network,
  ScrollText,
} from "lucide-react";

import type {
  FooterLinkGroup,
  LandingNavItem,
  LandingStatistic,
  LearningPreviewFeature,
  TimelineEvent,
} from "../types/landing.types";

export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { label: "Giới thiệu", href: "#introduction" },
  { label: "Dòng lịch sử", href: "#timeline" },
  { label: "Học tập", href: "#learning" },
  { label: "Bắt đầu", href: "#cta" },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    period: "1818-1883",
    title: "Karl Marx",
    description:
      "Đặt nền móng cho phương pháp luận duy vật biện chứng và phân tích khoa học về xã hội hiện đại.",
  },
  {
    period: "1820-1895",
    title: "Friedrich Engels",
    description:
      "Cùng Marx phát triển hệ thống lý luận, làm rõ vai trò của thực tiễn, lao động và lịch sử xã hội.",
  },
  {
    period: "1870-1924",
    title: "Vladimir I. Lenin",
    description:
      "Phát triển chủ nghĩa Marx trong bối cảnh thời đại mới, gắn lý luận với tổ chức và hành động cách mạng.",
  },
  {
    period: "1917",
    title: "Cách mạng tháng Mười",
    description:
      "Một mốc lịch sử lớn của thế kỷ XX, mở ra nhiều tranh luận học thuật về nhà nước, xã hội và con đường phát triển.",
  },
];

export const LEARNING_FEATURES: LearningPreviewFeature[] = [
  {
    title: "Quiz",
    description: "Ôn tập theo chủ đề, nhận biết lỗ hổng kiến thức và luyện phản xạ trước kỳ kiểm tra.",
    icon: BookOpenCheck,
  },
  {
    title: "AI chatbot",
    description: "Đặt câu hỏi, gợi mở khái niệm và nhận giải thích theo ngữ cảnh học tập.",
    icon: Bot,
  },
  {
    title: "Learning materials",
    description: "Tài liệu được tổ chức theo học phần, khái niệm, nhân vật và sự kiện trọng tâm.",
    icon: LibraryBig,
  },
  {
    title: "Interactive timeline",
    description: "Theo dõi các mốc phát triển tư tưởng qua một dòng thời gian trực quan.",
    icon: Milestone,
  },
  {
    title: "Historical gallery",
    description: "Không gian hình ảnh tư liệu giúp việc học có thêm bối cảnh lịch sử.",
    icon: GalleryHorizontal,
  },
  {
    title: "Knowledge graph",
    description: "Liên kết khái niệm, bài học và sự kiện để người học nhìn thấy cấu trúc tri thức.",
    icon: Network,
  },
];

export const LANDING_STATISTICS: LandingStatistic[] = [
  { label: "Bài học định hướng", value: 2, suffix: "+" },
  { label: "Tài liệu học tập", value: 3, suffix: "+" },
  { label: "Câu hỏi quiz", value: 100, suffix: "+" },
];

export const QUOTE = {
  text: "Các nhà triết học đã chỉ giải thích thế giới bằng nhiều cách khác nhau, song vấn đề là cải tạo thế giới.",
  author: "Karl Marx",
  source: "Luận cương về Feuerbach",
};

export const FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    title: "Dự án",
    links: [
      { label: "Giới thiệu", href: "#introduction" },
      { label: "Tính năng học tập", href: "#learning" },
      { label: "Dòng lịch sử", href: "#timeline" },
    ],
  },
  {
    title: "Hệ thống",
    links: [
      { label: "Đăng nhập", href: "/login" },
      { label: "Sinh viên", href: "/student" },
      { label: "Giảng viên", href: "/teacher/dashboard" },
    ],
  },
  {
    title: "Kết nối",
    links: [
      { label: "Facebook", href: "https://www.facebook.com" },
      { label: "YouTube", href: "https://www.youtube.com" },
      { label: "Email", href: "mailto:contact@mln-master.edu.vn" },
    ],
  },
];

export const INTRO_POINTS = [
  "Hệ thống hóa kiến thức chủ nghĩa Mác - Lê Nin theo hướng dễ học, dễ ôn tập.",
  "Kết nối lý luận với bối cảnh lịch sử, nhân vật, sự kiện và câu hỏi kiểm tra.",
  "Tạo một cổng vào nghiêm túc cho sinh viên trước khi bước vào hệ thống học tập chính.",
] as const;

export const SECTION_EYEBROW_ICON = ScrollText;
