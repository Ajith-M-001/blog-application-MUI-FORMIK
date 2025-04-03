import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { LoaderCircle, BadgeCheck, MoveRight } from "lucide-react";
import { useResentOTP, useVerifyOtp } from "../../hooks/api/Users";
import { useNavigate } from "react-router";
import { showToast } from "../../utils/toast";
import PropTypes from "prop-types";

const OtpVerification = ({ contactType, contactValue, reset }) => {
  const [resendTimer, setResendTimer] = useState(30);


  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [resendTimer]);

  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOTP, isPending: isResending } = useResentOTP();

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

  const handleResend = () => {
    if (resendTimer > 0 || isResending) return;
    resendOTP(
      { [contactType]: contactValue, reset },
      {
        onSuccess: (data) => {
          console.log("success", data);
        },
      }
    );
    setResendTimer(30);
  };

  const handleSubmit = (values) => {
    const OTP = values.otp.join("");
    verifyOTP(
      { [contactType]: contactValue, otp: OTP, reset },
      {
        onSuccess: (data) => {
          showToast(data.message, { type: "success" });

          const navigateTo = reset ? "/reset-password" : "/";
          const navigateOptions = reset
            ? {
                state: {
                  reset: true,
                  contactType: contactType,
                  contactValue: contactValue,
                },
              }
            : {};
          navigate(navigateTo, navigateOptions);
        },
      }
    );
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

  const handlePaste = (e, setFieldValue) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .substring(0, 6);

    if (!pastedData) return;

    const newOtp = Array(6).fill("");

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setFieldValue("otp", newOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    setTimeout(() => {
      inputRefs.current[focusIndex]?.focus();
    }, 0);
  };
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
          {({ values, errors, touched, setFieldValue }) => (
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

                        const singleDigit =
                          value.length > 0 ? value.slice(-1) : value;

                        // Only allow digits
                        if (!/^\d*$/.test(singleDigit)) return;

                        setFieldValue(`otp[${index}]`, singleDigit);

                        if (singleDigit && index < 5) {
                          setTimeout(() => {
                            inputRefs.current[index + 1]?.focus();
                          }, 0);
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
                          setTimeout(() => {
                            const input = inputRefs.current[index - 1];
                            if (input) {
                              input.setSelectionRange(
                                input.value.length,
                                input.value.length
                              );
                            }
                          }, 0);
                        }
                        if (e.key === "ArrowRight" && index < 5) {
                          inputRefs.current[index + 1]?.focus();
                          setTimeout(() => {
                            const input = inputRefs.current[index - 1];
                            if (input) {
                              input.setSelectionRange(
                                input.value.length,
                                input.value.length
                              );
                            }
                          }, 0);
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
                  disabled={isVerifying || values.otp.some((digit) => !digit)}
                  endIcon={
                    isVerifying ? (
                      <LoaderCircle className="loader-circle" />
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
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    Didn&apos;t receive the code?
                    <Typography
                      component="span"
                      color="primary.main"
                      onClick={handleResend}
                      sx={{
                        cursor:
                          resendTimer > 0 || isResending
                            ? "not-allowed"
                            : "pointer", // Proper cursor conditional logic
                        ml: 1,
                      }}
                    >
                      {isResending
                        ? "sending otp..."
                        : resendTimer > 0
                        ? `Resend OTP in ${resendTimer}s`
                        : " Resend OTP"}
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Box>
  );
};

OtpVerification.propTypes = {
  contactType: PropTypes.oneOf(["email", "phoneNumber"]).isRequired,
  contactValue: PropTypes.string.isRequired,
  reset: PropTypes.bool,
};

OtpVerification.defaultProps = {
  reset: false,
};

export { OtpVerification };
