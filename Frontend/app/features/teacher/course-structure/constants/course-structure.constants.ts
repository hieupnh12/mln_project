import type { Chapter } from "../types/course-structure.types";

export const chapters: Chapter[] = [
  {
    id: "chapter-1",
    order: "01",
    title: "Khái lược về Triết học Mác - Lênin",
    summary: "4 bài học - 120 phút tổng cộng",
    lessons: [
      {
        title: "1.1 Tổng quan về triết học và thế giới quan",
        icon: "play_circle",
      },
      {
        title: "1.2 Vấn đề cơ bản của triết học",
        icon: "description",
      },
      {
        title: "1.3 Vai trò của triết học trong đời sống",
        icon: "article",
      },
    ],
  },
  {
    id: "chapter-2",
    order: "02",
    title: "Chủ nghĩa duy vật biện chứng",
    summary: "6 bài học - 180 phút tổng cộng",
    lessons: [],
  },
  {
    id: "chapter-3",
    order: "03",
    title: "Phép biện chứng duy vật",
    summary: "5 bài học - 150 phút tổng cộng",
    lessons: [],
  },
];

export const teacherVisualCards = [
  {
    label: "Phân tích",
    title: "Thống kê học tập",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCv-a1XZpQZz5Fhp6wbtr-ZG-eO5pdB_HOI5vLDxxKOEBAQ8KxPOHER4veYJRU78Q6aR1whvtmjoiwkP1w-2-P3WWaY6nA6idyXYmAp4jf0UnW9R6XnstUQSRK75zaxdqnAnA_C6MqHFuyEUAGFXQCpMXu3EFl-Qy4aGNA3oiVbvDV_0iH-XKNwX9rTMp-R8U4s9ZnMYzJJn_WjpEV0p2qaimVsP62UUr81IDwt8ajz3EjlFpGeb8U6HxdaVCsHmTjz-KsT41yINtIj",
  },
  {
    label: "Cộng đồng",
    title: "Thảo luận lớp học",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLdAYqdr63ac7QjvUBeIbCCzw7ABnGWW0Ldp0UAnX5NEDUN0oONBxG8WEpcUrdganRLpg4njl91UIelNvZrH5YCkxKuyiWRCLpDIt7UfuRzKi7gn_bv0xVr_20vMEJYwVSeIbUhaI8WCw2Pc0cWdslQGIb10QZqwrFAnkMpP-pKjYCp22lw5i87sSEgDYUMjHJ8XjkERGBg3-sWCDt_UhABUMWqBAkNEvQJi4xaSPO0uk6sS5la7rRBFxwKD43kfYEPgve7Ucau1fe",
  },
];
