import { useMemo } from "react";

import { getAuthSession } from "~/shared/services/auth-session.service";
import type { AuthSessionUser } from "~/shared/types/auth-session.types";

export type AuthUserViewModel = Required<Pick<AuthSessionUser, "name">> &
  Pick<AuthSessionUser, "email" | "avatarUrl">;

type UseAuthUserOptions = {
  fallbackName?: string;
};

const DEFAULT_USER_NAME = "học viên";

export function useAuthUser(options: UseAuthUserOptions = {}): AuthUserViewModel {
  return useMemo(() => {
    const session = getAuthSession();
    const fallbackName = options.fallbackName ?? DEFAULT_USER_NAME;

    return {
      ...session?.user,
      name: session?.user?.name ?? fallbackName,
    };
  }, [options.fallbackName]);
}
