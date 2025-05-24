/* eslint-disable react/prop-types */
import { memo, useEffect, useRef } from "react";
import { useField } from "formik";
import { TextField } from "@mui/material";

const MUITextInput = ({ label, id, name, placeholder, ...props }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const [field, meta] = useField(name);

  useEffect(() => {
    console.log(
      `MUITextInput1 [${name}] rendered ${renderCount.current} times`
    );
  });
  return (
    <TextField
      fullWidth
      label={label}
      id={id}
      placeholder={placeholder}
      {...field}
      {...props}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
      margin="normal"
      variant="outlined"
    />
  );
};

export default memo(MUITextInput);
