/* eslint-disable react/prop-types */
import { memo, useEffect, useRef } from "react";
import { TextField } from "@mui/material";

const MUITextArea1 = ({ label, name, id, minRows = 3, ...props }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log(`MUITextArea1 [${name}] rendered ${renderCount.current} times`);
  });

  return (
    <TextField
      fullWidth
      multiline
      minRows={minRows}
      label={label}
      id={id}
      name={name}
      margin="normal"
      variant="outlined"
      {...props}
    />
  );
};

export default memo(MUITextArea1);
