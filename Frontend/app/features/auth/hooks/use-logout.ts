import { useCallback } from "react";
import { useNavigate } from "react-router";

import { logoutUser } from "../services/auth.service";

export function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    logoutUser();
    navigate("/", { replace: true });
  }, [navigate]);
}
