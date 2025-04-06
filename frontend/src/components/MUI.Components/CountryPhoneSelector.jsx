import React, { useMemo, useCallback } from "react";
import { Box, Autocomplete, TextField, InputAdornment } from "@mui/material";
import { useField, useFormikContext } from "formik";
import PropTypes from "prop-types";

const CountryPhoneSelector = ({ countries, hide, disabled = true }) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const [countryField, countryMeta] = useField("country");
  const [phoneField, phoneMeta] = useField("phoneNumber");

  // Memoize options and avoid recreating on each render
  const filteredCountries = useMemo(() => countries || [], [countries]);

  const handleCountryChange = useCallback(
    (_, newValue) => {
      setFieldValue("country", newValue);
      setFieldValue("phoneNumber", ""); // Reset phone number on country change
    },
    [setFieldValue]
  );

  const handlePhoneNumberChange = useCallback(
    (e) => {
      const input = e.target.value;
      if (/^\d*$/.test(input)) {
        setFieldValue("phoneNumber", input); // Allow only digits
      }
    },
    [setFieldValue]
  );

  const renderCountryOption = useCallback(
    (props, option) => (
      <Box component="li" {...props}>
        <img
          loading="lazy"
          width="20"
          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
          alt=""
          style={{ marginRight: 12 }}
        />
        {option.name} ({option.dial_code})
      </Box>
    ),
    []
  );

  // Memoize the InputAdornment to avoid unnecessary re-renders
  const startAdornment = useMemo(() => {
    if (!values.country) return null;
    return (
      <InputAdornment position="start" sx={{ mr: 3 }}>
        <img
          loading="lazy"
          width="20"
          src={`https://flagcdn.com/w20/${values.country.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${values.country.code.toLowerCase()}.png 2x`}
          alt=""
          style={{ marginRight: 8 }}
        />
        ({values.country.dial_code})
      </InputAdornment>
    );
  }, [values.country]);

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      {!hide && (
        <Autocomplete
          id="country-select"
          options={filteredCountries}
          autoHighlight
          getOptionLabel={(option) => option.name}
          value={countryField.value}
          onChange={handleCountryChange}
          onBlur={countryField.onBlur}
          renderOption={renderCountryOption}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a country"
              error={countryMeta.touched && Boolean(countryMeta.error)}
              helperText={countryMeta.touched && countryMeta.error}
              fullWidth
              margin="normal"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
      )}

      <TextField
        label="Phone Number"
        name={phoneField.name}
        disabled={!disabled ? false : !values.country}
        value={phoneField.value}
        onChange={handlePhoneNumberChange}
        onBlur={phoneField.onBlur}
        error={phoneMeta.touched && Boolean(phoneMeta.error)}
        helperText={phoneMeta.touched && phoneMeta.error}
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{
          maxLength: values.country?.maxLength || undefined,
          inputMode: "numeric",
          pattern: "[0-9]*", // only numeric input
        }}
        InputProps={{
          startAdornment,
        }}
      />
    </Box>
  );
};

CountryPhoneSelector.propTypes = {
  countries: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
};

export default CountryPhoneSelector;
