import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import MUITextInput1 from "../component/MUITextInput1";
import MUITextArea1 from "../component/MUITextArea1";

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

const MyForm1 = () => {
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

  return (
    <>
      <Typography variant="h5" mb={2} align="center">
        Registration Form
      </Typography>
      <Box
        sx={{ maxWidth: 600, mx: "auto" }}
        component={"form"}
        onSubmit={formik.handleSubmit}
      >
        <MUITextInput1
          type="text"
          label="First Name"
          name="firstName"
          id="firstName"
          placeholder="John"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <MUITextInput1
          type="text"
          label="Last Name"
          name="lastName"
          id="lastName"
          placeholder="Doe"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <MUITextInput1
          type="email"
          label="Email"
          name="email"
          id="email"
          placeholder="zVY9F@example.com"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <MUITextArea1
          label="Address"
          name="address"
          id="address"
          minRows={3}
          placeholder="123 Main St, Anytown, USA"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <MUITextInput1
          type="password"
          label="Password"
          name="password"
          id="password"
          placeholder="********"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <MUITextInput1
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="********"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
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
    </>
  );
};

export default MyForm1;
