import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Lock, UserRound, LogIn } from "lucide-react"; // Import Lucide icons
import PropTypes from "prop-types";

const LoginDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = () => {
    onClose();
    navigate("/sign-in");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            textAlign: "center",
            py: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ py: 2 }}>
        <Box display="flex" justifyContent="center" mb={1}>
          <Lock
            size={48}
            color={theme.palette.primary.main}
            strokeWidth={1.5}
          />
        </Box>
        <Typography variant="h6" fontWeight="bold">
          Authentication Required
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box py={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <UserRound size={20} style={{ marginRight: 8 }} />
            <Typography variant="body1" fontWeight={500}>
              You need to be logged in to follow this author
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              backgroundColor: "action.hover",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogIn size={16} style={{ marginRight: 8 }} />
            Please log in or create an account to continue
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          px: 3,
          pt: 0,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            flex: 1,
            mr: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          endIcon={<LogIn size={18} />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            flex: 1,
            ml: 1,
          }}
        >
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;

LoginDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
