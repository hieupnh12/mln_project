import { BookOpen, GraduationCap, LibraryBig, ShieldCheck } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type LoginFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const LOGIN_META = {
  title: "Đăng nhập | Mác - Lê Nin",
  description: "Đăng nhập Mác - Lê Nin để tiếp tục học tập, luyện quiz và khám phá tài liệu.",
} as const;

export const LOGIN_SUPPORT_LINKS = [
  { label: "Trợ giúp", href: "/" },
  { label: "Điều khoản dịch vụ", href: "/" },
  { label: "Bảo mật", href: "/" },
] as const;

export const LOGIN_FEATURES: LoginFeature[] = [
  {
    title: "Lộ trình học tập",
    description: "Theo dõi bài học, quiz và tài liệu trong một không gian rõ ràng.",
    icon: GraduationCap,
  },
  {
    title: "Kho tư liệu",
    description: "Truy cập nhanh học liệu, mốc lịch sử và nội dung ôn tập.",
    icon: LibraryBig,
  },
  {
    title: "Tài khoản an toàn",
    description: "Đăng nhập Google giúp đồng bộ phiên học và bảo vệ dữ liệu.",
    icon: ShieldCheck,
  },
];

export const LOGIN_PREVIEW_STATS = [
  { value: "3+", label: "bài học" },
  { value: "2+", label: "tài liệu" },
  { value: "100+", label: "câu hỏi quiz" },
] as const;

export const LOGIN_HERO_BADGES = ["Tri thức", "Lịch sử", "Cách mạng"] as const;

export const LOGIN_HERO_ASSET = {
  src: "/images/marx-lenin-hero-modern.webp",
  alt: "Không gian học tập hiện đại về Mác - Lê Nin",
} as const;

export const LOGIN_QUOTE = {
  text: "Đăng nhập để bước vào hệ thống học tập Mác - Lê Nin.",
  author: "M-L Learning Platform",
} as const;

export const LOGIN_FORM_FEATURES = [
  { icon: BookOpen, label: "Tài liệu học tập" },
  { icon: ShieldCheck, label: "Xác thực an toàn" },
] as const;
