export const adminProfile = {
  name: "Quản trị viên",
  plan: "System Admin",
  avatarUrl:
    "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
};

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  users: "/admin",
  traffic: "/admin/traffic",
} as const;

export type AdminNavItem = {
  label: string;
  to: string;
  end?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Người dùng", to: ADMIN_ROUTES.users, end: true },
  { label: "Lưu lượng", to: ADMIN_ROUTES.traffic },
];
