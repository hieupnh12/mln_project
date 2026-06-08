import { MaterialIcon } from "../../../components/teacher-icons";

type MaterialUploadProgressProps = {
  progress: number;
  showSuccess?: boolean;
};

export function MaterialUploadProgress({
  progress,
  showSuccess = false,
}: MaterialUploadProgressProps) {
  if (showSuccess) {
    return (
      <div className="flex items-center gap-xs text-secondary">
        <MaterialIcon className="text-[18px]">check_circle</MaterialIcon>
        <span className="text-label-sm font-medium">Thành công!</span>
      </div>
    );
  }

  return (
    <div className="space-y-xs">
      <div className="flex items-center justify-between">
        <span className="text-label-sm text-on-secondary-container">
          Đang tải: {Math.round(progress)}%
        </span>
        <MaterialIcon className="animate-spin text-[16px] text-secondary-container">sync</MaterialIcon>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-outline-variant/10">
        <div
          className="h-full bg-secondary-container transition-all duration-500"
          style={{ width: `${Math.max(4, progress)}%` }}
        />
      </div>
    </div>
  );
}
