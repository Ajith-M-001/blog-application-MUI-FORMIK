import React from 'react';
import { Box, Container, Paper, Typography, Grid, Button, Link as MuiLink, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { submitRegistration } from '../features/auth/api/auth.api';
import { showToast } from '../shared/utils/toast';
import MUITextInput from '../component/MUITextInput';
import PasswordField from '../component/PasswordField';

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Required"),
});

/**
 * RegisterForm component page.
 * Provides a modern, responsive split-screen registration form.
 * Features include:
 * - Split-screen layout (welcome message on left, form on right).
 * - Framer Motion animations for smooth transitions.
 * - Formik for form state management.
 * - Yup for validation (first name, last name, email, strong password, confirm password).
 * - Custom PasswordField component with visibility toggle.
 * - Handles form submission via an API call using TanStack Query (React Query).
 * - Displays success/error feedback using toast notifications.
 *
 * @component
 * @returns {JSX.Element} The rendered RegisterForm page.
 */
const RegisterForm = () => {
  const navigate = useNavigate();

  const registrationMutation = useMutation({
    mutationFn: submitRegistration,
    onSuccess: (data) => {
      showToast("Registration successful! Please check your email to verify.", { type: 'success' });
      // For now, let's navigate to sign-in as a placeholder action.
      // Actual navigation might depend on application flow (e.g., to an OTP page or directly to sign-in).
      // navigate('/sign-in'); 
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
      showToast(errorMessage, { type: 'error' });
    },
  });

  /**
   * Handles the asynchronous submission of the registration form.
   * It calls the `mutateAsync` function from the `registrationMutation` (useMutation hook)
   * to send the form data to the backend API.
   * On successful submission, it resets the form.
   * Success and error feedback (toasts) are handled by the `onSuccess` and `onError`
   * callbacks defined in the `useMutation` options.
   *
   * @async
   * @param {object} values - The validated form values from Formik.
   * @param {import('formik').FormikHelpers<object>} formikHelpers - Formik helpers, including `resetForm`.
   */
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await registrationMutation.mutateAsync(values);
      // onSuccess in useMutation handles success toast.
      resetForm(); // Reset form on successful submission.
    } catch (error) {
      // onError in useMutation handles error toast.
      // Error is already logged by useMutation's onError, but can log here too if needed.
      console.error("Registration submission error:", error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(to bottom right, #f0f4f8, #ffffff)' }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Side */}
        <Grid item md={5} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
            <Typography variant="h5" textAlign="center" mb={2} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Join creative voices at Nexus Blog
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Share your stories with a vibrant community of writers and readers. Discover new perspectives and ignite your passion for writing.
            </Typography>
          </motion.div>
        </Grid>
        {/* Right Side - Form Area */}
        <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 3, md: 4 } }}>
          <Container maxWidth="sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75, delay: 0.25 }} style={{ width: '100%' }}>
              <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, backgroundColor: '#fff', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Create Your Account
                </Typography>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {() => ( 
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <MUITextInput name="firstName" label="First Name" autoComplete="given-name" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MUITextInput name="lastName" label="Last Name" autoComplete="family-name" />
                        </Grid>
                        <Grid item xs={12}>
                          <MUITextInput name="email" label="Email Address" type="email" autoComplete="email" />
                        </Grid>
                        <Grid item xs={12}>
                          <PasswordField name="password" label="Password" autoComplete="new-password" />
                        </Grid>
                        <Grid item xs={12}>
                          <PasswordField name="confirmPassword" label="Confirm Password" autoComplete="new-password" />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 3, mb: 2 }}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={registrationMutation.isPending}
                          sx={{ py: 1.5, '&:hover': { backgroundColor: 'primary.dark' } }}
                        >
                          {registrationMutation.isPending ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                        </Button>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="body2">
                          Already have an account?{' '}
                          <MuiLink component={RouterLink} to="/sign-in" variant="body2">
                            Sign in
                          </MuiLink>
                        </Typography>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </motion.div>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;
