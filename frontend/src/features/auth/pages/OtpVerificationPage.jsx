import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { OtpVerification } from "../components/otpVerification/OtpVerification";

const OtpVerificationPage = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  const contactType = location.state?.contactType || "email";
  const reset = location.state?.reset || false;
  const contactValue =
    location.state?.contactValue ||
    (contactType === "email" ? "user456@example.com" : "+1234567890");

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
