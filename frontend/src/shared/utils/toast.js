// src/utils/toast.js
import { toast } from "sonner";

export const showToast = (message, options = {}) => {
  const { type = "default", custom = null, ...rest } = options;

  if (custom) {
    return toast.custom((t) => custom(t), rest);
  }

  const toastTypes = {
    success: () => toast.success(message, rest),
    error: () => toast.error(message, rest),
    loading: () => toast.loading(message, rest),
    warning: () => toast.warning(message, rest),
    default: () => toast(message, rest),
  };

  return toastTypes[type]();
};
