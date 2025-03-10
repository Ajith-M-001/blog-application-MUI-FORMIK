import { Box, Autocomplete, TextField, InputAdornment } from "@mui/material";
import { useField, useFormikContext } from "formik";

const CountryPhoneSelector = (props) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const [countryField, countryMeta] = useField("country");
  const [phoneField, phoneMeta] = useField("phoneNumber");

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Autocomplete
        id="country-select"
        options={props?.countries}
        autoHighlight
        getOptionLabel={(option) => option.name}
        value={values.country}
        onChange={(_, newValue) => {
          setFieldValue("country", newValue);
          setFieldValue("phoneNumber", "");
        }}
        onBlur={() => setFieldTouched("country", true)}
        renderOption={(props, option) => (
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
        )}
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
              autoComplete: "new-password",
            }}
          />
        )}
      />

      <TextField
        label="Phone Number"
        name="phoneNumber"
        value={values.phoneNumber}
        disabled={!values.country}
        onChange={(e) => {
          const input = e.target.value;
          // Only allow digits
          if (/^\d*$/.test(input)) {
            setFieldValue("phoneNumber", input);
          }
        }}
        onBlur={() => setFieldTouched("phoneNumber", true)}
        error={phoneMeta.touched && Boolean(phoneMeta.error)}
        helperText={phoneMeta.touched && phoneMeta.error}
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{
          maxLength: values.country?.maxLength || undefined,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        InputProps={{
          startAdornment: values.country && (
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
          ),
        }}
      />
    </Box>
  );
};

export default CountryPhoneSelector;
