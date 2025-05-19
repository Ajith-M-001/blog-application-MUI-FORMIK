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
import { Calendar, ImageUp, Save, Send, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import TiptapEditor from "../components/editor/TiptapEditor";
import BlogHeader from "../components/BlogHeader";
import {
  useGetAllCategory,
  useGetAllTags,
  usePublishBlog,
  useUpdateBlog,
  useUploadImage,
} from "../hooks/use-blog";
import { Footer } from "../../../shared/components/layout/Footer";
import { validateFile } from "../../../shared/utils/imageValidation";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";
// import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BLOG_STATUS } from "../../../shared/constants/constants";
import _, { debounce } from "lodash";

const CreateBlog = () => {
  const theme = useTheme();
  // const navigate = useNavigate();
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`CreateBlog render count: ${renderCount.current}`);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const { setBlogData } = useBlogActions();
  const blog = useBlogData();
  const { mutate: uploadImage } = useUploadImage();
  const { data: allCategories } = useGetAllCategory({
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 65 * 60 * 1000, // 1 hour 5 minutes
  });

  const { data: allTags } = useGetAllTags({
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 65 * 60 * 1000, // 1 hour 5 minutes
  });
  const { mutate: publishBlog, isPending: isPublishing } = usePublishBlog();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const isSaving = isPublishing || isUpdating;
  const MIN_WORDS = 50;
  const MAX_WORDS = 5000;
  const DEBOUNCE_TIME = 5000; // 5 seconds in milliseconds
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
    // Check if content is completely empty or not a valid Tiptap document
    if (!value || value.type !== "doc" || !Array.isArray(value.content)) {
      return false;
    }

    // Check if content exists but is essentially empty (no text content)
    const wordCount = countWordsInTiptap(value);

    // If wordCount is 0, the document exists but has no text content
    if (wordCount === 0) {
      return {
        isValid: false,
        error: "Content is required",
      };
    }

    // If content has words but doesn't meet min word count
    if (wordCount < MIN_WORDS) {
      return {
        isValid: false,
        error: `Content must have at least ${MIN_WORDS} words (currently ${wordCount})`,
      };
    }

    // If content exceeds max word count
    if (wordCount > MAX_WORDS) {
      return {
        isValid: false,
        error: `Content exceeds maximum of ${MAX_WORDS} words (currently ${wordCount})`,
      };
    }

    // Content is valid
    return {
      isValid: true,
      wordCount,
    };
  };

  // Blog form validation schema
  const validationSchema = Yup.object({
    status: Yup.string()
      .required("Status is required")
      .oneOf(Object.values(BLOG_STATUS), "Invalid status"),

    title: Yup.string()
      .trim()
      .when("status", {
        is: (status) =>
          [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
        then: (schema) =>
          schema
            .required("Title is required")
            .min(5, "Title must be at least 5 characters")
            .max(150, "Title must be at most 150 characters"),
        otherwise: (schema) => schema.notRequired(),
      }),

    description: Yup.string()
      .trim()
      .when("status", {
        is: (status) =>
          [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
        then: (schema) =>
          schema
            .required("Description is required")
            .min(5, "Description must be at least 5 characters")
            .max(200, "Description must be at most 200 characters"),
        otherwise: (schema) => schema.notRequired(),
      }),

    content: Yup.mixed().when("status", {
      is: (status) =>
        [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
      then: (schema) =>
        schema
          .required("Content is required")
          .test("is-valid-tiptap", function (value) {
            // Custom error message based on validation result
            const validation = validateTiptapContent(value);

            // If validation returns a boolean (false), use generic message
            if (validation === false) {
              return this.createError({
                message: "Content is required",
              });
            }

            // If validation returns an object with error
            if (validation && !validation.isValid) {
              return this.createError({
                message: validation.error,
              });
            }

            // If validation passes
            return true;
          }),
      otherwise: (schema) => schema,
    }),

    coverImage: Yup.mixed().when("status", {
      is: (status) =>
        [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
      then: () =>
        Yup.object({
          url: Yup.string()
            .required("Cover image URL is required")
            .url("Must be a valid URL"),
          public_id: Yup.string().required("Cover image public ID is required"),
        }).required("Cover image is required"),
      otherwise: () => Yup.mixed().notRequired(),
    }),

    category: Yup.object().when("status", {
      is: (status) =>
        [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
      then: (schema) => schema.required("Category is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

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
      otherwise: (schema) => schema.notRequired(),
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
  }, [formik.values, setBlogData, blog]);

  console.log("formik.errors", formik.errors);

  const hasFormChanged = (currentValues) => {
    console.log("currentValues", currentValues);
    console.log("blog", blog);
    return !_.isEqual(currentValues, blog);
  };
  // Auto-save draft implementation with debounce
  // Use a longer debounce time (5 seconds) for lengthy content to avoid too many API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSaveDraft = useCallback(
    debounce((data) => {
      if (data.status === BLOG_STATUS.DRAFT && hasFormChanged(data)) {
        if (data?._id) {
          console.log("Saving draft", data);
          updateBlog(
            { id: data?._id, blogData: data },
            {
              onSuccess: (response) => {
                setLastSaved(new Date());
                if (response.data?.slug !== data.slug) {
                  setBlogData({ slug: response.data?.slug });
                }
              },
            }
          );
        } else {
          console.log("creating draft", data);
          publishBlog(data, {
            onSuccess: (response) => {
              setLastSaved(new Date());
              if (response.data?._id && response.data?.slug) {
                setBlogData({
                  _id: response.data._id,
                  slug: response.data.slug,
                });
              }
              setLastSaved(new Date());
            },
          });
        }
      }
    }, DEBOUNCE_TIME), // 5 second debounce for content changes
    [blog]
  );

  // Trigger auto-save when values change and status is draft
  useEffect(() => {
    if (formik.values.status === BLOG_STATUS.DRAFT) {
      debouncedSaveDraft(formik.values);
    }

    return () => {
      debouncedSaveDraft.cancel();
    };
  }, [formik.values, debouncedSaveDraft]);

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

  // Get button text based on status
  const getButtonText = (status) => {
    switch (status) {
      case BLOG_STATUS.DRAFT:
        return "Save as Draft";
      case BLOG_STATUS.PUBLISHED:
        return "Publish";
      case BLOG_STATUS.SCHEDULED:
        return "Schedule";
      default:
        return "Save";
    }
  };

  // Get button icon based on status
  const getButtonIcon = (status) => {
    switch (status) {
      case BLOG_STATUS.DRAFT:
        return <Save size={18} />;
      case BLOG_STATUS.PUBLISHED:
        return <Send size={18} />;
      case BLOG_STATUS.SCHEDULED:
        return <Calendar size={18} />;
      default:
        return <Save size={18} />;
    }
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
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
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
            {/* Auto-save indicator for draft mode */}
            {formik.values.status === BLOG_STATUS.DRAFT && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="text.secondary">
                      Saving draft...
                    </Typography>
                  </>
                ) : (
                  lastSaved && (
                    <Typography variant="caption" color="text.secondary">
                      Last saved: {new Date(lastSaved).toLocaleTimeString()}
                    </Typography>
                  )
                )}
              </Box>
            )}
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
                  {previewUrl || formik.values.coverImage?.url ? (
                    <>
                      <Box
                        component="img"
                        src={previewUrl || formik.values.coverImage?.url}
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
                        error={
                          formik.touched.tags && Boolean(formik.errors.tags)
                        }
                        helperText={formik.touched.tags && formik.errors.tags}
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
                      onChange={(e) => {
                        // Cancel any pending auto-save when status changes
                        debouncedSaveDraft.cancel();
                        formik.handleChange(e);
                      }}
                    >
                      {Object.entries(BLOG_STATUS).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).toLowerCase()}
                        </MenuItem>
                      ))}
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
                startIcon={getButtonIcon(formik.values.status)}
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
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : getButtonText(formik.values.status)}
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
