import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button, Container } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static propTypes = {
    children: PropTypes.node,
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Attempt to recover by refreshing the page or navigating to home
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We&apos;re sorry, but there was an error loading this page.
            </Typography>
            {import.meta.env.VITE_NODE_ENV === "development" &&
              this.state.error && (
                <Box
                  sx={{
                    my: 4,
                    textAlign: "left",
                    bgcolor: "#f5f5f5",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    component="p"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo && (
                    <Box
                      component="pre"
                      sx={{ mt: 2, overflow: "auto", maxHeight: "300px" }}
                    >
                      {this.state.errorInfo.componentStack}
                    </Box>
                  )}
                </Box>
              )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{ mt: 3 }}
            >
              Return to Home
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
