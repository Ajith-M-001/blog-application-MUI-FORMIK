import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const MyForm5 = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values) => {
      console.log('Form data', values);
    },
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h1>MyForm5</h1>
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div style={{ color: 'red', fontSize: '0.8em' }}>{formik.errors.name}</div>
          ) : null}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: 'red', fontSize: '0.8em' }}>{formik.errors.email}</div>
          ) : null}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MyForm5;
