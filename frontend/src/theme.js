// theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

// Common base theme settings
const baseTheme = createTheme({
  typography: {
    fontFamily:
      '"Inter Variable", "Open Sans Variable", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    h1: {
      fontSize: "2.5rem", // 40px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontSize: "2rem", // 32px
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: "1.75rem", // 28px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.5rem", // 24px
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1rem", // 16px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0.0075em",
    },
    body1: {
      fontSize: "1rem", // 16px
      lineHeight: 1.6,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem", // 14px
      lineHeight: 1.6,
      letterSpacing: "0.01071em",
    },
    subtitle1: {
      fontSize: "1rem", // 16px
      lineHeight: 1.6,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem", // 14px
      lineHeight: 1.6,
      letterSpacing: "0.01071em",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.66,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 500,
      letterSpacing: "0.0938em",
      lineHeight: 2.5,
      textTransform: "uppercase",
    },
    button: {
      fontSize: "0.875rem",
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      laptop: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: "background-color 0.35s ease, color 0.35s ease",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          scrollBehavior: "smooth",
        },
        "*, *::before, *::after": {
          boxSizing: "inherit",
        },
        a: {
          color: "#3b82f6",
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": { color: "#2563eb" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          maxWidth: {
            xs: "100%", // Full width for mobile
            sm: "540px", // Small tablets
            md: "720px", // Tablets
            laptop: "960px", // Custom laptop breakpoint (1024px)
            lg: "1200px", // Laptops
            xl: "1536px", // Desktops
          },
          marginLeft: "auto",
          marginRight: "auto",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px 24px",
          borderRadius: 25,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      defaultProps: { disableElevation: true },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontWeight: 500,
          transition: "opacity 0.3s ease",
          "&:hover": { opacity: 0.8 },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "box-shadow 0.3s ease",
          "&:hover": { boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "currentColor",
          },
        },
      },
    },
  },
});

// Create the Light theme by merging palette overrides with the base theme
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1A2B3C",
      light: "#485563",
      dark: "#152230",
      contrastText: "#ffffff",
    },
    error: { main: "#f44336" },
    warning: { main: "#ff9800" },
    info: { main: "#2196f3" },
    success: { main: "#4caf50" },
    background: {
      default: "#ccc",
      paper: "#ffffff",
      card: "#fafafa",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#4a4a4a",
      disabled: "#888888",
    },
    divider: "#cccccc",
    action: {
      active: "#3498db",
      hover: "#3498db14", // rgba(52, 152, 219, 0.08)
      selected: "#3498db29", // rgba(52, 152, 219, 0.16)
      disabled: "#888888",
      disabledBackground: "#0000001F", // rgba(0, 0, 0, 0.12)
    },
  },
});

// Create the Dark theme by merging palette overrides with the base theme
const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E5E5E5",
      light: "#F0F0F0",
      dark: "#D1D5DB",
      contrastText: "#1A1A1A",
    },
    error: { main: "#f44336" },
    warning: { main: "#ffa726" },
    info: { main: "#29b6f6" },
    success: { main: "#66bb6a" },
    background: {
      default: "#1a1a1a",
      paper: "#242424",
      card: "#222222",
    },
    text: {
      primary: "#e5e5e5",
      secondary: "#b0b0b0",
      disabled: "#888888",
    },
    divider: "#374151",
    action: {
      active: "#3498db",
      hover: "#3498db33", // rgba(52, 152, 219, 0.2)
      selected: "#3498db4d", // rgba(52, 152, 219, 0.3)
      disabled: "#888888",
      disabledBackground: "#ffffff1F", // rgba(255, 255, 255, 0.12)
    },
  },
});

// Apply responsive typography adjustments to both themes
const responsiveLightTheme = responsiveFontSizes(lightTheme);
const responsiveDarkTheme = responsiveFontSizes(darkTheme);

export { responsiveLightTheme as lightTheme, responsiveDarkTheme as darkTheme };
