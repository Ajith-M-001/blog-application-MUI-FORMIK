import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ImageUp, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import TiptapEditor from "../components/editor/TiptapEditor";
import BlogHeader from "../components/BlogHeader";
import {
  useGetAllCategory,
  useGetAllTags,
  useUploadImage,
} from "../hooks/use-blog";
import { Footer } from "../../../shared/components/layout/Footer";
import { validateFile } from "../../../shared/utils/imageValidation";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BLOG_STATUS } from "../../../shared/constants/constants";

const CreateBlog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { setBlogData } = useBlogActions();
  const blog = useBlogData();
  const { mutate: uploadImage } = useUploadImage();
  const { data: allCategories } = useGetAllCategory();
  const { data: allTags } = useGetAllTags();

  const MIN_WORDS = 50;
  const MAX_WORDS = 5000;
  // Counts words in a Tiptap JSON structure
  const countWordsInTiptap = (content) => {
    if (!content?.content?.length) return 0;

    const text = content.content
      .map((item) =>
        item?.content?.map((textNode) => textNode?.text || "").join(" ")
      )
      .join(" ");

    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Custom validator for Tiptap content
  const validateTiptapContent = (value) => {
    if (!value || value.type !== "doc" || !Array.isArray(value.content)) {
      return false;
    }
    const wordCount = countWordsInTiptap(value);
    return wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;
  };

  // Blog form validation schema
  const validationSchema = Yup.object({
    status: Yup.string()
      .required("status is required")
      .oneOf(Object.values(BLOG_STATUS), "Invalid status"),
    title: Yup.string()
      .trim()
      .when("status", {
        is: (status) =>
          [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
        then: (schema) =>
          schema
            .required("Title is required")
            .min(5, "title must be at least 5 characters")
            .max(150, "title must be at most 150 characters"),
        otherwise: (schema) => schema,
      }),
    description: Yup.string()
      .trim()
      .when("status", {
        is: (status) =>
          [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
        then: (schema) =>
          schema
            .required("Description is required")
            .min(5, "description must be at least 5 characters")
            .max(200, "description must be at most 200 characters"),
        otherwise: (schema) => schema,
      }),
    content: Yup.object().when("status", {
      is: (status) =>
        [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
      then: (schema) =>
        schema
          .required("Content is required")
          .test(
            "is-valid-tiptap",
            `Content must be a valid Tiptap document with ${MIN_WORDS}–${MAX_WORDS} words`,
            validateTiptapContent
          ),
      otherwise: (schema) => schema,
    }),

    coverImage: Yup.object()
      .nullable()
      .when("status", {
        is: (status) =>
          [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
        then: (schema) =>
          schema.required("Cover image is required").shape({
            url: Yup.string()
              .required("Cover image is required")
              .url("Must be a valid URL"),
            public_id: Yup.string().required(
              "Cover image public ID is required"
            ),
          }),
        otherwise: (schema) => schema,
      }),
    category: Yup.object().when("status", {
      is: (status) =>
        [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
      then: (schema) => schema.required("Category is required"),
      otherwise: (schema) => schema,
    }),

    // Tags validation - optional but must be valid if provided
    tags: Yup.array()
      .of(
        Yup.object({
          _id: Yup.string().required("Tag ID is required"),
          name: Yup.string().required("Tag name is required"),
        })
      )
      .max(10, "Maximum 10 tags allowed"),

    scheduleDateAndTime: Yup.date().when("status", {
      is: (status) => status === BLOG_STATUS.SCHEDULED,
      then: (schema) =>
        schema
          .required("Schedule date and time is required")
          .min(new Date(), "Schedule date must be in the future"),
      otherwise: (schema) => schema,
    }),
  });

  // Initialize formik with blog store values
  const formik = useFormik({
    initialValues: blog,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const coverImageError =
    formik.touched.coverImage && formik.errors.coverImage
      ? formik.errors.coverImage
      : null;

  // Sync formik values with blog store
  useEffect(() => {
    // Only update store if values actually changed
    if (JSON.stringify(formik.values) !== JSON.stringify(blog)) {
      setBlogData(formik.values);
    }
  }, [formik.values, setBlogData]);

  console.log("dsfadsfsda", formik.errors);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDeleteImage = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setPreviewUrl(null);
    formik.setFieldValue("coverImage", {
      url: "",
      public_id: "",
    });
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

          formik.setFieldValue("coverImage", {
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
          formik.setFieldValue("coverImage", {
            url: "",
            public_id: "",
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
      formik.setFieldValue("coverImage", {
        url: "",
        public_id: "",
      });
    }
    setUploadError(null);
  };

  const handleClearError = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);
  };

  const handleSubmit = () => {
    // Here you would typically make an API call to create/update the blog
    console.log("Publishing blog:", blog);
    // After successful submission
  };

  const handleEditorChange = (content) => {
    formik.setFieldValue("content", content);
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
            {/* Left Side - Content Creation */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Blog Title{" "}
                  <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>

                <TextareaAutosize
                  name="title"
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
                    border: `0.1px solid ${
                      formik.touched.title && formik.errors.title
                        ? theme.palette.error.main
                        : theme.palette.divider
                    }`,
                    resize: "none",
                    fontFamily: theme.typography.fontFamily,
                    backgroundColor: theme.palette.background.paper,
                  }}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <Typography color="error" variant="caption">
                    {formik.errors.title}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Description{" "}
                  <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <TextareaAutosize
                  aria-label="short-description"
                  minRows={3}
                  name="description"
                  placeholder="Enter description here..."
                  maxLength={200}
                  style={{
                    width: "100%",
                    fontSize: "1rem",
                    padding: "10px 14px",
                    borderRadius: 8,
                    outline: "none",
                    border: `1px solid ${
                      formik.touched.description && formik.errors.description
                        ? theme.palette.error.main
                        : theme.palette.divider
                    }`,
                    resize: "none",
                    fontFamily: theme.typography.fontFamily,
                    backgroundColor: theme.palette.background.paper,
                  }}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <Typography color="error" variant="caption">
                    {formik.errors.description}
                  </Typography>
                )}
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
                    borderColor: coverImageError
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
                      borderColor: coverImageError
                        ? theme.palette.error.main
                        : theme.palette.text.primary,
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

                      {formik.values.coverImage?.url && (
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
                        >
                          <Trash2 />
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
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          Click to upload or drag & drop
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          PNG, JPG, GIF, AVIF, JPEG or WEBP — max 10MB
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
                {coverImageError && (
                  <Typography color="error" variant="caption">
                    {formik.errors.coverImage.url ||
                      formik.errors.coverImage.public_id}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Blog Content Editor */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Content{" "}
                <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <TiptapEditor
                initialContent={formik.values.content}
                onChange={handleEditorChange}
                isError={formik.touched.content && formik.errors.content}
              />
              {formik.touched.content && formik.errors.content && (
                <Typography color="error" variant="caption">
                  {formik.errors.content}
                </Typography>
              )}
            </Box>

            {/* Metadata Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Blog Metadata
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Category{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>

                  <Autocomplete
                    disablePortal
                    id="category"
                    name="category"
                    options={allCategories?.data || []}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => {
                      formik.setFieldValue("category", value);
                    }}
                    value={formik.values.category}
                    sx={{
                      width: "100%",
                      backgroundColor: theme.palette.background.paper,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select category"
                        name="category"
                        error={
                          formik.touched.category &&
                          Boolean(formik.errors.category)
                        }
                        helperText={
                          formik.touched.category && formik.errors.category
                        }
                      />
                    )}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Tags (optional)
                  </Typography>

                  <Autocomplete
                    multiple
                    id="tags"
                    name="tags"
                    options={allTags?.data || []}
                    getOptionLabel={(option) => option.name}
                    value={formik.values.tags}
                    onChange={(event, value) => {
                      if (value.length <= 10) {
                        formik.setFieldValue("tags", value);
                      }
                    }}
                    filterSelectedOptions
                    sx={{
                      width: "100%",
                      backgroundColor: theme.palette.background.paper,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select up to 10 tags"
                        name="tags"
                      />
                    )}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status-select"
                      name="status"
                      fullWidth
                      value={formik.values.status}
                      label="Status"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                    </Select>
                  </FormControl>

                  {formik.values.status === "scheduled" && (
                    <TextField
                      id="schedule-date"
                      label="Schedule Date"
                      name="scheduleDateAndTime"
                      type="datetime-local"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.scheduleDateAndTime &&
                        Boolean(formik.errors.scheduleDateAndTime)
                      }
                      helperText={
                        formik.touched.scheduleDateAndTime &&
                        formik.errors.scheduleDateAndTime
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      fullWidth
                      margin="normal"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 4,
                spacing: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={formik.handleSubmit}
                startIcon={<Save size={18} />} // Replace with appropriate icon if needed
                sx={{
                  textTransform: "capitalize",
                  py: "4px",
                  fontSize: "1rem",
                  fontWeight: "400",
                  mr: 2,
                }}
                size="small"
                color="secondary"
                disableElevation
              >
                Publish
              </Button>
            </Box>
          </Box>
          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlog;
