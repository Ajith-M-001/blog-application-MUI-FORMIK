import { CustomTextField } from "./CustomTextField";
import { memo } from "react";
// Assume FormAutocomplete, FormCheckbox, FormRadioGroup, FormDatePicker are imported or defined elsewhere if used.
// For this task, we'll focus on the CustomTextField case as others are not provided.

/**
 * FormField is a generic wrapper component that renders different types of
 * form input fields based on the `fieldType` prop. It acts as a dispatcher
 * to specific field components like `CustomTextField`, `FormAutocomplete`, etc.
 *
 * @component
 * @param {object} props - The component props.
 * @param {'text' | 'email' | 'password' | 'number' | 'autocomplete' | 'checkbox' | 'radio' | 'date' | string} props.fieldType - The type of form field to render.
 * @param {string} props.name - The name of the field (used by Formik).
 * @param {string} [props.label] - The label for the form field.
 * // Other props are passed down to the specific field component.
 * @returns {JSX.Element} The rendered form field component.
 * @example
 * <FormField fieldType="text" name="firstName" label="First Name" />
 * <FormField fieldType="password" name="password" label="Password" />
 */
const FormField = memo(({ fieldType, ...props }) => {
  switch (fieldType) {
    // case "autocomplete":
    //   return <FormAutocomplete {...props} />;
    // case "checkbox":
    //   return <FormCheckbox {...props} />;
    // case "radio":
    //   return <FormRadioGroup {...props} />;
    // case "date":
    //   return <FormDatePicker {...props} />;
    default:
      // This will handle 'text', 'email', 'password', 'number', etc.
      return <CustomTextField fieldType={fieldType} {...props} />;
  }
});

FormField.displayName = "FormField";

export { FormField };
