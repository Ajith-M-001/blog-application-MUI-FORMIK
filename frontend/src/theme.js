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
      styleOverrides: (theme) => ({
        body: {
          scrollBehavior: "smooth",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          height: "100%",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: theme.palette.background.card,
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.divider,
            borderRadius: "4px",
            "&:hover": {
              background: theme.palette.text.disabled,
            },
          },
        },
        "*, *::before, *::after": {
          boxSizing: "inherit",
          margin: 0,
          padding: 0,
        },
        html: {
          WebkitTextSizeAdjust: "100%",
          height: "100%",
        },
        "img, picture, video, canvas, svg": {
          display: "block",
          maxWidth: "100%",
        },
        "p, h1, h2, h3, h4, h5, h6": {
          overflowWrap: "break-word",
        },
        a: {
          color: theme.palette.mode === "light" ? "#003F7A" : "#85C4FF",
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": {
            textDecoration: "underline",
            color: theme.palette.mode === "light" ? "#012b52" : "#68A5FA",
          },
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 35,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "8px 20px",
        },
      },
    },
  },
});

// Create the Light theme by merging palette overrides with the base theme
const lightPalette = {
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
      default: "#fafaf9", // Very light blue tint
      paper: "#ffffff", // Pure white
      card: "#f1f5f9", // Light blue tint
      secondary: "#616161",
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
};

// Create the Dark theme by merging palette overrides with the base theme
const darkPalette = {
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
      default: "#121212", // Base dark surface
      paper: "#1E1E1E", // Elevated surfaces
      card: "#252525", // For cards and intermediate surfaces
      secondary: "#757575",
    },
    text: {
      primary: "#f3f4f6", // Very light gray
      secondary: "#d1d5db", // Light gray
      disabled: "#6b7280", // Medium gray
    },
    divider: "#4b5563", // Dark gray
    action: {
      active: "#3498db",
      hover: "#3498db33", // rgba(52, 152, 219, 0.2)
      selected: "#3498db4d", // rgba(52, 152, 219, 0.3)
      disabled: "#888888",
      disabledBackground: "#ffffff1F", // rgba(255, 255, 255, 0.12)
    },
  },
};

const lightThemeMerged = createTheme(deepmerge(baseTheme, lightPalette));

const darkThemeMerged = createTheme(deepmerge(baseTheme, darkPalette));

// Apply responsive typography adjustments to both themes
const responsiveLightTheme = responsiveFontSizes(lightThemeMerged);
const responsiveDarkTheme = responsiveFontSizes(darkThemeMerged);

export { responsiveLightTheme as lightTheme, responsiveDarkTheme as darkTheme };
