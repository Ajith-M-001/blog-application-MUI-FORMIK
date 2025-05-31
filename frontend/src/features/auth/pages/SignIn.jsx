import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Button,
  Divider,
  Grid2,
  Link as MuiLink,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import {
  ArrowRight,
  LoaderCircle,
  LogIn,
  Mail,
  Phone,
  TriangleAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import { showToast } from "../../../shared/utils/toast";
import { useSignInUser } from "../hooks/use-auth";
import { FormField } from "../../../shared/components/MUI.Components/FormField";
import { useUserActions } from "../../../shared/store/userStore";

const SignInSchema = Yup.object().shape({
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
    then: () => Yup.string().required("Phone number is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  useEmail: Yup.boolean(),
});

const SignIn = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mutate: signInUser, isPending: isSigningIn } = useSignInUser({});
  const urlParams = new URLSearchParams(window.location.search);
  const authMessage = urlParams.get("auth");

  const { setIsAuthenticated } = useUserActions();

  useEffect(() => {
    if (authMessage === "google_auth_failed") {
      setIsAuthenticated(false);
      showToast("google authentication failed", { type: "error" });
      // Optionally remove the parameter from URL for cleaner UX
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [authMessage, setIsAuthenticated]);

  const handleGoogleSignIn = () => {
    window.location.href = `http://localhost:3000/api/v1/users/auth/google`;
  };

  const HandleSubmit = (values, { resetForm }) => {
    console.log(values);
    signInUser(values, {
      onSuccess: () => {
        setIsAuthenticated(true);
        resetForm();
        navigate("/");
      },
    });
  };

  const initialValues = {
    email: "",
    password: "",
    useEmail: true,
    phoneNumber: "",
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
              height: "100%",
              width: "100%",
              borderRadius: 2,
            }}
          >
            {/* Left side - Decoration panel (visible only on md and up) */}
            <Grid2
              size={{
                xs: 12,
                md: 6,
              }}
              sx={{
                display: { xs: "none", md: "block" },
                bgcolor: theme.palette.background.secondary,
                color: theme.palette.text.primary,
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                  padding: 4,
                }}
              >
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <Typography
                    variant="h2"
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

                <Typography
                  variant="body1"
                  color="#D1D5DB"
                  mt={2}
                  textAlign={"center"}
                >
                  Welcome back to the platform where ideas connect and stories
                  thrive
                </Typography>
                <Box
                  sx={{
                    mt: 2,
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
                        bgcolor: "rgba(255,255,255,0.2)",
                        animation: "pulse 1.5s infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid2>

            {/* Right side - Sign In Form */}
            <Grid2
              size={{
                xs: 12,
                md: 6,
              }}
              sx={{
                padding: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  component={"h2"}
                  variant="h2"
                  color="text.primary"
                  textAlign={"center"}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign={"center"}
                >
                  Sign in to continue your blogging journey
                </Typography>
                <Formik
                  initialValues={initialValues}
                  validationSchema={SignInSchema}
                  onSubmit={HandleSubmit}
                >
                  {({ dirty, isValid, values, setFieldValue, resetForm }) => (
                    <Form>
                      <Grid2 sx={{ mt: 3 }} container spacing={2}>
                        {values.useEmail ? (
                          <Grid2
                            size={{
                              xs: 12,
                            }}
                          >
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
                                  Use phone number to sign in
                                </Typography>
                              </MuiLink>
                            </Box>
                          </Grid2>
                        ) : (
                          <Grid2
                            size={{
                              xs: 12,
                            }}
                          >
                            <FormField
                              fieldType="number"
                              label="Phone Number"
                              id="phoneNumber"
                              name="phoneNumber"
                              placeholder="9876543210"
                            />
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
                                <Typography>Use email to sign in</Typography>
                              </MuiLink>
                            </Box>
                          </Grid2>
                        )}

                        <Grid2
                          size={{
                            xs: 12,
                          }}
                        >
                          <FormField
                            fieldType="password"
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                          />
                        </Grid2>
                      </Grid2>
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <MuiLink
                          component={Link}
                          to="/forgot-password"
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          <TriangleAlert size={18} />
                          Forgot Password?
                        </MuiLink>
                      </Box>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!(dirty && isValid) || isSigningIn}
                        sx={{ mt: 2 }}
                        endIcon={
                          isSigningIn ? (
                            <LoaderCircle className="loader-circle" />
                          ) : dirty && isValid ? (
                            <LogIn size={20} />
                          ) : (
                            <ArrowRight size={20} />
                          )
                        }
                      >
                        Sign In
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
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up">Sign Up</Link>
                  </Typography>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
      </Box>
    </AnimatePresence>
  );
};

export default SignIn;
