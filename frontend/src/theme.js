<<<<<<< HEAD
// theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

// Common base theme settings
const baseTheme = createTheme({
  typography: {
    fontFamily:
      '"Inter Variable", "Open Sans Variable", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
=======
// import { createTheme, responsiveFontSizes } from "@mui/material/styles";
// import { red, grey, blueGrey } from "@mui/material/colors";

// // Your custom color palette
// const customColors = {
//   orange: "#fca311",
//   darkBlue: "#14213d",
//   lightGrey: "#e5e5e5",
//   darkCharcoal: "#1A1A1A",
//   offWhite: "#F8F9FA",
// };

// // Common theme settings
// const baseTheme = createTheme({
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontSize: "2.5rem",
//       fontWeight: 700,
//       lineHeight: 1.2,
//     },
//     h2: {
//       fontSize: "2rem",
//       fontWeight: 600,
//       lineHeight: 1.3,
//     },
//     h3: {
//       fontSize: "1.75rem",
//       fontWeight: 600,
//       lineHeight: 1.3,
//     },
//     h4: {
//       fontSize: "1.5rem",
//       fontWeight: 500,
//       lineHeight: 1.4,
//     },
//     h5: {
//       fontSize: "1.25rem",
//       fontWeight: 500,
//       lineHeight: 1.4,
//     },
//     h6: {
//       fontSize: "1rem",
//       fontWeight: 500,
//       lineHeight: 1.4,
//     },
//     body1: {
//       fontSize: "1rem",
//       lineHeight: 1.5,
//     },
//     body2: {
//       fontSize: "0.875rem",
//       lineHeight: 1.5,
//     },
//     subtitle1: {
//       fontSize: "1rem",
//       fontWeight: 500,
//     },
//     subtitle2: {
//       fontSize: "0.875rem",
//       fontWeight: 500,
//     },
//   },
//   shape: {
//     borderRadius: 8,
//   },
//   spacing: 8,
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 900,
//       laptop: 1024,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         body: {
//           transition: "background-color 0.35s ease, color 0.35s ease",
//           scrollBehavior: "smooth",
//         },
//         a: {
//           textDecoration: "none",
//         },
//         "::selection": {
//           backgroundColor: customColors.orange,
//           color: customColors.offWhite,
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           padding: "12px 24px",
//           borderRadius: 25,
//           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//           fontWeight: 500,
//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
//           },
//           "&:active": {
//             transform: "translateY(0)",
//           },
//         },
//         containedPrimary: {
//           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//         },
//         outlinedPrimary: {
//           borderWidth: "2px",
//           "&:hover": {
//             borderWidth: "2px",
//           },
//         },
//       },
//       defaultProps: {
//         disableElevation: true,
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//           overflow: "hidden",
//           transition: "transform 0.3s ease, box-shadow 0.3s ease",
//           "&:hover": {
//             transform: "translateY(-5px)",
//             boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
//           },
//         },
//       },
//     },
//     MuiCardContent: {
//       styleOverrides: {
//         root: {
//           padding: 24,
//           "&:last-child": {
//             paddingBottom: 24,
//           },
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           fontWeight: 500,
//         },
//       },
//     },
//     MuiLink: {
//       defaultProps: {
//         underline: "hover",
//       },
//       styleOverrides: {
//         root: {
//           transition: "color 0.2s ease",
//           fontWeight: 500,
//         },
//       },
//     },
//     MuiInputBase: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//         },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderColor: customColors.orange,
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderWidth: 2,
//           },
//         },
//         notchedOutline: {
//           transition: "border-color 0.3s ease",
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundImage: "none",
//         },
//         elevation1: {
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
//         },
//       },
//     },
//     MuiMenuItem: {
//       styleOverrides: {
//         root: {
//           minHeight: 48,
//         },
//       },
//     },
//     MuiTabs: {
//       styleOverrides: {
//         indicator: {
//           height: 3,
//           borderTopLeftRadius: 3,
//           borderTopRightRadius: 3,
//         },
//       },
//     },
//     MuiDivider: {
//       styleOverrides: {
//         root: {
//           margin: "24px 0",
//         },
//       },
//     },
//   },
// });

// // Light theme
// const lightTheme = createTheme({
//   ...baseTheme,
//   palette: {
//     mode: "light",
//     primary: {
//       main: customColors.darkBlue,
//       light: "#2e3e61",
//       dark: "#0a1428",
//       contrastText: "#FFFFFF",
//     },
//     secondary: {
//       main: customColors.orange,
//       light: "#fdb644",
//       dark: "#d88c0a",
//       contrastText: customColors.darkBlue,
//     },
//     error: {
//       main: red[500],
//       light: red[300],
//       dark: red[700],
//     },
//     warning: {
//       main: "#ff9800",
//       light: "#ffb74d",
//       dark: "#f57c00",
//     },
//     info: {
//       main: "#2196f3",
//       light: "#64b5f6",
//       dark: "#1976d2",
//     },
//     success: {
//       main: "#4caf50",
//       light: "#81c784",
//       dark: "#388e3c",
//     },
//     grey: grey,
//     background: {
//       default: customColors.offWhite,
//       paper: "#FFFFFF",
//       card: customColors.lightGrey,
//     },
//     text: {
//       primary: customColors.darkBlue,
//       secondary: "#4B5563",
//       disabled: "#9CA3AF",
//     },
//     divider: customColors.lightGrey,
//     action: {
//       active: customColors.darkBlue,
//       hover: "rgba(20, 33, 61, 0.04)",
//       selected: "rgba(20, 33, 61, 0.08)",
//       disabled: "rgba(20, 33, 61, 0.26)",
//       disabledBackground: "rgba(20, 33, 61, 0.12)",
//     },
//   },
// });

// // Dark theme
// const darkTheme = createTheme({
//   ...baseTheme,
//   palette: {
//     mode: "dark",
//     primary: {
//       main: customColors.orange,
//       light: "#fdb644",
//       dark: "#d88c0a",
//       contrastText: customColors.darkCharcoal,
//     },
//     secondary: {
//       main: "#4B6BFB", // A complementary blue for dark mode
//       light: "#6C8DFF",
//       dark: "#3451D1",
//       contrastText: "#FFFFFF",
//     },
//     error: {
//       main: red[400],
//       light: red[300],
//       dark: red[500],
//     },
//     warning: {
//       main: "#ffa726",
//       light: "#ffb74d",
//       dark: "#f57c00",
//     },
//     info: {
//       main: "#29b6f6",
//       light: "#4fc3f7",
//       dark: "#0288d1",
//     },
//     success: {
//       main: "#66bb6a",
//       light: "#81c784",
//       dark: "#388e3c",
//     },
//     grey: grey,
//     background: {
//       default: customColors.darkCharcoal,
//       paper: "#2A2A2A",
//       card: "#222222",
//     },
//     text: {
//       primary: customColors.offWhite,
//       secondary: "#9CA3AF",
//       disabled: "#6B7280",
//     },
//     divider: "rgba(229, 229, 229, 0.12)",
//     action: {
//       active: customColors.lightGrey,
//       hover: "rgba(229, 229, 229, 0.08)",
//       selected: "rgba(229, 229, 229, 0.16)",
//       disabled: "rgba(229, 229, 229, 0.3)",
//       disabledBackground: "rgba(229, 229, 229, 0.12)",
//     },
//   },
//   components: {
//     ...baseTheme.components,
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#2A2A2A",
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
//           "&:hover": {
//             boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundImage: "none",
//         },
//         elevation1: {
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
//         },
//       },
//     },
//   },
// });

// // Apply responsive typography
// const responsiveLightTheme = responsiveFontSizes(lightTheme);
// const responsiveDarkTheme = responsiveFontSizes(darkTheme);

// export { responsiveLightTheme as lightTheme, responsiveDarkTheme as darkTheme };

import { createTheme } from "@mui/material/styles";
import { red, grey, blueGrey } from "@mui/material/colors";

// Base theme configuration (shared across light and dark themes)
const baseTheme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16, // Base font size for rem scalability
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
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
<<<<<<< HEAD
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
=======
    button: {
      fontWeight: 600,
      letterSpacing: "0.02857em",
    },
  },
  shape: {
    borderRadius: 8, // Consistent rounding for modern design
  },
  spacing: 8, // Default MUI spacing unit
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
<<<<<<< HEAD
      laptop: 1024,
=======
      laptop: 1024, // Custom breakpoint
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
<<<<<<< HEAD
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
=======
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
<<<<<<< HEAD
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
=======
          padding: "10px 20px",
          borderRadius: 25,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)", // Subtle lift on hover
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          },
        },
        contained: {
          boxShadow: "none", // Flat design trend
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      defaultProps: {
        disableElevation: true,
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
<<<<<<< HEAD
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
=======
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", // Softer shadow
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          transition: "color 0.2s ease",
        },
      },
      defaultProps: {
        underline: "hover",
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: "background-color 0.3s ease, color 0.3s ease",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          "& *": {
            boxSizing: "inherit",
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
          },
        },
      },
    },
  },
});

