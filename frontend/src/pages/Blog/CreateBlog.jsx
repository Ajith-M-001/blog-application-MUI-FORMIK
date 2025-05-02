import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Input,
  TextareaAutosize,
  Typography,
  useTheme,
} from "@mui/material";
import { ImageUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "../../components/Footer";
import { useUploadImage } from "../../hooks/api/Upload";
import { useBlogActions, useBlogData } from "../../store/zustand.store";
import TiptapEditor from "../../TipTak/TiptapEditor";
import { validateFile } from "../../utils/imageValidation";
import BlogHeader from "./components/BlogHeader";

const CreateBlog = () => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { setBlogData } = useBlogActions();
  const blog = useBlogData();

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { mutate: uploadImage } = useUploadImage();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    // Reset input value to allow selecting the same file again
    event.target.value = null;

    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploadError(null);

    console.log("Selected file:", file);
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    setIsUploading(true);

    // Create form data for upload
    const formData = new FormData();
    formData.append("images", file);

    // Create abort controller for this upload
    abortControllerRef.current = new AbortController();

    // Upload to server

    uploadImage(
      {
        formData,
        onUploadProgress: (progress) => {
          setUploadProgress(progress);
        },
        signal: abortControllerRef.current.signal,
      },
      {
        onSuccess: (data) => {
          console.log("Upload success:", data);
          const imageInfo = data.data[0];

          if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
          }

          setBlogData({
            coverImage: {
              url: imageInfo.url,
              public_id: imageInfo.public_id,
            },
          });

          setPreviewUrl(null);
          setIsUploading(false);
          setUploadProgress(0);
          abortControllerRef.current = null;
        },
        onError: (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
          setUploadProgress(0);
          setPreviewUrl(null);

          setBlogData({
            coverImage: {
              url: "",
              public_id: "",
            },
          });

          abortControllerRef.current = null;
        },
      }
    );
  };

  const handleCancelUpload = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);
      setPreviewUrl(null);
      setBlogData({
        coverImage: {
          url: "",
          public_id: "",
        },
      });
    }
    setUploadError(null);
  };

  const handleClearError = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);
  };

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
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Blog Title{" "}
                <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>

              <TextareaAutosize
                minRows={1}
                placeholder="Enter blog title..."
                maxLength={150}
                style={{
                  width: "100%",
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  padding: "10px 14px",
                  borderRadius: 8,
                  outline: "none",
                  border: `0.1px solid ${theme.palette.divider}`,
                  resize: "none",
                  fontFamily: theme.typography.fontFamily,
                  backgroundColor: theme.palette.background.paper,
                }}
                onChange={(e) => setBlogData({ title: e.target.value })}
                value={blog?.title || ""}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: "block" }}
              >
                {blog.title?.length || 0}/150 characters
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Cover Image{" "}
                <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <Box
                onClick={handleClick}
                sx={{
                  border: "2px dashed",
                  borderColor: theme.palette.divider,
                  borderRadius: 0.9,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  padding: 5,
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                  },
                }}
                role="button"
                aria-label={
                  previewUrl ? "Change cover image" : "Upload cover image"
                }
                aria-describedby="image-upload-description"
              >
                {uploadError && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2, zIndex: 3 }}
                    onClose={handleClearError}
                  >
                    {uploadError}
                  </Alert>
                )}
                {previewUrl || blog?.coverImage?.url ? (
                  <>
                    <Box
                      component="img"
                      src={previewUrl || blog?.coverImage?.url}
                      alt="Blog cover"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {isUploading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          bgcolor: "rgba(0, 0, 0, 0.6)", // Black semi-transparent overlay
                          zIndex: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={uploadProgress}
                          size={60}
                          thickness={4}
                          aria-label={`Upload progress: ${uploadProgress}%`}
                        />
                        <Typography
                          variant="body2"
                          color="white"
                          sx={{
                            fontWeight: 500,
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                          role="status"
                        >
                          {uploadProgress}% Uploaded
                        </Typography>
                        <Button
                          onClick={handleCancelUpload}
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ mt: 1, fontSize: "0.7rem" }}
                          aria-label="Cancel upload"
                        >
                          Cancel Upload
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ flexGrow: 1 }} />
                    <>
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
                    </>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Recommended size: 1280×720 (16:9)
                    </Typography>
                  </>
                )}
                <Input
                  type="file"
                  inputRef={inputRef}
                  accept="images/*"
                  id="cover-image-upload"
                  sx={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                Accepted formats: PNG, JPG, GIF, AVIF, JPEG, or WEBP — Max size:
                10MB — Recommended dimensions: 16:9 ratio.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Content{" "}
                <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <TiptapEditor initialContent={blog?.content} />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: "block" }}
              >
                Pro Tip: Use headings, lists, and images to structure your
                content. Minimum 50 words of text content
              </Typography>
            </Box>
          </Box>
          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlog;
