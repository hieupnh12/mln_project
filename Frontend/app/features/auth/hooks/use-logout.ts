import { useCallback } from "react";
import { useNavigate } from "react-router";

import { showSuccessToast } from "~/shared/utils/toast";

import { logoutUser } from "../services/auth.service";

export function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    logoutUser();
    showSuccessToast("Đã đăng xuất khỏi M-L Master.");
    navigate("/", { replace: true });
  }, [navigate]);
}
