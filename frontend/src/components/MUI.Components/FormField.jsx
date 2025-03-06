import { CustomTextField } from "./CustomTextField";

const FormField = ({ fieldType, ...props }) => {
  console.log("checking");
  switch (fieldType) {
    case "autocomplete":
      return <FormAutocomplete {...props} />;
    case "checkbox":
      return <FormCheckbox {...props} />;
    case "radio":
      return <FormRadioGroup {...props} />;
    case "date":
      return <FormDatePicker {...props} />;
    default:
      return <CustomTextField fieldType={fieldType} {...props} />;
  }
};

export { FormField };
