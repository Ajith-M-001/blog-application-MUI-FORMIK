import {
  Box,
  Button,
  Grid2,
  Paper,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormField } from "../components/MUI.Components/FormField";
import { Link, useNavigate } from "react-router";
import { useSignUpUser } from "../hooks/api/users";
import { LoaderCircle, BadgeCheck, MoveRight, Phone, Mail } from "lucide-react";
import { useGetAllCountry } from "../hooks/api/countries";
import { parsePhoneNumber } from "libphonenumber-js/max";
import CountryPhoneSelector from "../components/MUI.Components/CountryPhoneSelector";
import { showToast } from "../utils/toast";

// Validation schema with conditional validation for email/phone
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
    then: () =>
      Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email format"
        ),
    otherwise: () => Yup.string().notRequired(),
  }),
  phoneNumber: Yup.string().when("useEmail", {
    is: false,
    then: () =>
      Yup.string()
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
    otherwise: () => Yup.string().notRequired(),
  }),
  country: Yup.object().when("useEmail", {
    is: false,
    then: () => Yup.object().required("Please Select Country"),
    otherwise: () => Yup.object().notRequired(),
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

const SignUp = () => {
  const { mutate: SignUpUser, isPending: signUpPending } = useSignUpUser();
  const { data: allCountries } = useGetAllCountry();
  const navigate = useNavigate();

  // Initial values with default values
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

  const handleSubmit = (values) => {
    console.log("Submission Data:", values);

    SignUpUser(values, {
      onSuccess: (data) => {
        console.log("data_data", data);
        showToast(data.message, { type: "success" });
        navigate("/otp-verification", {
          state: {
            contactType: values.useEmail ? "email" : "phone",
            contactValue: values.useEmail
              ? data?.data?.user?.email
              : `${data?.data?.user?.country?.dial_code}${data?.data?.user?.phoneNumber}`,
          },
        });
      },
    });
  };

  return (
    <AnimatePresence>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 1, sm: 4 },
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 2,
            maxWidth: { xs: "100%", md: "950px" },
          }}
        >
          <Grid2
            container
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                p: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h2"
                  color="text.primary"
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Join NEXUS
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Create your account and start your blogging journey
                </Typography>

                <Formik
                  initialValues={initialValues}
                  validationSchema={SignUpSchema}
                  onSubmit={(values) => handleSubmit(values)}
                >
                  {({ dirty, isValid, values, setFieldValue, resetForm }) => (
                    <Form
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
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
                                <Phone size={18} /> Use phone number instead
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
                                <Mail size={18} /> Use email instead
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Already have an account? <Link to="/sign-in">Sign In</Link>
                  </Typography>
                </Box>
              </motion.div>
            </Grid2>
            {/* Right side decoration panel - keep as is */}
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{
                display: { xs: "none", md: "block" },
                bgcolor: "#616161",
                color: "white",
                height: "100%",
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
                <Typography sx={{ mt: 3 }} variant="subtitle1" color="#D1D5DB">
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
