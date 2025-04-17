import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import useStore from "../../store/zustand.store";
import BlogHeader from "./components/BlogHeader";
import { Footer } from "../../components/Footer";
import { Box, Input, Stack, Typography, useTheme } from "@mui/material";
import { ImageUp } from "lucide-react";
import { useRef } from "react";

const CreateBlog = () => {
  const inputRef = useRef(null);
  const theme = useTheme();
  const error = false;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const { blog, setBlogData, clearBlogData } = useStore(
    useShallow((state) => ({
      blog: state.blog,
      setBlogData: state.setBlogData,
      clearBlogData: state.clearBlogData,
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
              flex: 1,
              p: 2,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
            }}
          >
            <Box
              onClick={handleClick}
              sx={{
                border: "2px dashed",
                borderColor: error
                  ? theme.palette.error.main
                  : theme.palette.divider,
                borderRadius: 1,
                width: "100%",
                aspectRatio: "16/9",
                p: 4,
                textAlign: "center",
                overflow: "hidden",
                backgroundColor: theme.palette.background.paper,
                transition: "border-color 0.3s",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                maxHeight: "420px",
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                },
              }}
            >
              <ImageUp
                size={80}
                color={theme.palette.text.secondary}
                style={{
                  margin: "10 auto",
                }}
              />

              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Click to upload or drag & drop
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                PNG, JPG , GIF , AVIF , JPEG or WEBP — max 10MB
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Typography variant="caption" color="text.disabled">
                Recommended size: 1280×720 (16:9)
              </Typography>

              <Input
                type="file"
                inputRef={inputRef}
                accept="image/*"
                // onChange={handleFileChange}
                // disabled={isUploading}
                sx={{ display: "none" }}
                id="cover-image-upload"
              />
            </Box>
          </Box>

          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlog;
