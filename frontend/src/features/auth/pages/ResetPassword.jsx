import { Box, Button, Grid2, Stack, Typography, useTheme } from "@mui/material";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useResetPassword, useResetPasswordWithOTP } from "../hooks/use-auth";
import { FormField } from "../../../shared/components/MUI.Components/FormField";

/**
 * @typedef {object} ResetPasswordFormValues
 * @property {boolean} fromOTPVerification - Flag indicating if navigating from OTP flow.
 * @property {string} password - The new password.
 * @property {string} confirmPassword - Confirmation of the new password.
 * @property {string} [currentPassword] - User's current password (if not from OTP flow).
 */

/**
 * Yup validation schema for the Reset Password form.
 * Conditionally requires `currentPassword` if not part of OTP verification flow.
 * @type {Yup.ObjectSchema<ResetPasswordFormValues>}
 */
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  currentPassword: Yup.string().when("fromOTPVerification", {
    is: false,
    then: (schema) => schema.required("Current Password is required"), // Corrected: Added schema argument
    otherwise: (schema) => schema.notRequired(), // Corrected: Added schema argument
  }),
  fromOTPVerification: Yup.boolean(), // Added to schema for completeness
});

/**
 * ResetPassword component page.
 * Allows users to set a new password.
 * It handles two scenarios:
 * 1. Resetting password after OTP verification (unauthenticated).
 * 2. Changing password when already logged in (authenticated - requires current password).
 * The mode is determined by `isFromOTPVerification` flag from location state.
 * @component
 * @returns {JSX.Element} The rendered Reset Password page.
 */
const ResetPassword = () => {
  const location = useLocation();
  const isFromOTPVerification = location.state?.reset || false;
  const theme = useTheme();
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending: resetPasswordPending } =
    useResetPassword();
  const {
    mutate: resetPasswordWithOTP,
    isPending: resetPasswordWithOTPPending,
  } = useResetPasswordWithOTP();

  /**
   * Initial values for the Formik form.
   * `fromOTPVerification` is set based on router location state.
   * @type {ResetPasswordFormValues}
   */
  const initialValues = {
    fromOTPVerification: isFromOTPVerification,
    password: "",
    confirmPassword: "",
    currentPassword: "",
  };

  const formVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  /**
   * Handles the form submission for resetting/changing the password.
   * Calls either `resetPasswordWithOTP` or `resetPassword` mutation based on
   * whether the flow is from OTP verification or an authenticated change.
   * On success, navigates to the Sign In page.
   * @param {ResetPasswordFormValues} values - The validated form values.
   */
  const handleSubmit = (values) => {
    console.log("values", values);
    // Construct payload, ensuring contactValue and contactType are passed for OTP flow
    const payload = isFromOTPVerification
      ? { 
          emailOrPhone: location.state?.contactValue, 
          otp: location.state?.otp, // Assuming OTP is passed in state from OTP page
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
          // fromOTPVerification is implicitly handled by the endpoint choice
        }
      : { // For authenticated password change
          oldPassword: values.currentPassword,
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        };
    console.log("payload", payload);

    if (isFromOTPVerification) {
      resetPasswordWithOTP(payload, {
        onSuccess: () => {
          navigate("/sign-in");
        },
      });
    } else {
      resetPassword(payload, { // Use the modified payload for authenticated reset
        onSuccess: () => {
          navigate("/sign-in");
        },
      });
    }
  };

  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={formVariant}
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            maxWidth: { xs: "100%", sm: "30rem" },
            width: "100%",
            mx: "auto",
            p: { xs: 2, sm: 3 },
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.background.paper,
              padding: 2,
              borderRadius: "50%",
              width: "fit-content",
              mx: "auto",
            }}
          >
            <KeyRound size={40} color={theme.palette.primary.main} />
          </Box>

          <Typography variant="h3">
            {isFromOTPVerification ? "Set New Password" : "Reset Password"}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {isFromOTPVerification
              ? "Create a new password for your account"
              : "Enter your current password and create a new one"}
          </Typography>

          <Stack>
            <Formik
              initialValues={initialValues}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ dirty, isValid }) => (
                <Form>
                  <Grid2 container spacing={2}>
                    {!isFromOTPVerification && (
                      <Grid2 size={{ xs: 12 }}>
                        <FormField
                          fieldType="password"
                          label="Current Password"
                          id="currentPassword"
                          name="currentPassword"
                          placeholder="********"
                        />
                      </Grid2>
                    )}
                    <Grid2 size={{ xs: 12 }}>
                      <FormField
                        fieldType="password"
                        label="Password"
                        id="password"
                        name="password"
                        placeholder="********"
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                      <FormField
                        fieldType="password"
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="********"
                      />
                    </Grid2>
                  </Grid2>
                  <Button
                    type="submit"
                    disabled={
                      !(dirty && isValid) ||
                      resetPasswordPending ||
                      resetPasswordWithOTPPending
                    }
                    variant="contained"
                    sx={{ my: 2 }}
                    fullWidth
                  >
                    {resetPasswordPending || resetPasswordWithOTPPending
                      ? "Processing..."
                      : isFromOTPVerification
                      ? "Set New Password"
                      : "Reset Password"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Stack>
        </Stack>
      </Box>
    </AnimatePresence>
  );
};

export default ResetPassword;
