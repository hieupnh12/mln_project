import type { ImportFieldMapping, ImportPreviewRow } from "../types/import-batch.types";

export const importPreviewRows: ImportPreviewRow[] = [
  {
    id: "row-1",
    content: "Chủ nghĩa duy vật biện chứng nghiên cứu đối tượng nào?",
    type: "mcq",
    typeLabel: "Trắc nghiệm",
    difficulty: "Cơ bản",
    tags: "Triết học, MLN",
  },
  {
    id: "row-2",
    content: "Vai trò của lực lượng sản xuất trong phát triển xã hội?",
    type: "essay",
    typeLabel: "Tự luận",
    difficulty: "Vận dụng",
    tags: "Kinh tế chính trị",
  },
  {
    id: "row-3",
    content: "Quy luật lượng - chất chỉ áp dụng trong tự nhiên.",
    type: "truefalse",
    typeLabel: "Đúng/Sai",
    difficulty: "Nâng cao",
    tags: "Phép biện chứng",
  },
  {
    id: "row-4",
    content: "Khái niệm thực tiễn trong triết học Mác - Lênin là gì?",
    type: "short",
    typeLabel: "Điền khuyết",
    difficulty: "Cơ bản",
    tags: "Nhận thức luận",
  },
  {
    id: "row-5",
    content: "Phân tích mối quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng.",
    type: "essay",
    typeLabel: "Tự luận",
    difficulty: "Nâng cao",
    tags: "CĐVHL, Phân tích",
  },
];

export const defaultImportFieldMappings: ImportFieldMapping[] = [
  {
    id: "question",
    systemLabel: "Nội dung câu hỏi",
    selectedColumn: "content",
    options: ["content", "text", "Nhập thủ công"],
  },
  {
    id: "category",
    systemLabel: "Phân loại / Môn",
    selectedColumn: "subject",
    options: ["tags", "labels", "subject"],
  },
  {
    id: "level",
    systemLabel: "Độ khó",
    selectedColumn: "diff",
    options: ["diff", "Mặc định: Vận dụng"],
  },
];

export const importCollaborators = [
  {
    name: "Collaborator 1",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDn0e2xFpCTRQipAxEqbalUCcb1COYkZDeHXu6co_2Nuf9P_Wh8Kk8HSZgJQBH97AFBFOKhGCF-FZlD47Bp__fhOpBjUzp3R4TB6QdK_k-jNj-T7msRKbHSvDP2mveczMLWafVdu5IuWrif4sxHWQ9FbaNAvw4aMD12Zj5386ZHs8WHPem8flQmQuzEQ7w80XbOV232DkZl9f-BwYRa_JdqrCEMLmN8PRXIBZBf0M3ozeUCnrcgb2lndlrAgj8YJUKjeRyGQQVutsc",
  },
  {
    name: "Collaborator 2",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQb8ci-BpHumwCdn2Ze2X5j5L9_hYGgg5FzCNz7PkYhX65wJaUaML3-WHMT4eZgm38EkjD0YIfwcGvtpJqxaZDVxXk8MJlpxO_aTqdzR70eimsTTuPxt-AmSCUlvqBS1g8PH3eT0AuGlj3eM2pbQe4K3QgkDx5SFlEOtSHU6gAkSYoQLhXyLRCJ7rHdTxlWTuwxzKWWxiN_bNvSutHIGWU07nZcUBu98lqrumB-if613hTczSN3NWKnlVNwEgk4B7jnXTFnHo97w8",
  },
];

export const IMPORT_SUCCESS_COUNT = 42;
