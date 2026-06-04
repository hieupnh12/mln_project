import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type PracticeExplanationPanelProps = {
  explanation: string;
  visible: boolean;
};

export function PracticeExplanationPanel({ explanation, visible }: PracticeExplanationPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="animate-in fade-in zoom-in-95 duration-300">
      <div className="rounded-xl border border-secondary-container/40 bg-primary-container p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 font-bold text-secondary-container">
          <MaterialIcon filled className="text-[18px]">auto_awesome</MaterialIcon>
          <span className="text-label-sm uppercase">Giải thích đáp án đúng</span>
        </div>
        <p className="max-h-28 overflow-y-auto pr-1 text-body-sm leading-relaxed text-inverse-on-surface/90 md:max-h-36">
          {explanation || "Chưa có giải thích cho câu hỏi này."}
        </p>
      </div>
    </section>
  );
}
