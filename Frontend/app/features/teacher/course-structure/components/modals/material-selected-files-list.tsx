import { MaterialIcon } from "../../../components/teacher-icons";

const MAX_VISIBLE_FILE_COUNT = 6;

type MaterialSelectedFilesListProps = {
  files: File[];
};

export function MaterialSelectedFilesList({ files }: MaterialSelectedFilesListProps) {
  if (files.length === 0) {
    return null;
  }

  if (files.length > MAX_VISIBLE_FILE_COUNT) {
    return (
      <p className="text-label-sm font-medium text-on-secondary-container">
        Đã chọn {files.length} file
      </p>
    );
  }

  return (
    <ul className="space-y-xs">
      {files.map((file) => (
        <li
          className="flex items-center gap-sm rounded-lg bg-surface-container-low px-sm py-xs"
          key={`${file.name}-${file.size}-${file.lastModified}`}
        >
          <MaterialIcon className="text-[18px] text-secondary">description</MaterialIcon>
          <span className="min-w-0 flex-1 truncate text-label-sm text-on-surface">{file.name}</span>
        </li>
      ))}
    </ul>
  );
}
