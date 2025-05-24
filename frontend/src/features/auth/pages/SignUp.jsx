import {
  Box,
  Grid2,
  Paper,
  Typography,
  useTheme,
  Link as MuiLink,
  Button,
  Divider,
} from "@mui/material";
import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "motion/react";
import * as Yup from "yup";
import { parsePhoneNumber } from "libphonenumber-js/max";
import { Link, useNavigate } from "react-router";
import { LoaderCircle, BadgeCheck, MoveRight, Phone, Mail } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import { FormField } from "../../../shared/components/MUI.Components/FormField";
import { useGetAllCountry, useSignUpUser } from "../hooks/use-auth";
import CountryPhoneSelector from "../../../shared/components/MUI.Components/CountryPhoneSelector";

/**
 * @typedef {object} SignUpFormValues
 * @property {string} firstName - User's first name.
 * @property {string} lastName - User's last name.
 * @property {string} [email] - User's email address (if using email for signup).
 * @property {string} [phoneNumber] - User's phone number (if using phone for signup).
 * @property {object} [country] - User's selected country object (if using phone for signup).
 * @property {string} country.code - Country code e.g. 'US'.
 * @property {string} password - User's chosen password.
 * @property {string} confirmPassword - Confirmation of the password.
 * @property {boolean} useEmail - Flag to determine if email or phone is used for signup.
 */

/**
 * Yup validation schema for the Sign Up form.
 * Defines rules for each field, including conditional validation for email/phone.
 *
 * @type {Yup.ObjectSchema<SignUpFormValues>}
 */
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed")
    .required("Last Name is required"),
  email: Yup.string().when("useEmail", {
    is: true,
    then: (schema) => // Changed to use schema argument
      schema
        .email("Invalid email address")
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email format"
        ),
    otherwise: (schema) => schema.notRequired(), // Changed to use schema argument
  }),
  phoneNumber: Yup.string().when("useEmail", {
    is: false,
    then: (schema) => // Changed to use schema argument
      schema
        .required("Phone number is required")
        .test("is-mobile", "Invalid mobile number", function (value) {
          const country = this.parent.country;
          if (!country || !value) return false;

          try {
            const phoneNumber = parsePhoneNumber(value, country.code);
            return (
              !!phoneNumber &&
              phoneNumber.isValid() &&
              phoneNumber.getType() === "MOBILE"
            );
          } catch (e) {
            console.error(e);
            return false;
          }
        }),
    otherwise: (schema) => schema.notRequired(), // Changed to use schema argument
  }),
  country: Yup.object().when("useEmail", {
    is: false,
    then: (schema) => schema.required("Please Select Country"), // Changed to use schema argument
    otherwise: (schema) => schema.notRequired(), // Changed to use schema argument
  }),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  useEmail: Yup.boolean(),
});

/**
 * SignUp component page.
 * Handles user registration with options for email/phone and Google OAuth.
 *
 * @component
 * @returns {JSX.Element} The rendered SignUp page.
 * @example
 * <SignUp />
 */
const SignUp = () => {
  const { mutate: SignUpUser, isPending: signUpPending } = useSignUpUser();
  const { data: allCountries } = useGetAllCountry({
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    cacheTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 70 * 60 * 1000, // 1 hour and 10 minutes
  });

  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Initial values for the Formik form.
   * @type {SignUpFormValues}
   */
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: null,
    phoneNumber: "",
    useEmail: true, // Default to email input
  };

  /**
   * Handles the Google Sign-In process by redirecting the user.
   * Constructs the Google OAuth URL and navigates the window to it.
   */
  const handleGoogleSignIn = () => {
    // Consider moving the base URL to a configuration file or environment variable.
    window.location.href = `http://localhost:3000/api/v1/users/auth/google`;
  };

  /**
   * Handles the form submission for user registration.
   * Calls the `SignUpUser` mutation from `useSignUpUser` hook.
   * On successful registration, navigates to the OTP verification page,
   * passing necessary state for the OTP component.
   *
   * @param {SignUpFormValues} values - The validated form values.
   */
  const handleSubmit = (values) => {
    SignUpUser(values, {
      onSuccess: (data) => {
        navigate("/otp-verification", {
          state: {
            contactType: values.useEmail ? "email" : "phoneNumber",
            contactValue: values.useEmail
              ? data?.data?.user?.email // Optional chaining for safety
              : data?.data?.user?.phoneNumber, // Optional chaining for safety
          },
        });
      },
    });
  };

  // ... rest of the component JSX
  return (
    <AnimatePresence>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 1, sm: 4 },
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            height: "auto",
            overflow: "hidden",
            borderRadius: 2,
            maxWidth: {
              xs: "100%",
              md: "55rem",
            },
          }}
        >
          <Grid2
            container
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ textAlign: "center" }}
              >
                <Typography variant="h2" color="text.primary">
                  Join NEXUS
                </Typography>
                <Typography color="text.secondary">
                  Create your account and start your blogging journey
                </Typography>
                <Formik
                  initialValues={initialValues}
                  validationSchema={SignUpSchema}
                  onSubmit={handleSubmit} // Corrected: Pass the function reference
                >
                  {({ dirty, isValid, values, setFieldValue, resetForm }) => (
                    <Form>
                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <FormField
                            fieldType="text"
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <FormField
                            fieldType="text"
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                          />
                        </Grid2>

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
                                <Typography>
                                  Use phone number instead
                                </Typography>
                              </MuiLink>
                            </Box>
                          </Grid2>
                        ) : (
                          // Phone number input with country code
                          <Grid2 size={{ xs: 12 }}>
                            <CountryPhoneSelector countries={allCountries} />
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
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!(dirty && isValid) || signUpPending}
                        endIcon={
                          signUpPending ? (
                            <LoaderCircle className="loader-circle" />
                          ) : dirty && isValid ? (
                            <BadgeCheck />
                          ) : (
                            <MoveRight />
                          )
                        }
                        sx={{
                          mt: 3,
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {signUpPending ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </Form>
                  )}
                </Formik>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mx: 1.5,
                    }}
                  >
                    OR
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  color="secondary"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Sign in with Google
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Already have an account? <Link to="/sign-in">Sign In</Link>
                  </Typography>
                </Box>
              </Box>
            </Grid2>
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{
                display: { xs: "none", md: "block" },
                bgcolor: theme.palette.background.secondary,
                color: theme.palette.text.primary,
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 4,
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <Typography
                    variant="h2"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      background: "linear-gradient(to right, white, #D1D5DB)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    NEXUS
                  </Typography>
                </motion.div>

                <Box
                  sx={{
                    mt: 1,
                    width: "100%",
                    height: "4px",
                    bgcolor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                  }}
                />

                <Typography sx={{ mt: 3 }} variant="body1" color="#D1D5DB">
                  The modern platform for bloggers who value elegant design and
                  seamless experiences
                </Typography>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.3)",
                        animation: "pulse 1.5s infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
      </Box>
    </AnimatePresence>
  );
};

export default SignUp;
```
