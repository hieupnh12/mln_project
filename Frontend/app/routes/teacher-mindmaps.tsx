import { MindmapPage } from "../features/teacher/mindmap/pages/mindmap-page";

export function meta() {
  return [
    { title: "Mindmap | M-L Master" },
    {
      name: "description",
      content: "Thiết kế sơ đồ tư duy cho học phần.",
    },
  ];
}

export default function TeacherMindmapsRoute() {
  return <MindmapPage />;
}
