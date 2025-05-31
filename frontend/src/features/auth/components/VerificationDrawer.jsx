import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  alpha,
  Box,
  Button,
  Drawer,
  Grid2,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useResentOTP } from "../../hooks/api/Users";
import { showToast } from "../../../shared/utils/toast";
import CountryPhoneSelector from "../../../shared/components/MUI.Components/CountryPhoneSelector";
import { FormField } from "../../../shared/components/MUI.Components/FormField";
import PropTypes from "prop-types";

const getValidateSchema = Yup.object().shape({
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
  country: Yup.object().when("useEmail", {
    is: false,
    then: () => Yup.object().required("Please select country"),
    otherwise: () => Yup.object().notRequired(),
  }),
  useEmail: Yup.boolean(),
});

const VerificationDrawer = ({ onClose, openDrawer, userData }) => {
  const { mutate: resendOTP, isPending: isResending } = useResentOTP();

  const navigate = useNavigate();

  const verifyType = Boolean(userData?.email);

  const initialValue = {
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    country: userData?.country || null,
    useEmail: verifyType,
    isEditing: false,
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
  };

  const handleSubmit = (values) => {
    const payload = values.useEmail
      ? {
          email: values.email,
        }
      : {
          phoneNumber: values.phoneNumber,
        };
    resendOTP(payload, {
      onSuccess: (data) => {
        onClose();
        showToast(data.message, { type: "success" });
        navigate("/otp-verification", {
          state: {
            contactType: values.useEmail ? "email" : "phoneNumber",
            contactValue: values.useEmail ? payload.email : payload.phoneNumber,
          },
        });
      },
    });
  };

  const theme = useTheme();

  return (
    <Drawer
      anchor="bottom"
      open={openDrawer}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "auto",
          maxHeight: "70%",
          borderRadius: "16px 16px 0 0",
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 5,
        },
      }}
    >
      <IconButton
        size="small"
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          color: theme.palette.text.secondary,
        }}
      >
        <X />
      </IconButton>
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "80%", md: "60%" },
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent={"center"}
          mb={2}
        >
          <ErrorOutlineIcon color="warning" />
          <Typography variant="h5" component="h5">
            Account Verification Required
          </Typography>
        </Stack>
        <Formik
          initialValues={initialValue}
          validationSchema={getValidateSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form>
              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 3, textAlign: "center" }}
              >
                Welcome, {values.firstName} {values.lastName}! Verify your
                {values.useEmail ? " email to" : " phone number to"} unlock full
                access. You&apos;re currently viewing the application in limited
                mode. Please verify your{" "}
                {values.useEmail ? "Email" : "phoneNumber"}
              </Typography>
              <Grid2
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {values.useEmail ? (
                  // Email input field
                  <Grid2
                    size={{ xs: 11, md: 9, lg: 6 }}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <FormField
                      fieldType="email"
                      label="Email Address"
                      id="email"
                      name="email"
                      placeholder="john.doe@example.com"
                      disabled={!values.isEditing}
                    />
                  </Grid2>
                ) : (
                  // Phone number input with country code
                  <Grid2
                    size={{ xs: 11, md: 9, lg: 7 }}
                    sx={{
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <CountryPhoneSelector
                      disabled={!values.isEditing}
                      hide={true}
                    />
                  </Grid2>
                )}
              </Grid2>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent={"center"}
                mt={3}
              >
                <Button
                  sx={{
                    px: 5,
                  }}
                  variant="outlined"
                  color="secondary"
                  onClick={onClose}
                >
                  Later
                </Button>
                <Button
                  sx={{
                    px: 3,
                  }}
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={values.isEditing || !isValid || isResending}
                >
                  {isResending
                    ? "Sending OTP..."
                    : values.useEmail
                    ? "Send OTP to Email"
                    : "Send OTP to Phone Number"}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Drawer>
  );
};

export default VerificationDrawer;

VerificationDrawer.propTypes = {
  openDrawer: PropTypes.bool,
  onClose: PropTypes.func,
  userData: PropTypes.object,
};
