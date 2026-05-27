export type ApiFieldErrors = Record<string, string | string[]>;

export type ApiErrorPayload = {
  message?: string;
  code?: string;
  errors?: ApiFieldErrors;
};

export type ApiClientErrorParams = {
  message: string;
  code?: string;
  status?: number;
  details?: ApiFieldErrors;
};

export type ApiEnvelope<TData> = {
  data: TData;
  message?: string;
};

export type ApiListResponse<TItem> = {
  data: TItem[];
  total: number;
  page: number;
  limit: number;
};
