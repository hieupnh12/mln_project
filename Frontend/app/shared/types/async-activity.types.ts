export type AsyncActivityStatus = "running" | "success" | "error";

export type AsyncActivityItem = {
  id: string;
  label: string;
  detail?: string;
  progress: number;
  indeterminate?: boolean;
  status: AsyncActivityStatus;
  createdAt: number;
};

export type StartAsyncActivityInput = {
  id?: string;
  label: string;
  detail?: string;
  indeterminate?: boolean;
  progress?: number;
};
