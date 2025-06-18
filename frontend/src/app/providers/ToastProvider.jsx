// ToastProvider.jsx
import { Toaster } from "sonner";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material";
import { DEFAULT_TOAST_CONFIG } from "../../shared/constants/constants";

const ToastProvider = ({ children, config = DEFAULT_TOAST_CONFIG }) => {
  const theme = useTheme();
  const toasterTheme = theme.palette.mode === "dark" ? "dark" : "light";

  return (
    <>
      <Toaster
        theme={toasterTheme}
        position={config.position || "top-right"}
        richColors={config.richColors || true}
        closeButton={config.closeButton || true}
        expand={config.expand || false}
        visibleToasts={config.visibleToasts || 3}
        duration={config.duration || 5000}
        gap={config.gap || 16}
        offset="16px"
        toastOptions={{
          style: { padding: 0 },
          className: "custom-toast !font-poppins !shadow-lg !rounded-lg",
          classNames: {
            title: "!text-base",
            description: "!text-sm",
          },
        }}
      />
      {children}
    </>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    position: PropTypes.oneOf([
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ]),
    richColors: PropTypes.bool,
    closeButton: PropTypes.bool,
    expand: PropTypes.bool,
    visibleToasts: PropTypes.number,
    duration: PropTypes.number,
    gap: PropTypes.number,
  }),
};

export default ToastProvider;
