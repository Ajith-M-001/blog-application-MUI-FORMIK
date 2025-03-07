import { CustomTextField } from "./CustomTextField";
import { memo } from "react";

const FormField = memo(({ fieldType, ...props }) => {
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
});

FormField.displayName = "FormField";

export { FormField };
