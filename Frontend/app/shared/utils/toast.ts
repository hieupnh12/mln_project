import { toast, type ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function showSuccessToast(message: string) {
  toast.success(message, baseOptions);
}

export function showErrorToast(message: string) {
  toast.error(message, baseOptions);
}

export function showInfoToast(message: string) {
  toast.info(message, baseOptions);
}
