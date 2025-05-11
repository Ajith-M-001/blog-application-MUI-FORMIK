import { IconButton, InputAdornment, TextField, useTheme } from "@mui/material";
import { useField } from "formik";
import { memo, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const CustomTextField = memo(
  ({ label, name, fieldType = "text", ...props }) => {
    const [field, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = fieldType === "password";
    const theme = useTheme();

    const textFieldProps = {
      ...field,
      ...props,
      label,
      type: isPasswordField ? (showPassword ? "text" : "password") : fieldType,
      fullWidth: true,
      margin: "normal",
      variant: "outlined",
      error: meta.touched && meta.error,
      helperText: meta.touched && meta.error,
    };

    if (isPasswordField) {
      textFieldProps.InputProps = {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              sx={{ color: theme.palette.secondary.main }} // Set icon color from theme
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {!showPassword ? <EyeClosed /> : <Eye />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }
    return <TextField {...textFieldProps} />;
  }
);

CustomTextField.displayName = "CustomTextField";

export { CustomTextField };
