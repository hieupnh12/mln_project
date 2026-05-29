export type PdfDocument = {
  id: string;
  title: string;
  chapter: string;
  size: string;
  status: "Đã xuất bản" | "Bản nháp" | "Cần duyệt";
};
