import { Box, Grid2, TextareaAutosize, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { Footer } from "../../components/Footer";
import { BlogContent } from "./components/BlogContent";
import BlogHeader from "./components/BlogHeader";
import useStore from "../../store/zustand.store";
import { useShallow } from "zustand/react/shallow";

const PreviewBlog = () => {
  const theme = useTheme();

  const { blog, setBlogData } = useStore(
    useShallow((state) => ({
      blog: state.blog,
      setBlogData: state.setBlogData,
    }))
  );
  return (
    <AnimatePresence>
      <motion.div
        key="create-blog"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <BlogHeader />
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
              py: 2,
            }}
          >
            <Grid2
              container
              spacing={3}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Grid2 size={{ xs: 12, md: 8 }}>
                <BlogContent />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Box>
                  <TextareaAutosize
                    aria-label="short-description"
                    minRows={3}
                    placeholder="Enter description here..."
                    style={{
                      fullWidth: true,
                      width: "100%",
                      fontSize: "1rem",
                      padding: "10px 14px",
                      borderRadius: 2,
                      outline: "none",
                      border: `0.1px solid ${theme.palette.divider}`,
                      resize: "none",
                      fontFamily: theme.typography.fontFamily,
                      backgroundColor: theme.palette.background.paper,
                    }}
                    onChange={(e) =>
                      setBlogData({ shortDescription: e.target.value })
                    }
                    value={blog?.shortDescription || ""}
                  />
                </Box>
              </Grid2>
            </Grid2>
          </Box>
          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewBlog;
