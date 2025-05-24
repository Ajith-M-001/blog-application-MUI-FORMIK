import { memo, useState } from "react";
import { useField } from "formik";
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * @typedef {import('@mui/material').TextFieldProps} TextFieldProps
 */

/**
 * PasswordField component is a Formik-integrated wrapper around Material-UI's TextField
 * specifically for password inputs. It includes a toggle for password visibility.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.name - The name of the field (used by Formik for state and validation).
 * @param {string} props.label - The label for the password field.
 * @param {string} [props.id] - The id for the password field.
 * @param {string} [props.placeholder] - Placeholder text for the field.
 * // Other standard TextField props can also be passed.
 * @returns {JSX.Element} The rendered password field component.
 * @example
 * <PasswordField name="password" label="Password" />
 */
const PasswordField = ({ label, id, name, placeholder, ...props }) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Prevent blur on click
  };

  return (
    <TextField
      fullWidth
      label={label}
      id={id || name}
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      margin="normal"
      {...field}
      {...props} // Spread other props like 'autoComplete' if passed
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ""}
      InputProps={{
        ...props.InputProps, // Spread existing InputProps if any
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={showPassword ? "Hide password" : "Show password"}>
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
};

PasswordField.propTypes = {
  // Prop types can be added here if using PropTypes,
  // but for this task, focusing on JSDoc and functionality.
  // name: PropTypes.string.isRequired,
  // label: PropTypes.string.isRequired,
  // id: PropTypes.string,
  // placeholder: PropTypes.string,
};

export default memo(PasswordField);
