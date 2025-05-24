import { useRef, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import MUITextInput from "../component/MUITextInput";
import MUITextArea from "../component/MUITextArea";

const defaultValues = {
  firstName: "",
  lastName: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const MyForm = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log(`MyForm rendered ${renderCount.current} times`);
  });

  const formik = useFormik({
    initialValues: defaultValues,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      console.log("submitted values", values);
    },
  });

  // console.log(`MyForm rendered ${renderCount.current} times`);

  return (
    <FormikProvider value={formik}>
      <Typography variant="h5" mb={2} align="center">
        Registration Form
      </Typography>

      <Box
        sx={{ maxWidth: 600, mx: "auto" }}
        component={"form"}
        onSubmit={formik.handleSubmit}
      >
        <MUITextInput
          type="text"
          label="First Name"
          name="firstName"
          id="firstName"
          placeholder="John"
        />
        <MUITextInput
          type="text"
          label="Last Name"
          name="lastName"
          id="lastName"
          placeholder="Doe"
        />
        <MUITextInput
          type="email"
          label="Email"
          name="email"
          id="email"
          placeholder="x8RdM@example.com"
        />
        <MUITextInput
          type="password"
          label="Password"
          name="password"
          id="password"
          placeholder="********"
        />
        <MUITextInput
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="********"
        />

        <MUITextArea
          label="Address"
          name="address"
          id="address"
          placeholder="1234 Main St, City, Country"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </FormikProvider>
  );
};

export default MyForm;
