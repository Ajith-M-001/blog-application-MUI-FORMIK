import { Box, Button, Grid2, Stack, Typography, useTheme } from "@mui/material";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useResetPassword, useResetPasswordWithOTP } from "../hooks/use-auth";
import { FormField } from "../../../components/MUI.Components/FormField";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  currentPassword: Yup.string().when("fromOTPVerification", {
    is: false,
    then: () => Yup.string().required("Current Password is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

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

  const handleSubmit = (values) => {
    console.log("values", values);
    const payload = !isFromOTPVerification
      ? values
      : { ...values, ...location.state };
    console.log("payload", payload);

    isFromOTPVerification
      ? resetPasswordWithOTP(payload, {
          onSuccess: () => {
            navigate("/sign-in");
          },
        })
      : resetPassword(values, {
          onSuccess: () => {
            navigate("/sign-in");
          },
        });
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
