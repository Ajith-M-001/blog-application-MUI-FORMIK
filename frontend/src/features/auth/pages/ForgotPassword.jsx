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
import { FormField } from "../../../shared/components/MUI.Components/FormField";
import CountryPhoneSelector from "../../../shared/components/MUI.Components/CountryPhoneSelector";

/**
 * @typedef {object} ForgotPasswordFormValues
 * @property {boolean} useEmail - Flag to determine if email or phone is used.
 * @property {string} [email] - User's email address (if using email).
 * @property {string} [phoneNumber] - User's phone number (if using phone).
 * @property {object} [country] - User's selected country object (if using phone).
 */

/**
 * Yup validation schema for the Forgot Password form.
 * @type {Yup.ObjectSchema<ForgotPasswordFormValues>}
 */
const resetSchema = Yup.object().shape({
  useEmail: Yup.boolean(),
  email: Yup.string().when("useEmail", {
    is: true,
    then: (schema) => // Corrected: Added schema argument
      schema.required("Email is required").email("Invalid email"),
    otherwise: (schema) => schema.notRequired(), // Corrected: Added schema argument and changed to notRequired
  }),
  phoneNumber: Yup.string().when("useEmail", {
    is: false,
    then: (schema) => schema.required("Phone number is required"), // Corrected: Added schema argument
    otherwise: (schema) => schema.notRequired(), // Corrected: Added schema argument
  }),
  // country field can be added here if needed for validation with phoneNumber
});

/**
 * ForgotPassword component page.
 * Allows users to request a password reset OTP by providing their email or phone number.
 * @component
 * @returns {JSX.Element} The rendered Forgot Password page.
 */
const ForgotPassword = () => {
  const { mutate: forgotPassword, isPending: isResetLoading } =
    useForgotPassword();

  /**
   * Initial values for the Formik form.
   * @type {ForgotPasswordFormValues}
   */
  const initialValues = {
    useEmail: true,
    email: "",
    phoneNumber: "",
    country: null, // Added country to initialValues
  };

  const navigate = useNavigate();

  /**
   * Handles the form submission for forgot password requests.
   * Calls the `forgotPassword` mutation. On success, navigates to the OTP verification page
   * with necessary state for password reset flow.
   * @param {ForgotPasswordFormValues} values - The validated form values.
   */
  const handleSubmit = (values) => {
    let payload = values.useEmail
      ? { emailOrPhone: values.email, reset: true } // Changed to emailOrPhone
      : { emailOrPhone: values.phoneNumber, country: values.country, reset: true }; // Changed to emailOrPhone, added country

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
                            resetForm({ values: { ...initialValues, useEmail: false, email: '' } }); // Reset with new default
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
                      {/* Assuming CountryPhoneSelector handles name="phoneNumber" and name="country" */}
                      <CountryPhoneSelector disabled={false} hide={false} /> 
                      <Box sx={{ mt: 1 }}>
                        <MuiLink
                          component="button"
                          type="button"
                          variant="body2"
                          onClick={() => {
                            resetForm({ values: { ...initialValues, useEmail: true, phoneNumber: '', country: null } }); // Reset with new default
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
                      ml: 2, // Added margin to align with Grid2 spacing
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
                        ) : isValid ? ( // Changed from dirty || isValid
                          <BadgeCheck />
                        ) : (
                          <MoveRight />
                        )
                      }
                    >
                      {isResetLoading ? "Sending OTP..." : "Send OTP"}
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
