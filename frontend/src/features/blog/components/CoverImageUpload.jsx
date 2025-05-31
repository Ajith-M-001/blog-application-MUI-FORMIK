/* eslint-disable react/prop-types */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import { ImageUp, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { validateFile } from "../../../shared/utils/imageValidation";
import { useUploadImage } from "../hooks/use-blog";

const CoverImageUpload = ({
  id,
  name,
  label,
  testId,
  required,
  setFieldValue,
  value,
  error,
  touched,
}) => {
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: uploadImage } = useUploadImage();

  const handleCancelUpload = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);
      setPreviewUrl(null);
      setFieldValue(name, {
        url: "",
        public_id: "",
      });
    }
    setUploadError(null);
  };

  const handleDeleteImage = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setPreviewUrl(null);
    setFieldValue(name, {
      url: "",
      public_id: "",
    });
  };

  const handleClearError = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);
  };

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

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
          const imageInfo = data.data[0];
          if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
          }

          setFieldValue(name, {
            url: imageInfo.url,
            public_id: imageInfo.public_id,
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
          setFieldValue(name, {
            url: "",
            public_id: "",
          });
          abortControllerRef.current = null;
        },
      }
    );
  };

  console.log("previewUrl", value);

  return (
    <Box sx={{ mt: 2 }} data-testid={`${testId}-cover-image`}>
      <Typography
        variant="h6"
        gutterBottom
        component="label"
        htmlFor={id}
        aria-label={`${label} selection`}
      >
        {label}&nbsp;
        {required ? (
          <span style={{ color: theme.palette.error.main }}>*</span>
        ) : (
          "(optional)"
        )}
      </Typography>
      <Box
        id={id}
        name={name}
        onClick={handleClick}
        sx={{
          mt: 1,
          border: "2px dashed",
          borderColor:
            touched && error
              ? theme.palette.error.main
              : theme.palette.divider,
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
            borderColor:
              touched && error
                ? theme.palette.error.main
                : theme.palette.text.primary,
          },
        }}
        role="button"
        aria-label={previewUrl ? "Change cover image" : "Upload cover image"}
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

        {previewUrl || value?.url ? (
          <>
            <Box
              component="img"
              src={previewUrl || value?.url}
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

            {value?.url && (
              <IconButton
                onClick={handleDeleteImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 3,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                  },
                }}
                aria-label="Delete cover image"
                data-testid="delete-cover-image-button"
              >
                <Trash2 aria-hidden="true" size={20} />
              </IconButton>
            )}

            {isUploading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
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
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mt: 1,
                  textAlign: "center",
                }}
              >
                Click to upload or drag & drop
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                PNG, JPG, GIF, AVIF, JPEG or WEBP — max 10MB
              </Typography>
            </>
            <Box sx={{ flex: 1 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" }, mt: 1 }}
            >
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
    </Box>
  );
};

export default CoverImageUpload;
