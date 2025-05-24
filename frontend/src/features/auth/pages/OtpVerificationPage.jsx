import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { OtpVerification } from "../components/OtpVerification";

/**
 * OtpVerificationPage component.
 * This page serves as a wrapper for the `OtpVerification` component.
 * It retrieves `contactType`, `contactValue`, and `reset` status from the
 * `react-router` location state to configure the OTP input form.
 *
 * @component
 * @returns {JSX.Element} The rendered OTP verification page.
 * @example
 * // Typically navigated to with state:
 * // navigate("/otp-verification", { state: { contactType: "email", contactValue: "user@example.com", reset: false } });
 */
const OtpVerificationPage = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  const contactType = location.state?.contactType || "email";
  const reset = location.state?.reset || false;
  const contactValue =
    location.state?.contactValue ||
    (contactType === "email" ? "user456@example.com" : "+1234567890");

  /**
   * useEffect hook to set `mounted` state to true after component mounts.
   * This can be used to delay rendering of child components that might rely on browser APIs
   * or to trigger animations once the page is ready.
   * Here, it ensures `OtpVerification` component is rendered only client-side.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("mounted", location);

  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 50 }} // Start animation: fade in and slide up
        animate={{ opacity: 1, x: 0 }} // Animate to: fully visible and positioned
        exit={{ opacity: 0, y: -50 }} // Exit animation: fade out and slide up
        transition={{ duration: 0.5 }} // Animation duration
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        {mounted && (
          <OtpVerification
            contactType={contactType}
            contactValue={contactValue}
            reset={reset}
          />
        )}
      </Box>
    </AnimatePresence>
  );
};

export default OtpVerificationPage;
