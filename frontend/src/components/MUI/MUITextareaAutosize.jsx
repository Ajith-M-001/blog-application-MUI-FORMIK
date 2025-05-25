/* eslint-disable react/prop-types */
import { Box, TextareaAutosize, Typography, useTheme } from "@mui/material";
import { memo, useEffect, useRef } from "react";

const MUITextareaAutosize = ({
  id,
  name,
  label,
  required = false,
  placeholder,
  minRows = 3,
  maxLength = 300,
  value,
  error,
  touched,
  onChange,
  onBlur,
  autoFocus = false,
  fontSize = "1rem",
  fontWeight = 400,
  style = {},
  labelProps = {},
  containerStyle = {},
  ...rest
}) => {
  const theme = useTheme();
  const renderCount = useRef(0);
  renderCount.current += 1;

  const showError = touched && error;

  useEffect(() => {
    console.log(
      `MUITextareaAutosize "${name}" render count:`,
      renderCount.current
    );
  });
  return (
    <Box sx={{ mt: 2, ...containerStyle }}>
      <Typography
        variant="h6"
        gutterBottom
        component="label"
        htmlFor={"title"}
        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        {...labelProps}
      >
        {label}&nbsp;
        {required ? (
          <span style={{ color: theme.palette.error.main }}>*</span>
        ) : (
          "(optional)"
        )}
      </Typography>
      <TextareaAutosize
        id={id}
        name={name}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder={placeholder}
        minRows={minRows}
        maxLength={maxLength}
        aria-label={name}
        aria-required={required}
        aria-describedby={showError ? `${id}-error` : undefined}
        aria-invalid={!!showError}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          width: "100%",
          fontSize,
          fontWeight,
          padding: "10px 14px",
          borderRadius: 8,
          outline: "none",
          border: `1px solid ${
            showError ? theme.palette.error.main : theme.palette.divider
          }`,
          resize: "none",
          fontFamily: theme.typography.fontFamily,
          backgroundColor: theme.palette.background.paper,
          ...style,
        }}
        data-testid={`${name}-input`}
        {...rest}
      />
      {showError ? (
        <Typography id={`${id}-error`} variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            textAlign: "left",
            color: theme.palette.text.secondary,
            display: "block",
          }}
        >
          {value.length}/{maxLength} characters
        </Typography>
      )}
    </Box>
  );
};

export default memo(MUITextareaAutosize);
