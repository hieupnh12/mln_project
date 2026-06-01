import type { MindmapNode } from "../types/mindmap.types";

export const mindmapNodes: MindmapNode[] = [
  {
    title: "Triết học Mác - Lênin",
    description: "Khung kiến thức trung tâm của học phần.",
    children: ["Vật chất & ý thức", "Phép biện chứng", "Nhận thức luận"],
  },
  {
    title: "Vật chất & ý thức",
    description: "Mối quan hệ nền tảng trong vấn đề cơ bản của triết học.",
    children: ["Tính thứ nhất", "Sự phản ánh", "Vai trò thực tiễn"],
  },
  {
    title: "Phép biện chứng",
    description: "Các nguyên lý, quy luật và cặp phạm trù phổ biến.",
    children: ["Mâu thuẫn", "Lượng - chất", "Phủ định"],
  },
];