<<<<<<< HEAD
// Create the Light theme by merging palette overrides with the base theme
=======
// Light Theme
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
<<<<<<< HEAD
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
=======
      main: "#FCA311", // Vibrant orange for buttons, accents
      light: "#FFC107", // Slightly lighter orange
      dark: "#E68A00", // Darker orange
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#14213D", // Deep navy for headers, links
      light: "#2A4066", // Lighter navy
      dark: "#0D1A2E", // Darker navy
      contrastText: "#F8F9FA",
    },
    background: {
      default: "#F8F9FA", // Off-white for main background
      paper: "#FFFFFF", // Pure white for cards, modals
    },
    text: {
      primary: "#14213D", // Navy for main text
      secondary: "#6B7280", // Muted gray for secondary text
      disabled: "#B0B8C4",
    },
    divider: "#E5E5E5", // Light gray for dividers
    action: {
      active: "#FCA311",
      hover: "rgba(252, 163, 17, 0.1)",
      selected: "rgba(252, 163, 17, 0.2)",
      disabled: "#B0B8C4",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
    error: {
      main: red[600],
      light: red[400],
      dark: red[800],
    },
    warning: {
      main: "#FB8C00",
      light: "#FFCA28",
      dark: "#EF6C00",
    },
    info: {
      main: "#0288D1",
      light: "#4FC3F7",
      dark: "#01579B",
    },
    success: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    grey: grey,
  },
});

