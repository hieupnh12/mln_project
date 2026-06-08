import { showErrorToast } from "~/shared/utils/toast";

import { useGoogleLoginUrl } from "./use-google-login-url";

export function useLoginPageActions() {
  const googleLoginMutation = useGoogleLoginUrl();

  const loginWithGoogle = () => {
    googleLoginMutation.mutate(undefined, {
      onSuccess: (response) => {
        if (!response.redirectUrl) {
          showErrorToast("Không thể tạo liên kết đăng nhập Google. Vui lòng thử lại.");
          return;
        }

        window.location.href = response.redirectUrl;
      },
      onError: () => {
        showErrorToast("Đăng nhập Google chưa sẵn sàng. Vui lòng thử lại sau.");
      },
    });
  };

  return {
    isGoogleLoginLoading: googleLoginMutation.isPending,
    loginWithGoogle,
  };
}
