import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Box, Button, Typography, Container } from '@mui/material';
import MUITextInput from '../component/MUITextInput';
import MUITextAreaInput from '../component/MUITextAreaInput';

const initialValues = {
  firstName: '',
  lastName: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = yup.object({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  address: yup.string().required('Required'),
  email: yup.string().email('Invalid email format').required('Required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const MyForm5 = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        MyForm5
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Form Values:", values);
          setSubmitting(false);
        }}
        validateOnBlur={true}
        validateOnChange={false}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              <MUITextInput name="firstName" label="First Name" id="firstName" />
              <MUITextInput name="lastName" label="Last Name" id="lastName" />
              <MUITextAreaInput name="address" label="Address" id="address" rows={4} />
              <MUITextInput name="email" label="Email" id="email" type="email" />
              <MUITextInput name="password" label="Password" id="password" type="password" />
              <MUITextInput name="confirmPassword" label="Confirm Password" id="confirmPassword" type="password" />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default MyForm5;
