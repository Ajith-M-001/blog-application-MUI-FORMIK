import { toast } from "sonner";
import { NotificationToast } from "../components/NotificationToast";

class ToastService {
  constructor() {
    this.defaultOptions = {
      duration: 5000,
      position: "top-right",
    };
  }
  show(message, options = {}) {
    return toast(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  success(message, options = {}) {
    return toast.success(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  error(message, options = {}) {
    return toast.error(message, { ...this.defaultOptions, ...options });
  }

  warning(message, options = {}) {
    return toast.warning(message, { ...this.defaultOptions, ...options });
  }

  info(message, options = {}) {
    return toast.info(message, { ...this.defaultOptions, ...options });
  }

  loading(message, options = {}) {
    return toast.loading(message, { ...this.defaultOptions, ...options });
  }

  promise(promise, messages, options = {}) {
    return toast.promise(promise, messages, {
      ...this.defaultOptions,
      ...options,
    });
  }

  custom(component, options = {}) {
    return toast.custom(component, { ...this.defaultOptions, ...options });
  }

  notification(notificationData, options = {}) {
    const component = (t) => (
      <NotificationToast
        toastId={t}
        notification={notificationData}
        onView={options.onView}
        onDismiss={options.onDismiss}
      />
    );
    return toast.custom(component, {
      ...this.defaultOptions,
      duration: 10000,
      ...options,
    });
  }

  dismiss(toastId) {
    return toast.dismiss(toastId);
  }
  dismissAll() {
    return toast.dismiss();
  }
  showMessage(title, description, options = {}) {
    return toast.message(title, {
      description,
      ...this.defaultOptions,
      ...options,
    });
  }
}

export const toastService = new ToastService();
