import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";

const LinkDialog = ({
  editor,
  open,
  onClose,
  linkUrl,
  setLinkUrl,
  handleSaveLink,
}) => {
  useEffect(() => {
    if (open && editor) {
      const previousUrl = editor.getAttributes("link").href || "";
      setLinkUrl(previousUrl);
    }
  }, [editor, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Insert Link</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="URL"
          type="url"
          fullWidth
          variant="outlined"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </DialogContent>
      <DialogActions>
        {editor.isActive("link") && (
          <Button
            onClick={() => {
              editor.chain().focus().unsetLink().run();
              onClose();
            }}
            color="error"
          >
            Remove Link
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveLink} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LinkDialog.propTypes = {
  editor: PropTypes.shape({
    isActive: PropTypes.func.isRequired,
    chain: PropTypes.func.isRequired,
    getAttributes: PropTypes.func.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  linkUrl: PropTypes.string.isRequired,
  setLinkUrl: PropTypes.func.isRequired,
  handleSaveLink: PropTypes.func.isRequired,
};

export default LinkDialog;