// Dark Theme
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
<<<<<<< HEAD
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E5E5E5",
=======
      main: "#FCA311", // Orange remains primary for consistency
      light: "#FFC107",
      dark: "#E68A00",
      contrastText: "#14213D", // Navy for contrast
    },
    secondary: {
      main: "#E5E5E5", // Light gray for accents in dark mode
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
      light: "#F0F0F0",
      dark: "#D1D5DB",
      contrastText: "#1A1A1A",
    },
<<<<<<< HEAD
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
=======
    background: {
      default: "#1A1A1A", // Dark charcoal for main background
      paper: "#242424", // Slightly lighter for cards
    },
    text: {
      primary: "#E5E5E5", // Light gray for main text
      secondary: "#A0AEC0", // Muted gray for secondary text
      disabled: "#6B7280",
    },
    divider: "#374151", // Darker gray for dividers
    action: {
      active: "#FCA311",
      hover: "rgba(252, 163, 17, 0.2)",
      selected: "rgba(252, 163, 17, 0.3)",
      disabled: "#6B7280",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
    error: {
      main: red[500],
      light: red[300],
      dark: red[700],
    },
    warning: {
      main: "#FB8C00",
      light: "#FFCA28",
      dark: "#EF6C00",
    },
    info: {
      main: "#29B6F6",
      light: "#4FC3F7",
      dark: "#0288D1",
    },
    success: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#2E7D32",
    },
    grey: grey,
  },
});

export { lightTheme, darkTheme };
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
