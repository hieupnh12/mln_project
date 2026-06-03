import { useNavigate } from "react-router";

import { clearAuthSession } from "../../../shared/services/auth-session.service";
import { showSuccessToast } from "../../../shared/utils/toast";

export function useLogout() {
  const navigate = useNavigate();

  return function logout() {
    clearAuthSession();
    showSuccessToast("Đăng xuất thành công");
    navigate("/login");
  };
}
