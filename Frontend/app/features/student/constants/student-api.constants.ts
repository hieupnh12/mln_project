export const SUBJECT_ENDPOINTS = {
  all: "/subjects/all",
  byId: (id: number) => `/subjects/${id}`,
} as const;

export const SUBJECT_QUERY_KEYS = {
  root: ["student", "subjects"] as const,
  all: ["student", "subjects", "list"] as const,
  detail: (id: number) => ["student", "subjects", id] as const,
} as const;
