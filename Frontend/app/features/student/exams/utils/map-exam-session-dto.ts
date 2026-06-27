import { isPracticeMultiChoice } from "../../practice/utils/is-practice-multi-choice";
import type {
  StudentExamQuestionDto,
  StudentExamSessionDto,
} from "../types/exam-session-api.types";
import type { ExamQuestion, ExamSession } from "../types/exam-session.types";

function mapExamQuestionDto(dto: StudentExamQuestionDto): ExamQuestion {
  const isMultipleChoice =
    dto.multipleChoice ?? isPracticeMultiChoice(dto.type, []);

  return {
    id: dto.id,
    question: dto.question,
    type: dto.type,
    isMultipleChoice,
    options: dto.options.map((option) => ({ ...option })),
  };
}

export function mapExamSessionDto(dto: StudentExamSessionDto): ExamSession {
  return {
    quizId: dto.quizId,
    title: dto.title,
    courseTitle: dto.courseTitle,
    durationMinutes: dto.durationMinutes,
    passingScore: dto.passingScore,
    questionCount: dto.questionCount,
    questions: dto.questions.map(mapExamQuestionDto),
  };
}
