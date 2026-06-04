export const AUTH_COOKIE_KEYS = {
  accessToken: "mln_access_token",
  userRole: "mln_user_role",
  userId: "mln_user_id",
  userName: "mln_user_name",
  userEmail: "mln_user_email",
  userAvatarUrl: "mln_user_avatar_url",
} as const;

export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const AUTH_ROUTES = {
  login: "/login",
  unauthorized: "/",
} as const;
