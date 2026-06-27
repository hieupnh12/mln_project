import ExcelJS from "exceljs";

const INPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C1.xlsx";
const OUTPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C1.xlsx";
const PROJECT_COPY = "D:/HocKy8/MLN111/MLNProject/docs/mau-import-cau-hoi-MLN111_SU26_C1.xlsx";

const CHAPTER_KL = "KHÁI LUẬN VỀ TRIẾT HỌC  VÀ TRIẾT HỌC MÁC - LÊNIN";
const CHAPTER_CNDVBC = "CHỦ NGHĨA DUY VẬT BIỆN CHỨNG";
const CHAPTER_CNDVLS = "CHỦ NGHĨA DUY VẬT LỊCH SỬ";

/** Explicit mapping by question order in ĐỀ MLN111_SU26_C1.docx */
const QUESTION_LESSON_MAP = [
  { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" },
  { chapter: CHAPTER_KL, lesson: "I.2. Vấn Đề Cơ Bản Của Triết Học" },
  { chapter: CHAPTER_KL, lesson: "I.3. Biện chứng và siêu hình" },
  { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" },
  { chapter: CHAPTER_KL, lesson: "II.1. Sự ra đời và phát triển của triết học Mác - Lênin" },
  { chapter: CHAPTER_KL, lesson: "II.2. Đối tượng và chức năng của triết học Mác - Lênin" },
  { chapter: CHAPTER_KL, lesson: "I.3. Biện chứng và siêu hình" },
  { chapter: CHAPTER_KL, lesson: "II.2. Đối tượng và chức năng của triết học Mác - Lênin" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.1. Hai loại hình biện chứng và phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_KL, lesson: "I.2. Vấn Đề Cơ Bản Của Triết Học" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.2. Nguồn gốc, bản chất và kết cấu của ý thức" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.3. Biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng của xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.4. Sự phát triển các hình thái kinh tế - xã hội là một quá trình lịch sử - tự nhiên" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.4. Sự phát triển các hình thái kinh tế - xã hội là một quá trình lịch sử - tự nhiên" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.4. Sự phát triển các hình thái kinh tế - xã hội là một quá trình lịch sử - tự nhiên" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.2. Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.2. Dân tộc" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.1. Giai cấp và đấu tranh giai cấp" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.2. Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.1. Nhà nước" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.2. Cách mạng xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.4. Sự phát triển các hình thái kinh tế - xã hội là một quá trình lịch sử - tự nhiên" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.1. Nhà nước" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.1. Nhà nước" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.1. Khái niệm tồn tại xã hội và các yếu tố cơ bản của tồn tại xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.2. Nguồn gốc, bản chất và kết cấu của ý thức" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_KL, lesson: "II.2. Đối tượng và chức năng của triết học Mác - Lênin" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.2. Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất" },
];

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT_PATH);

  const worksheet = workbook.getWorksheet("Cau hoi");
  if (!worksheet) {
    throw new Error('Không tìm thấy sheet "Cau hoi".');
  }

  const dataRowCount = worksheet.rowCount - 1;
  if (dataRowCount !== QUESTION_LESSON_MAP.length) {
    throw new Error(
      `Số câu hỏi (${dataRowCount}) không khớp mapping (${QUESTION_LESSON_MAP.length}).`,
    );
  }

  const summary = {};

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const mapping = QUESTION_LESSON_MAP[rowNumber - 2];
    const row = worksheet.getRow(rowNumber);

    row.getCell(2).value = mapping.chapter;
    row.getCell(3).value = mapping.lesson;

    const key = `${mapping.chapter} :: ${mapping.lesson}`;
    summary[key] = (summary[key] ?? 0) + 1;
  }

  await workbook.xlsx.writeFile(OUTPUT_PATH);
  await workbook.xlsx.writeFile(PROJECT_COPY);

  console.log(`Đã cập nhật ${dataRowCount} câu hỏi.`);
  console.log(`File: ${OUTPUT_PATH}`);
  console.log("Phân bổ bài học:");
  Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, count]) => console.log(`  ${count} câu | ${key}`));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
