import { useMutation } from "@tanstack/react-query";

import { getGoogleLoginUrl } from "../services/auth.service";

export function useGoogleLoginUrl() {
  return useMutation({
    mutationFn: () => getGoogleLoginUrl(),
  });
}
