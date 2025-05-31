/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { memo, useMemo } from "react";

const MUIDateTimePicker = ({
  id,
  name,
  label,
  required = false,
  value,
  error,
  touched,
  onChange,
  onBlur,
  minDateTime,
  maxDateTime,
  disabled = false,
  inputFormat = "MM/DD/YYYY HH:mm",
  testId = name,
}) => {
  // Memoize error state to avoid recomputation
  const showError = useMemo(() => touched && !!error, [touched, error]);

  // Memoize the dayjs value to avoid redundant conversions
  const parsedValue = useMemo(() => (value ? dayjs(value) : null), [value]);

  // Memoize textField props to avoid recreating objects
  const textFieldProps = useMemo(
    () => ({
      id,
      name,
      error: showError,
      helperText: showError ? error : "",
      "data-testid": `${testId}-datetime-input`,
      fullWidth: true,
      disabled,
      inputProps: {
        "aria-required": required,
        "aria-invalid": showError,
      },
    }),
    [id, name, showError, error, testId, disabled, required]
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        component="label"
        htmlFor={id}
        aria-label={`${label} datetime picker`}
      >
        {label}{" "}
        {required ? <span style={{ color: "#d32f2f" }}>*</span> : "(optional)"}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={parsedValue}
          onChange={(newValue) => {
            onChange({
              target: { name, value: newValue?.toISOString() || "" },
            });
          }}
          onBlur={onBlur}
          minDateTime={minDateTime}
          maxDateTime={maxDateTime}
          format={inputFormat}
          slotProps={{ textField: textFieldProps }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default memo(MUIDateTimePicker);
