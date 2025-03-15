import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { OtpVerification } from "../components/otpVerification/OtpVerification";
import { AnimatePresence } from "motion/react";

const OtpVerificationPage = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  const contactType = location.state?.contactType || "email";
  const contactValue =
    location.state?.contactValue ||
    (contactType === "email" ? "user456@example.com" : "+1234567890");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AnimatePresence>
      <Box
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
          />
        )}
      </Box>
    </AnimatePresence>
  );
};

export default OtpVerificationPage;
