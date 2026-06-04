export function formatExamDuration(minutes: number) {
  if (minutes <= 0) {
    return "Không giới hạn";
  }
  return `${minutes} phút`;
}
