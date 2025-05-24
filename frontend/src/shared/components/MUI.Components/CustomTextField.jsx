import { IconButton, InputAdornment, TextField, useTheme, Box, Typography, LinearProgress } from "@mui/material";
import { useField } from "formik";
import { memo, useState, Fragment } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { calculatePasswordStrength, strengthLevels } from "../../utils/passwordStrength";

const CustomTextField = memo(
  ({ label, name, fieldType = "text", ...props }) => {
    const [field, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const password = field.value;
    const isPasswordField = fieldType === "password";
    const theme = useTheme();

    const strength = calculatePasswordStrength(password || '');
    const currentStrengthLevelDetails = strengthLevels[strength.level];

    const handleFocus = () => {
      if (isPasswordField) {
        setIsPasswordFocused(true);
      }
    };

    const handleBlur = (e) => { // Pass the event 'e'
      if (isPasswordField) {
        setIsPasswordFocused(false);
      }
      field.onBlur(e); // Call Formik's onBlur with the event
    };

    const textFieldProps = {
      ...field,
      ...props,
      label,
      type: isPasswordField ? (showPassword ? "text" : "password") : fieldType,
      fullWidth: true,
      margin: "normal",
      variant: "outlined",
      error: meta.touched && Boolean(meta.error), // Ensure error is boolean
      helperText: meta.touched && meta.error ? meta.error : "",
      onFocus: handleFocus,
      onBlur: handleBlur, // Use custom handleBlur that also calls Formik's onBlur
    };

    if (isPasswordField) {
      textFieldProps.InputProps = {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              sx={{ color: theme.palette.secondary.main }}
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {!showPassword ? <EyeClosed /> : <Eye />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    return (
      <Fragment>
        <TextField {...textFieldProps} />
        {isPasswordField && isPasswordFocused && password && password.length > 0 && currentStrengthLevelDetails && currentStrengthLevelDetails.text !== '' && (
          <Box sx={{ mt: 0.5, mb: !(meta.touched && meta.error) ? 2.5 : 0 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min((strength.score / 5) * 100, 100)}
              color={currentStrengthLevelDetails.color.split('.')[0]}
              sx={{ height: '6px', borderRadius: '3px', mb: 0.75 }}
            />
            <Typography
              variant="caption"
              color={currentStrengthLevelDetails.color}
              sx={{ display: 'block' }}
            >
              {currentStrengthLevelDetails.text}
            </Typography>
          </Box>
        )}
      </Fragment>
    );
  }
);

CustomTextField.displayName = "CustomTextField";

export { CustomTextField };
