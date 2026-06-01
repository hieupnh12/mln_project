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
      <div className="flex flex-col gap-4 rounded-r-xl border-l-4 border-secondary-container bg-primary-container p-6 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-secondary-container">
          <MaterialIcon filled>auto_awesome</MaterialIcon>
          <span className="text-label-md tracking-wider uppercase">Giải thích đáp án đúng</span>
        </div>
        <p className="text-body-md leading-relaxed text-inverse-on-surface/90">{explanation}</p>
      </div>
    </section>
  );
}
