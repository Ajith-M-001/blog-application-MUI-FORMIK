import { motion, AnimatePresence } from "motion/react";
import { Box, Button, Container, Grid2, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormField } from "../components/MUI.Components/FormField";

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
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
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
});

const SignUp = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  console.log("rendering");

  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm();
  };

  return (
    <AnimatePresence>
      <Box
        component="motion.div"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="lg" height="100%">
          <Grid2 container spacing={10} alignItems="center" height={"100%"}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box textAlign={{ xs: "center", md: "left" }}>
                  <Typography variant="h2" color="text.primary">
                    Join NEXUS
                  </Typography>
                  <Typography color="text.secondary">
                    Create your account and start your blogging journey
                  </Typography>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={SignUpSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ dirty, isValid }) => (
                      <Form style={{ width: "100%" }}>
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
                          <Grid2 size={{ xs: 12 }}>
                            <FormField
                              fieldType="email"
                              label="Email Address"
                              id="email"
                              name="email"
                              placeholder="John.doe@example.com"
                            />
                          </Grid2>
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
                          disabled={!(dirty && isValid)}
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign Up
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Box>
              </motion.div>
            </Grid2>
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{
                display: { xs: "none", md: "block" },
                bgcolor: "#1E293B",
                color: "white",
                height: "100%",
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
        </Container>
      </Box>
    </AnimatePresence>
  );
};

export default SignUp;
