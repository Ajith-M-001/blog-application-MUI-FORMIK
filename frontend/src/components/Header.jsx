import {
  alpha,
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { motion } from "motion/react";
import {
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import useStore from "../store/zustand.store";
import { useShallow } from "zustand/react/shallow";
import { buttonHoverVariants } from "../utils/motionVariants";
import { Link, NavLink, useNavigate } from "react-router";
import { useSignOutUser } from "../hooks/api/Users";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { showToast } from "../utils/toast";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 50,
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.grey[300], 0.5)
      : alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.grey[200], 0.95)
        : alpha(theme.palette.common.white, 0.25),
  },
  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  boxShadow:
    theme.palette.mode === "light" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
  width: "100%",
  marginLeft: 0,
  marginRight: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.4),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  // left: theme.spacing(1),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 2, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "15ch",
    },
    [theme.breakpoints.up("laptop")]: {
      width: "20ch",
    },
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  console.log("asfsdfsdf", useStore);

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
    isDarkTheme,
    toggleTheme,
    isAuthenticated,
    user,
    clearUser,
    setIsAuthenticated,
  } = useStore(
    useShallow((state) => ({
      isDarkTheme: state.isDarkTheme,
      toggleTheme: state.toggleTheme,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      clearUser: state.clearUser,
      setIsAuthenticated: state.setIsAuthenticated,
    }))
  );

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: (data) => {
        handleUserMenuClose();
        clearUser();
        setIsAuthenticated(false);
        showToast(data?.message, { type: "success" });
        navigate("/sign-in");
      },
    });
  };

  const navItems = [
    // { label: "Blogs", path: "blogs" },
    // { label: "Categories", path: "categories" },
    // { label: "Tags", path: "tags" },
    // { label: "Popular", path: "popular" },
    { label: "Pricing", path: "pricing" },
    { label: "About", path: "about" },
    { label: "Contact", path: "contact" },
  ];

  const navItemVariants = {
    initial: {
      color: theme.palette.text.primary,
    },
    hover: {
      color: theme.palette.primary.main,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const underlineVariants = {
    initial: {
      scaleX: 0,
      opacity: 0,
      transformOrigin: "center",
    },
    hover: {
      scaleX: 1,
      opacity: 1,
    },
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target[0].value;
    console.log("Search", searchQuery);
  };

  return (
    <>
      <AppBar
        component={motion.div}
        position="fixed"
        elevation={1}
        color="transparent"
        sx={{
          background: "none",
          boxShadow: "none",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
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

            {isMobile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <IconButton
                    component={motion.button}
                    color="inherit"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={toggleTheme}
                    aria-label={
                      isDarkTheme
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {isDarkTheme ? <Sun /> : <Moon />}
                  </IconButton>
                </Box>
                <IconButton
                  component={motion.button}
                  whileTap={{ scale: 0.9 }}
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  sx={{
                    display: { xs: "block", laptop: "none" },
                  }}
                  onClick={toggleMobileMenu}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <Box
                  component={motion.nav}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {navItems.map((item, index) => (
                    <Box
                      key={item.label}
                      sx={{
                        position: "relative",
                        marginRight: theme.spacing(1),
                      }}
                      onMouseEnter={() => setActiveItem(index)}
                      onMouseLeave={() => setActiveItem(null)}
                    >
                      <NavLink to={item.path}>
                        <Typography
                          component={motion.p}
                          initial="initial"
                          animate={activeItem === index ? "hover" : "initial"}
                          variants={navItemVariants}
                          sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                            paddingX: { xs: 1, laptop: 2 },
                            paddingBottom: theme.spacing(0.9),
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          {item.label}
                        </Typography>
                        <motion.div
                          initial="initial"
                          animate={activeItem === index ? "hover" : "initial"}
                          variants={underlineVariants}
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: 2,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 50,
                          }}
                        />
                      </NavLink>
                    </Box>
                  ))}
                </Box>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SearchContainer>
                    <SearchIconWrapper>
                      <Search />
                    </SearchIconWrapper>
                    <form onSubmit={handleSearch}>
                      <StyledInputBase
                        placeholder="Search blog posts..."
                        inputProps={{ "aria-label": "search" }}
                      />
                    </form>
                  </SearchContainer>
                </Box>

                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={3}
                >
                  <IconButton
                    component={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    color="inherit"
                    onClick={toggleTheme}
                    aria-label={
                      isDarkTheme
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {isDarkTheme ? <Sun /> : <Moon />}
                  </IconButton>
                  {isAuthenticated ? (
                    <>
                      <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUserMenuOpen}
                        sx={{
                          p: 0,
                          border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.5
                          )}`,
                        }}
                        aria-controls={open ? "user-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar
                          src={user?.data?.avatar?.url}
                          alt={user?.data?.firstName}
                          sx={{
                            height: "2.3rem",
                            width: "2.3rem",
                            background: user?.data?.avatar?.url
                              ? "transparent"
                              : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          }}
                        >
                          {!user?.data?.avatar?.url &&
                            user?.data?.firstName.charAt(0).toUpperCase()}
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
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                              mt: 1.5,
                              width: "16rem",
                              borderRadius: 1,
                              backgroundImage: "none",
                              backdropFilter: "blur(10px)",
                              backgroundColor: alpha(
                                theme.palette.background.paper,
                                0.95
                              ),
                              border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.1
                              )}`,
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
                            {capitalizeFirstLetter(user?.data?.firstName)}{" "}
                            {capitalizeFirstLetter(user?.data?.lastName)}
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
                            <Typography variant="body1">
                              {item.label}
                            </Typography>
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
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.08
                              ),
                            },
                          }}
                        >
                          <LogOut />
                          <Typography variant="body1">Sign Out</Typography>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Link to={"sign-in"}>
                        <Button
                          component={motion.button}
                          whileHover={"hover"}
                          whileTap={{ scale: 0.9 }}
                          variant="outlined"
                          color="secondary"
                          variants={buttonHoverVariants}
                          sx={{
                            [theme.breakpoints.down("laptop")]: {
                              borderRadius: 35,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              padding: "6px 12px",
                            },
                          }}
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link to={"sign-up"}>
                        <Button
                          component={motion.button}
                          whileHover={"hover"}
                          whileTap={{ scale: 0.9 }}
                          variant="contained"
                          color="primary"
                          variants={buttonHoverVariants}
                          sx={{
                            [theme.breakpoints.down("laptop")]: {
                              borderRadius: 35,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              padding: "6px 12px",
                            },
                          }}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Backdrop for blurring background when the drawer is open */}
      {isMobile && (
        <Backdrop
          open={mobileMenuOpen}
          onClick={toggleMobileMenu}
          sx={{
            display: { xs: "block", md: "none" },
            zIndex: theme.zIndex.drawer - 1,
            backdropFilter: "blur(2px)", // Apply blur effect
            backgroundColor: alpha(theme.palette.background.default, 0.1), // Add opacity to dim the background
          }}
        />
      )}

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: "300px",
            background: alpha(theme.palette.background.paper, 0.98),
            // backdropFilter: "blur(10px)",
            display: { xs: "block", md: "none" },
          },
        }}
      >
        <Box component={motion.div} sx={{ p: 2 }} layout>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEXUS
            </Typography>
            <IconButton onClick={toggleMobileMenu}>
              <X />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {isAuthenticated && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ mb: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={user?.data?.avatar?.url}
                  alt={user?.data?.firstName}
                  sx={{
                    height: "3rem",
                    width: "3rem",
                    mr: 2,
                    background: user?.data?.avatar?.url
                      ? "transparent"
                      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {!user?.data?.avatar?.url &&
                    user?.data?.firstName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {capitalizeFirstLetter(user?.data?.firstName)}{" "}
                    {capitalizeFirstLetter(user?.data?.lastName)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    premium member
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Box>
          )}

          {/* Mobile Search */}
          <Box sx={{ my: 2 }}>
            <SearchContainer>
              <SearchIconWrapper>
                <Search />
              </SearchIconWrapper>
              <form onSubmit={handleSearch}>
                <StyledInputBase
                  placeholder="Search blog posts..."
                  inputProps={{ "aria-label": "search" }}
                />
              </form>
            </SearchContainer>
          </Box>

          <List component={motion.ul}>
            {navItems.map((item, index) => (
              <ListItem
                button
                key={item}
                component={motion.li}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 * index }}
                onClick={toggleMobileMenu}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {isAuthenticated ? (
            <>
              <Divider />
              {menuItems.map((item, index) => (
                <ListItem
                  key={item.label}
                  button
                  component={motion.li}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + 0.1 * index }}
                  onClick={() => {
                    toggleMobileMenu();
                    navigate(item.path);
                  }}
                  sx={{
                    borderRadius: "8px",
                    mb: 1,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                    {item.icon}
                  </Box>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}

              <ListItem
                button
                component={motion.li}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                disabled={isSignOutPending}
                onClick={handleSignOut}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                  },
                }}
              >
                <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                  <LogOut />
                </Box>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </>
          ) : (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Link to={"sign-in"}>
                <Button
                  onClick={toggleMobileMenu}
                  variant="outlined"
                  fullWidth
                  component={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.9 }}
                  color="secondary"
                >
                  Sign In
                </Button>
              </Link>
              <Link to={"sign-up"}>
                <Button
                  onClick={toggleMobileMenu}
                  variant="contained"
                  fullWidth
                  component={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.9 }}
                  color="primary"
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export { Header };
