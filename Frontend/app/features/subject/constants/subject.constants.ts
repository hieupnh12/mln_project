export const SUBJECT_ENDPOINTS = {
  all: "/subjects/all",
  byId: (id: number) => `/subjects/${id}`,
} as const;

export const SUBJECT_QUERY_KEYS = {
  all: ["subjects"] as const,
  detail: (id: number) => ["subjects", id] as const,
} as const;
