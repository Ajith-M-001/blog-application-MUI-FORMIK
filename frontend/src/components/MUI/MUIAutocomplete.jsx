/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useEffect, useRef } from "react";

const MUIAutocomplete = ({
  id,
  name,
  label,
  placeholder = "",
  options = [],
  value,
  error,
  touched,
  required = false,
  multiple = false,
  disabled = false,
  getOptionLabel = (option) => option?.name || "",
  onChange,
  onBlur,
  maxSelectedOptions = 10,
  testId = name,
  ...rest
}) => {
  const theme = useTheme();
  const renderCount = useRef(0);
  renderCount.current += 1;

  const showError = touched && error;

  useEffect(() => {
    console.log(`MUIAutocomplete "${name}" render count:`, renderCount.current);
  });

  return (
    <Box sx={{ mt: 2 }} data-testid={`${testId}-autocomplete-container`}>
      <Typography
        variant="h6"
        gutterBottom
        component="label"
        htmlFor={id}
        aria-label={`${label} selection`}
      >
        {label}&nbsp;
        {required ? (
          <span style={{ color: theme.palette.error.main }}>*</span>
        ) : (
          "(optional)"
        )}
      </Typography>

      <Autocomplete
        id={id}
        multiple={multiple}
        disablePortal
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={(event, newValue) => {
          if (!multiple || newValue.length <= maxSelectedOptions) {
            onChange({ target: { name, value: newValue } });
          }
        }}
        onBlur={onBlur}
        filterSelectedOptions
        disabled={disabled}
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            name={name}
            id={id}
            error={!!showError}
            helperText={showError ? error : ""}
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                "aria-required": required,
                "aria-invalid": !!showError,
                "data-testid": `${testId}-input`,
              },
            }}
            {...rest}
          />
        )}
        {...rest}
      />
    </Box>
  );
};

export default memo(MUIAutocomplete);
