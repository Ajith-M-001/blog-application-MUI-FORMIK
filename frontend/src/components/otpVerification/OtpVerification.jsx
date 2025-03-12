import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const OtpVerification = ({
  contactType,
  contactValue,
  onVerificationComplete,
}) => {
  const [error, setError] = useState("hello world");

  // Mask the contact value (email or phone)
  const maskedContact = () => {
    if (contactType === "email") {
      const [username, domain] = contactValue.split("@");
      if (!username || !domain) return contactValue;
      return `${username.substring(0, 2)}${"*".repeat(
        username.length - 2
      )}@${domain}`;
    } else {
      // For phone numbers
      return `${contactValue.substring(0, 2)}${"*".repeat(
        contactValue.length - 4
      )}${contactValue.substring(contactValue.length - 2)}`;
    }
  };

  const handleSubmit = () => {
    console.log("form submitted");
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.array()
      .of(
        Yup.string()
          .matches(/^\d{1}$/, "Must be a digit")
          .required("Required")
      )
      .length(6, "Must enter all digits"),
  });
  return (
    <Box
      sx={{
        // backgroundColor: "red",
        maxWidth: 450,
        mx: "auto",
        p: 2,
      }}
    >
      <Stack
        sx={{
          spacing: 2,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Verify Your Account
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" py={1}>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.Secondary",
            }}
          >
            Enter the 6-digit code we sent to your{" "}
            <Typography component="span" sx={{ fontWeight: "medium" }}>
              {contactType}
            </Typography>
            : {maskedContact()}
          </Typography>
        </Stack>
        <Formik
          initialValues={{ otp: Array(6).fill("") }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        ></Formik>
      </Stack>
    </Box>
  );
};

export { OtpVerification };
