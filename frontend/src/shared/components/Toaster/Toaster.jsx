// src/components/Toaster.jsx
import { Toaster } from "sonner";
import { useIsDarkTheme } from "../../store/themeStore";

export const NotificationToaster = () => {
  const isDarkTheme = useIsDarkTheme();
  return (
    <Toaster
      theme={isDarkTheme ? "dark" : "light"}
      position="top-right"
      richColors
      visibleToasts={3}
      expand={false}
      closeButton
      offset="16px"
      toastOptions={{
        classNames: {
          toast: "!font-poppins !shadow-lg !rounded-lg",
          title: "!text-base",
        },
      }}
    />
  );
};
