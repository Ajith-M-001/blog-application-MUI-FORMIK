/* eslint-disable react/prop-types */
import {
  Box,
  MenuItem,
  Select,
  useTheme,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { memo, useEffect, useRef } from "react";

const MUISelect = ({
  id,
  name,
  label,
  value,
  error,
  touched,
  required = false,
  options = [],
  onChange,
  onBlur,
  fullWidth = true,
  testId = name,
  labelProps = {},
  containerStyle = {},
  selectProps = {},
  getOptionLabel = (opt) =>
    typeof opt === "string" ? opt : opt?.label || opt?.name || "",
  getOptionValue = (opt) =>
    typeof opt === "string" ? opt : opt?.value || opt?.id || opt,
}) => {
  const theme = useTheme();
  const renderCount = useRef(0);
  renderCount.current += 1;

  const showError = touched && error;

  useEffect(() => {
    console.log(`MUISelect "${name}" render count:`, renderCount.current);
  });

  return (
    <Box sx={{ mt: 2, ...containerStyle }}>
      <InputLabel htmlFor={id} sx={{ mb: 1, fontWeight: 600 }} {...labelProps}>
        {label}&nbsp;
        {required ? (
          <span style={{ color: theme.palette.error.main }}>*</span>
        ) : (
          "(optional)"
        )}
      </InputLabel>

      <Select
        id={id}
        name={name}
        value={value}
        fullWidth={fullWidth}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        error={!!showError}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!showError}
        inputProps={{
          "data-testid": `${testId}-select`,
        }}
        {...selectProps}
      >
        {options.map((option) => {
          const val = getOptionValue(option);
          const label = getOptionLabel(option);
          return (
            <MenuItem key={val} value={val}>
              {label}
            </MenuItem>
          );
        })}
      </Select>

      {showError && (
        <FormHelperText error data-testid={`${testId}-error`}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};

export default memo(MUISelect);
