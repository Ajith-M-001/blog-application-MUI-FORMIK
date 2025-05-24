/* eslint-disable react/prop-types */
import { memo, useEffect, useRef } from "react";
import { useField } from "formik";
import { TextField } from "@mui/material";

const MUITextAreaInput = ({ label, id, name, placeholder, rows = 4, ...props }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const [field, meta] = useField(name);

  useEffect(() => {
    console.log(
      `MUITextAreaInput [${name}] rendered ${renderCount.current} times`
    );
  });
  return (
    <TextField
      fullWidth
      label={label}
      id={id}
      placeholder={placeholder}
      multiline={true}
      rows={rows}
      {...field}
      {...props}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
      margin="normal"
      variant="outlined"
    />
  );
};

export default memo(MUITextAreaInput);
