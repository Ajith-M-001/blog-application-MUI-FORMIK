import { useMemo, useCallback } from "react";
import { Box, Autocomplete, TextField, InputAdornment } from "@mui/material";
import { useField, useFormikContext } from "formik";
import PropTypes from "prop-types";

/**
 * @typedef {object} CountryOption
 * @property {string} code - The country code (e.g., "US").
 * @property {string} name - The name of the country (e.g., "United States").
 * @property {string} dial_code - The international dial code (e.g., "+1").
 * @property {number} [maxLength] - Optional max length for phone numbers in this country.
 */

/**
 * @typedef {object} CountryPhoneSelectorFormValues
 * @property {CountryOption | null} country - The selected country object.
 * @property {string} phoneNumber - The entered phone number.
 */

/**
 * CountryPhoneSelector component provides a country selection dropdown (Autocomplete)
 * and a phone number input field. It integrates with Formik for field values and validation.
 *
 * @component
 * @param {object} props - The component props.
 * @param {CountryOption[]} props.countries - Array of country objects to populate the selector.
 * @param {boolean} [props.hide=false] - If true, hides the country selector dropdown (phone input still visible).
 * @param {boolean} [props.disabled=true] - If true, phone number input is disabled until a country is selected. Set to false to always enable.
 * @returns {JSX.Element} The rendered country phone selector.
 * @example
 * <CountryPhoneSelector countries={allCountries} />
 */
const CountryPhoneSelector = ({ countries, hide, disabled = true }) => {
  const { values, setFieldValue } = useFormikContext();
  const [countryField, countryMeta] = useField("country");
  const [phoneField, phoneMeta] = useField("phoneNumber");

  // Memoize options and avoid recreating on each render
  const filteredCountries = useMemo(() => countries || [], [countries]);

  /**
   * Callback for when the selected country changes.
   * Updates Formik's 'country' field and resets 'phoneNumber'.
   * @param {React.SyntheticEvent} _ - The event source of the callback.
   * @param {CountryOption | null} newValue - The newly selected country object.
   */
  const handleCountryChange = useCallback(
    (_, newValue) => {
      setFieldValue("country", newValue);
      setFieldValue("phoneNumber", ""); // Reset phone number on country change
    },
    [setFieldValue]
  );

  /**
   * Callback for when the phone number input changes.
   * Allows only digits and updates Formik's 'phoneNumber' field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handlePhoneNumberChange = useCallback(
    (e) => {
      const input = e.target.value;
      if (/^\d*$/.test(input)) {
        setFieldValue("phoneNumber", input); // Allow only digits
      }
    },
    [setFieldValue]
  );

  /**
   * Custom renderer for options in the Autocomplete dropdown.
   * Displays the country flag, name, and dial code.
   * @param {object} props - Props to apply to the list item.
   * @param {CountryOption} option - The country option to render.
   * @returns {JSX.Element} The rendered list item.
   */
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
