import {
  Box,
  Button,
  Grid2,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "motion/react";
import * as Yup from "yup";
import {
  LoaderCircle,
  BadgeCheck,
  MoveRight,
  Phone,
  Mail,
  MoveLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForgotPassword } from "../hooks/use-auth";
import { FormField } from "../../../components/MUI.Components/FormField";
import CountryPhoneSelector from "../../../components/MUI.Components/CountryPhoneSelector";

const resetSchema = Yup.object().shape({
  useEmail: Yup.boolean(),
  email: Yup.string().when("useEmail", {
    is: true,
    then: () =>
      Yup.string().required("Email is required").email("Invalid email"),
    otherwise: () => Yup.string(),
  }),
  phoneNumber: Yup.string().when("useEmail", {
    is: false,
    then: () => Yup.string().required("Phone number is required"),
    otherwise: () => Yup.string(),
  }),
});

const ForgotPassword = () => {
  const { mutate: forgotPassword, isPending: isResetLoading } =
    useForgotPassword();
  const initialValues = {
    useEmail: true,
    email: "",
    phoneNumber: "",
  };

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    let payload = values.useEmail
      ? { email: values.email, reset: true }
      : { phoneNumber: values.phoneNumber, reset: true };

    forgotPassword(payload, {
      onSuccess: () => {
        navigate("/otp-verification", {
          state: {
            reset: true,
            contactType: values.useEmail ? "email" : "phoneNumber",
            contactValue: values.useEmail ? values.email : values.phoneNumber,
          },
        });
      },
    });
  };

  const formVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
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
          <Typography variant="h3">Forgot your password?</Typography>
          <Typography color="text.secondary">
            No worries, we&apos;ll help you reset it.
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={resetSchema}
            onSubmit={handleSubmit}
          >
            {({ dirty, isValid, values, resetForm, setFieldValue }) => (
              <Form>
                <Grid2 container spacing={2}>
                  {values.useEmail ? (
                    // Email input field
                    <Grid2 size={{ xs: 12 }}>
                      <FormField
                        fieldType="email"
                        label="Email Address"
                        id="email"
                        name="email"
                        placeholder="john.doe@example.com"
                      />
                      <Box sx={{ mt: 1 }}>
                        <MuiLink
                          component="button"
                          type="button"
                          variant="body2"
                          onClick={() => {
                            resetForm();
                            setFieldValue("useEmail", false);
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Phone size={18} />
                          <Typography>Use phone number instead</Typography>
                        </MuiLink>
                      </Box>
                    </Grid2>
                  ) : (
                    // Phone number input with country code
                    <Grid2 size={{ xs: 12 }}>
                      <CountryPhoneSelector disabled={false} hide={true} />
                      <Box sx={{ mt: 1 }}>
                        <MuiLink
                          component="button"
                          type="button"
                          variant="body2"
                          onClick={() => {
                            resetForm();
                            setFieldValue("useEmail", true);
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Mail size={18} />
                          <Typography>Use email instead</Typography>
                        </MuiLink>
                      </Box>
                    </Grid2>
                  )}

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 3,
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Button
                      type="submit"
                      disabled={!(dirty && isValid) || isResetLoading}
                      variant="contained"
                      fullWidth
                      endIcon={
                        isResetLoading ? (
                          <LoaderCircle className="loader-circle" />
                        ) : dirty || isValid ? (
                          <BadgeCheck />
                        ) : (
                          <MoveRight />
                        )
                      }
                    >
                      {isResetLoading ? "Sending OTP..." : "send OTP"}
                    </Button>

                    <Button
                      type="button"
                      variant="outlined"
                      component={Link}
                      to="/sign-in"
                      fullWidth
                      startIcon={<MoveLeft />}
                    >
                      Back to Login
                    </Button>
                  </Box>
                </Grid2>
              </Form>
            )}
          </Formik>
        </Stack>
      </Box>
    </AnimatePresence>
  );
};

export default ForgotPassword;
