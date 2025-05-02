import { memo, useState } from "react";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowLeft,
  Eye,
  HelpCircle,
  LogOut,
  Send,
  Settings,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { useSignOutUser } from "../../../hooks/api/Users";
import { useShallow } from "zustand/react/shallow";
import useStore, {
  useUserActions,
  useUserData,
} from "../../../store/zustand.store";
import { showToast } from "../../../utils/toast";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";

const BlogHeader = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\/+/, ""); // Removes leading slashes

  const { mutate: signOut, isPending: isSignOutPending } = useSignOutUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Profile", icon: <User />, path: "/profile" },
    { label: "Settings", icon: <Settings />, path: "/settings" },
    { label: "Help", icon: <HelpCircle />, path: "/help" },
  ];

  const user = useUserData();
  const { clearUserData, setIsAuthenticated } = useUserActions();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: (data) => {
        navigate("/sign-in");
        setIsAuthenticated(false);
        clearUserData();
        showToast(data?.message, { type: "success" });
        handleUserMenuClose();
      },
    });
  };

  return (
    <Box
      position={"sticky"}
      top={0}
      zIndex={100}
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        sx={{
          maxWidth: "1100px",
          width: "100%",
          height: "80px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Link to="/">
          <Typography
            component={motion.p}
            variant="h3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              mr: 3,
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NEXUS
          </Typography>
        </Link>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {currentPath === "create-blog" && (
            <Button
              variant="contained"
              onClick={() => navigate("/preview-blog")}
              startIcon={<Eye size={18} />}
              sx={{
                textTransform: "capitalize",
                py: "4px",
                fontSize: "0.8rem",
                fontWeight: "400",
              }}
              size="small"
              color="secondary"
              disableElevation
            >
              Preview
            </Button>
          )}

          {currentPath === "preview-blog" && (
            <Box>
              <Button
                variant="outlined"
                onClick={() => navigate("/create-blog")}
                startIcon={<ArrowLeft size={18} />}
                sx={{
                  textTransform: "capitalize",
                  py: "3px",
                  fontSize: "0.8rem",
                  fontWeight: "400",
                }}
                size="small"
                color="secondary"
                disableElevation
              >
                Back
              </Button>{" "}
              <Button
                variant="contained"
                onClick={() => {}}
                startIcon={<Send size={16} />}
                sx={{
                  textTransform: "capitalize",
                  py: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "400",
                }}
                size="small"
                color="secondary"
                disableElevation
              >
                Publish
              </Button>
            </Box>
          )}

          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUserMenuOpen}
            sx={{
              p: 0,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            }}
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={user?.avatar?.url}
              alt={user?.firstName}
              sx={{ height: "2.3rem", width: "2.3rem" }}
            >
              {!user?.avatar?.url && user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            slotProps={{
              paper: {
                elevation: 2,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  mt: 1.5,
                  width: "16rem",
                  borderRadius: 1,
                  backgroundImage: "none",
                  backdropFilter: "blur(10px)",
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {capitalizeFirstLetter(user?.firstName)}{" "}
                {capitalizeFirstLetter(user?.lastName)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                premium member
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>

            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {item.icon}
                <Typography variant="body1">{item.label}</Typography>
              </MenuItem>
            ))}

            <Divider />

            <MenuItem
              disabled={isSignOutPending}
              onClick={handleSignOut}
              sx={{
                color: theme.palette.error.main,
                py: 1.5,
                px: 2,
                gap: 1.5,
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <LogOut />
              <Typography variant="body1">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Box>
  );
};

export default memo(BlogHeader);
