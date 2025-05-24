/* eslint-disable react/prop-types */
import { useRef, useEffect, memo } from "react";
import { TextField } from "@mui/material";

const MUITextInput1 = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  ...props
}) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

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
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={Boolean(error)}
      helperText={helperText}
      margin="normal"
      variant="outlined"
      {...props}
    />
  );
};
export default memo(MUITextInput1);
