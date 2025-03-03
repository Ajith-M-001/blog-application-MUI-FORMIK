import {
  alpha,
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";
import { styled } from "@mui/material/styles";

// Create motion components
const MotionButton = motion(Button);
const MotionBox = motion(Box);

// Styled search component
const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const Header = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeItem, setActiveItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    "Blogs",
    "Categories",
    "Tags",
    "Popular",
    "Pricing",
    "About",
    "Contact",
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Animation variants for navigation items
  const navItemVariants = {
    initial: {
      color: theme.palette.text.primary,
    },
    hover: {
      color: theme.palette.primary.main,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Animation variants for the underline
  const underlineVariants = {
    initial: {
      width: 0,
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
    hover: {
      width: "100%",
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Animation variants for button hover
  const buttonHoverVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <Box component={"header"} sx={{ flexGrow: 1 }}>
      <AppBar
        component={motion.div}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        color="transparent"
        sx={{
          background: "none",
          boxShadow: "none",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
        }}
        position="fixed"
        elevation={3}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo */}
            <Typography
              component={motion.div}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              variant="h4"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mr: 3,
              }}
            >
              NEXUS
            </Typography>

            {isMobile ? (
              <>
                {/* Search for mobile */}
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  sx={{ flexGrow: 1, mr: 1, maxWidth: "60%" }}
                >
                  <SearchWrapper>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search..."
                      inputProps={{ "aria-label": "search" }}
                    />
                  </SearchWrapper>
                </MotionBox>

                {/* Theme toggle for mobile */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  sx={{ mr: 1 }}
                >
                  <IconButton
                    onClick={toggleDarkMode}
                    component={motion.button}
                    whileTap={{ scale: 0.9 }}
                    color="inherit"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </MotionBox>

                {/* Mobile menu button */}
                <IconButton
                  component={motion.button}
                  whileTap={{ scale: 0.9 }}
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleMobileMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                    color: theme.palette.text.primary,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <>
                {/* Desktop Navigation */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                  sx={{ display: "flex", flexGrow: 1 }}
                >
                  {navItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        marginRight: theme.spacing(1),
                      }}
                      onMouseEnter={() => setActiveItem(index)}
                      onMouseLeave={() => setActiveItem(null)}
                    >
                      <MotionButton
                        initial="initial"
                        animate={activeItem === index ? "hover" : "initial"}
                        variants={navItemVariants}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 500,
                          paddingX: 2,
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {item}
                      </MotionButton>
                      <motion.div
                        initial="initial"
                        animate={activeItem === index ? "hover" : "initial"}
                        variants={underlineVariants}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Search bar */}
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  sx={{ mr: 2 }}
                >
                  <SearchWrapper>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search blogs..."
                      inputProps={{ "aria-label": "search" }}
                    />
                  </SearchWrapper>
                </MotionBox>

                {/* Theme toggle */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  sx={{ mr: 2 }}
                >
                  <IconButton
                    onClick={toggleDarkMode}
                    component={motion.button}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    color="inherit"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </MotionBox>

                {/* Auth buttons */}
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  sx={{ display: "flex", gap: 1 }}
                >
                  <MotionButton
                    variant="outlined"
                    initial="initial"
                    whileHover="hover"
                    variants={buttonHoverVariants}
                    color="primary"
                    sx={{ borderRadius: "8px" }}
                  >
                    Sign In
                  </MotionButton>
                  <MotionButton
                    variant="contained"
                    color="primary"
                    initial="initial"
                    whileHover="hover"
                    variants={buttonHoverVariants}
                    sx={{ borderRadius: "8px" }}
                  >
                    Sign Up
                  </MotionButton>
                </MotionBox>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

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
            backdropFilter: "blur(10px)",
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
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List component={motion.ul}>
            {navItems.map((item, index) => (
              <ListItem
                button
                key={item}
                component={motion.li}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                onClick={toggleMobileMenu}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Button
              variant="outlined"
              fullWidth
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              color="primary"
              sx={{ borderRadius: "8px" }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              fullWidth
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              color="primary"
              sx={{ borderRadius: "8px" }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export { Header };
