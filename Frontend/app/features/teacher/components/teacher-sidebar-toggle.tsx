import { MaterialIcon } from "./teacher-icons";

type TeacherSidebarToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function TeacherSidebarToggle({ collapsed, onToggle }: TeacherSidebarToggleProps) {
  return (
    <button
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant transition hover:bg-surface-container hover:text-primary active:scale-95"
      onClick={onToggle}
      type="button"
    >
      <MaterialIcon>{collapsed ? "left_panel_open" : "left_panel_close"}</MaterialIcon>
    </button>
  );
}
