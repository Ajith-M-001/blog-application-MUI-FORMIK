import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { LoaderCircle, BadgeCheck, MoveRight } from "lucide-react";

const OtpVerification = ({
  contactType,
  contactValue,
  onVerificationComplete,
}) => {
  const [error, setError] = useState("hello world");
  const inputRefs = useRef([]);

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

  const handleInputChange = (e, index, values, setFieldValue) => {};
  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "30rem" },
        width: "100%",
        mx: "auto",
        p: { xs: 2, sm: 3 },
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
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
          component="h4"
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
        >
          {({
            values,
            handleChange,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <Stack spacing={3} width={"100%"}>
                <Stack
                  direction={"row"}
                  spacing={{ xs: 0.5, sm: 1 }}
                  justifyContent="center"
                  onPaste={(e) => handlePaste(e, setFieldValue)}
                >
                  {values.otp.map((digit, index) => (
                    <TextField
                      key={`otp-${index}`}
                      name={`otp[${index}]`}
                      value={values.otp[index]}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => {
                        const { value } = e.target;

                        // Allow only one digit, replacing the old number
                        if (value && !/^\d?$/.test(value)) return;

                        // Update the specific index value with the new digit
                        const newOtp = [...values.otp];
                        newOtp[index] = value ? value[0] : ""; // Always take the first digit only
                        setFieldValue("otp", newOtp);

                        if (value && index < 5) {
                          inputRefs.current[index + 1]?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !values.otp[index] &&
                          index > 0
                        ) {
                          inputRefs.current[index - 1]?.focus();
                        }
                        if (e.key === "ArrowLeft" && index > 0) {
                          inputRefs.current[index - 1]?.focus();
                        }
                        if (e.key === "ArrowRight" && index < 5) {
                          inputRefs.current[index + 1]?.focus();
                        }
                      }}
                      variant="outlined"
                      type="text"
                      inputMode="numeric"
                      error={touched.otp && Boolean(errors.otp?.[index])}
                      slotProps={{
                        "aria-label": `digit ${index + 1} of verification code`,
                      }}
                      sx={{
                        width: {
                          xs: "clamp(2.6rem, 5vw, 3rem)",
                          sm: "clamp(3rem, 7vw, 3.5rem)",
                          "& input": {
                            textAlign: "center",
                            p: { xs: 1, sm: 1.5 },
                            fontSize: { xs: "1.125rem", sm: "1.5rem" },
                            fontWeight: "medium",
                          },
                        },
                      }}
                    />
                  ))}
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || values.otp.some((digit) => !digit)}
                  endIcon={
                    isSubmitting ? (
                      <LoaderCircle />
                    ) : values.otp.every((digit) => digit) ? (
                      <BadgeCheck />
                    ) : (
                      <MoveRight />
                    )
                  }
                  size="small"
                  fullWidth
                  sx={{
                    py: 1,
                    mt: 2,
                    textTransform: "none",
                  }}
                >
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Box>
  );
};

export { OtpVerification };
