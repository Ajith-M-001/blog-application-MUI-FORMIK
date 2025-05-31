import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  DialogActions,
  Box,
} from "@mui/material";
import { Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useUploadImage } from "../../../hooks/use-blog";
import { validateFile } from "../../../../../shared/utils/imageValidation";

const ImageUploadDialog = ({ editor, open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const { mutate: uploadImage } = useUploadImage();
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted || !editor) return null;

  const handleCloseImageDialog = () => {
    if (isUploading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
    setSelectedFile(null);
    setIsUploading(false);
  };

  const handleClearError = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);
  };

  const handleCancelUpload = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (isUploading && abortControllerRef.current) {
      // If uploading, abort the upload
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);

      // Clean up preview URL
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setUploadError("");
    } else {
      // If not uploading, just close the dialog
      handleCloseImageDialog();
    }
  };

  const handleFileSelect = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log("Selected file:", file);

    // Reset input value to allow selecting the same file again
    event.target.value = null;
    if (!file) return;

    const validation = validateFile(file);

    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploadError(null);
    const localPreviewUrl = URL.createObjectURL(file);
    console.log("Local preview URL:", localPreviewUrl);
    setPreviewUrl(localPreviewUrl);
    setSelectedFile(file);
  };

  const handleUploadImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isUploading) return;
    if (!selectedFile) return;

    setIsUploading(true);

    // Create form data for upload
    const formData = new FormData();
    formData.append("images", selectedFile);

    // Create abort controller for this upload
    abortControllerRef.current = new AbortController();

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

          // Insert image into the editor
          editor.chain().focus().setImage({ src: imageInfo.url }).run();

          setPreviewUrl(null);
          setIsUploading(false);
          setUploadProgress(0);
          abortControllerRef.current = null;
          onClose();
        },
        onError: (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
          setUploadProgress(0);
          setPreviewUrl(null);

          abortControllerRef.current = null;
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Insert Image
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {uploadError && (
          <Alert
            severity="error"
            sx={{ mb: 2, zIndex: 3 }}
            onClose={handleClearError}
          >
            {uploadError}
          </Alert>
        )}

        <Box sx={{ my: 2 }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          {/* Upload Area or Image Preview */}
          {previewUrl ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 1,
                  overflow: "hidden",
                  backgroundColor: (theme) => theme.palette.background.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

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
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={(theme) => ({
                border: `2px dashed ${theme.palette.divider}`,
                aspectRatio: "16/9",
                borderRadius: 1,
                padding: theme.spacing(2.5),
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: theme.palette.background.card,
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing(1),
              })}
              onClick={() => fileInputRef.current.click()}
            >
              <Image size={40} color="inherit" />
              <Typography variant="body2" color="text.secondary">
                Click to select an image
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          sx={{
            zIndex: 20,
          }}
          variant="outlined"
          color="error"
          onClick={handleCancelUpload}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUploadImage}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ImageUploadDialog.propTypes = {
  editor: PropTypes.shape({
    chain: PropTypes.func.isRequired,
    focus: PropTypes.func.isRequired,
    setImage: PropTypes.func.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageUploadDialog;
