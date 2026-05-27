import { useMutation } from "@tanstack/react-query";

import { getGoogleLoginUrl } from "../services/auth.service";
import type { UserRole } from "../types/auth.types";

export function useGoogleLoginUrl() {
  return useMutation({
    mutationFn: (role: UserRole) => getGoogleLoginUrl(role),
  });
}
