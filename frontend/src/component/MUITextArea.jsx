/* eslint-disable react/prop-types */
import { memo, useEffect, useRef } from "react";
import { useField } from "formik";
import { FormHelperText, TextareaAutosize, Typography } from "@mui/material";

const MUITextArea = ({ label, name, minRows = 3, ...props }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const [field, meta] = useField(name);

  useEffect(() => {
    console.log(`MUITextArea rendered ${renderCount.current} times`);
  });

  return (
    <div style={{ margin: "16px 0", width: "100%" }}>
      <Typography variant="body1" gutterBottom>
        {label}
      </Typography>
      <TextareaAutosize
        {...field}
        {...props}
        minRows={minRows}
        style={{
          width: "100%",
          padding: "10px",
          borderColor: meta.touched && meta.error ? "red" : "#ccc",
          borderRadius: "4px",
          fontSize: "1rem",
          fontFamily: "inherit",
        }}
      />
      {meta.touched && meta.error && (
        <FormHelperText error>{meta.error}</FormHelperText>
      )}
    </div>
  );
};

export default memo(MUITextArea);
