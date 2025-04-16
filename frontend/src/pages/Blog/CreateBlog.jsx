import useStore from "../../store/zustand.store";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "motion/react";
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
import { Footer } from "../../components/Footer";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useSignOutUser } from "../../hooks/api/Users";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { Eye, HelpCircle, LogOut, Settings, User } from "lucide-react";
import { showToast } from "../../utils/toast";

const CreateBlog = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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

  const {
    blog,
    setBlogData,
    clearBlogData,
    clearUser,
    user,
    setIsAuthenticated,
  } = useStore(
    useShallow((state) => ({
      blog: state.blog,
      setBlogData: state.setBlogData,
      clearBlogData: state.clearBlogData,
      clearUser: state.clearUser,
      user: state.user,
      setIsAuthenticated: state.setIsAuthenticated,
    }))
  );

  // Now you can use the blog data and actions in your component
  console.log(
    "Current blog title:",
    blog,
    setBlogData,
    clearBlogData,
    clearUser,
    user
  );

  // Example function to update blog data

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: (data) => {
        navigate("/sign-in");
        setIsAuthenticated(false);
        clearUser();
        showToast(data?.message, { type: "success" });
        handleUserMenuClose();
      },
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="create-blog"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
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
              <Button
                variant="outlined"
                onClick={() => navigate("/preview-blog")}
                startIcon={<Eye />}
                sx={{ textTransform: "capitalize" }}
                size="small"
                color="primary"
                disableElevation
              >
                Preview
              </Button>
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
                  sx={{
                    height: "2.3rem",
                    width: "2.3rem",
                  }}
                >
                  {!user?.avatar?.url &&
                    user?.firstName.charAt(0).toUpperCase()}
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
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.95
                      ),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    },
                  },
                }}
                transformOrigin={{
                  horizontal: "right",
                  vertical: "top",
                }}
                anchorOrigin={{
                  horizontal: "right",
                  vertical: "bottom",
                }}
              >
                {/* Header section */}
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

                {/* Menu items */}
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleUserMenuOpen(item.path)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      gap: 1.5,
                      display: "flex",
                      alignItems: "center",
                      transition: "background-color 0.3s ease", // Smooth transitions
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                      },
                    }}
                  >
                    {item.icon}
                    <Typography variant="body1">{item.label}</Typography>
                  </MenuItem>
                ))}

                <Divider />

                {/* Sign out button */}
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
                    transition: "background-color 0.3s ease", // Smooth transitions
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

        <Box
          sx={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            height: `calc(100vh - (80px + 61px))`,
            px: 2,
          }}
        >
          <h1>Create Blog</h1>
          <p>Current title: {blog?.title}</p>
        </Box>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlog;
