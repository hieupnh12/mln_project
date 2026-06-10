import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type ExamEmptyStateProps = {
  icon: string;
  title: string;
  description: string;
};

export function ExamEmptyState({ icon, title, description }: ExamEmptyStateProps) {
  return (
    <div className="box-border w-full min-w-0 rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-lg shadow-landing-text/5">
      <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-red/10 text-landing-red"
        >
          <MaterialIcon size="md">{icon}</MaterialIcon>
        </div>
        <div className="text-left">
          <p className="text-base font-semibold leading-snug text-landing-text">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-landing-text-soft">{description}</p>
        </div>
      </div>
    </div>
  );
}
