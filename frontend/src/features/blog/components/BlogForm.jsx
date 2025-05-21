import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Input,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { ImageUp, Trash2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import {
  useGetAllCategory,
  useGetAllTags,
  useGetBlogBySlug,
  usePublishBlog,
  useUpdateBlog,
  useUploadImage,
} from "../hooks/use-blog";
import { validateFile } from "../../../shared/utils/imageValidation";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";
import { BLOG_STATUS } from "../../../shared/constants/constants";
import TiptapEditor from "./editor/TiptapEditor";
import { debounce, isEqual } from "lodash";
import { useNavigate } from "react-router";

function extractTextFromDoc(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  return (node.content || []).map(extractTextFromDoc).join(" ");
}

// Validation schema
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
          .min(10, "Description must be at least 10 characters")
          .max(300, "Description must be at most 300 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),

  coverImage: Yup.object().when("status", {
    is: (status) =>
      [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
    then: () =>
      Yup.object({
        url: Yup.string()
          .required("Cover image URL is required")
          .url("Must be a valid URL"),
        publicId: Yup.string().required("Cover image public ID is required"),
      }).required("Cover image is required"),
    otherwise: () => Yup.object().notRequired(),
  }),

  content: Yup.object().when("status", {
    is: (status) =>
      [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
    then: (schema) =>
      schema
        .required("Content is required")
        .test(
          "wordCount",
          "Content must be between 50 and 5000 words",
          (value) => {
            if (!value) return false;
            const text = extractTextFromDoc(value);
            const words = text.trim().split(/\s+/).filter(Boolean).length;
            return words >= 50 && words <= 5000;
          }
        ),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  category: Yup.object().when("status", {
    is: (status) =>
      [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status),
    then: (schema) =>
      schema.required("Category is required").shape({
        _id: Yup.string().required("Category ID is required"),
        name: Yup.string().required("Category name is required"),
      }),
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

// Utility to check if form has meaningful data
const hasMeaningfulData = (values) => {
  return (
    values.title?.trim() ||
    values.description?.trim() ||
    values.content ||
    values.coverImage?.url ||
    values.category ||
    values.tags?.length > 0
  );
};

const haveValuesChanged = (formikValues, fetchedBlog) => {
  if (!fetchedBlog) return true; // New blog, always save if meaningful data exists
  const fetchedValues = {
    title: fetchedBlog.title || "",
    description: fetchedBlog.description || "",
    content: fetchedBlog.content || null,
    coverImage: fetchedBlog.coverImage || { url: "", publicId: "" },
    category: fetchedBlog.category || null,
    tags: fetchedBlog.tags || [],
    status: fetchedBlog.status || "draft",
    scheduleDateAndTime: fetchedBlog.scheduleDateAndTime || "",
    readingTime: fetchedBlog.readingTime || { minutes: 0, words: 0 },
  };
  return !isEqual(formikValues, fetchedValues);
};

const BlogForm = () => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const blog = useBlogData();
  const { setBlogData } = useBlogActions();

  const { data: fetchedBlog, isLoading: isBlogLoading } = useGetBlogBySlug(
    blog?.slug,
    {
      enabled: !!blog?.slug,
    }
  );

  console.log("fetchedBlog", !!blog?.slug);

  const { mutate: publishBlog } = usePublishBlog();
  const { mutate: updateBlog } = useUpdateBlog();

  const formik = useFormik({
    initialValues: blog,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (values._id) {
        updateBlog(
          { id: values._id, blogData: values },
          {
            onSuccess: () => {
              navigate("/");
            },
          }
        );
      } else {
        publishBlog(values, {
          onSuccess: () => {
            navigate("/");
          },
        });
      }
    },
  });

  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { data: allCategories } = useGetAllCategory({
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 65 * 60 * 1000, // 1 hour 5 minutes
  });

  const { data: allTags } = useGetAllTags({
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 65 * 60 * 1000, // 1 hour 5 minutes
  });

  const handleCancelUpload = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setUploadProgress(0);
      setPreviewUrl(null);
      formik.setFieldValue("coverImage", {
        url: "",
        publicId: "",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setUploadError(null);
    },
    [formik]
  );

  // Memoize category and tag options
  const categoryOptions = useMemo(
    () => allCategories?.data || [],
    [allCategories]
  );
  const tagOptions = useMemo(() => allTags?.data || [], [allTags]);

  const handleClearError = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);
  }, []);

  const handleDeleteImage = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setPreviewUrl(null);
      formik.setFieldValue("coverImage", {
        url: "",
        publicId: "",
      });
    },
    [formik]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleAutoSave = useCallback((values) => {
    if (
      values.status === BLOG_STATUS.DRAFT &&
      values.title?.trim() && // Check if title is not empty
      hasMeaningfulData(values) && // Check if there are meaningful data
      haveValuesChanged(values, fetchedBlog)
    ) {
      if (values._id) {
        updateBlog(
          { id: values._id, blogData: values },
          {
            onSuccess: (response) => {
              if (response.data?.slug !== values.slug) {
                setBlogData({ slug: response.data?.slug });
              }
            },
          }
        );
      } else {
        publishBlog(values, {
          onSuccess: (response) => {
            if (response.data?._id && response.data?.slug) {
              setBlogData({
                _id: response.data._id,
                slug: response.data.slug,
              });
            }
          },
        });
      }
    }
  }, []);

  // Dynamic debounce based on word count
  const debouncedAutoSave = useMemo(
    () =>
      debounce(
        handleAutoSave,
        formik.values.readingTime.words >= 1000 ? 5000 : 3000
      ),
    [handleAutoSave, formik.values.readingTime.words]
  );

  // Sync form state and trigger auto-save
  useEffect(() => {
    setBlogData(formik.values);
    if (formik.values.status === BLOG_STATUS.DRAFT) {
      debouncedAutoSave(formik.values);
    }
    return () => debouncedAutoSave.cancel();
  }, [formik.values, setBlogData, debouncedAutoSave]);

  const handleEditorChange = useCallback(
    ({ content, stats }) => {
      formik.setFieldValue("content", content);
      formik.setFieldValue("readingTime", {
        minutes: stats.readingTime,
        words: stats.wordCount,
      });
    },
    [formik]
  );

  const handleFileChange = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.target.files[0];
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

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append("images", file);
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
              publicId: imageInfo.public_id,
            });
            setPreviewUrl(null);
            setUploadProgress(0);
            abortControllerRef.current = null;
          },
          onError: (error) => {
            console.error("Upload error:", error);
            setUploadProgress(0);
            setPreviewUrl(null);
            formik.setFieldValue("coverImage", {
              url: "",
              publicId: "",
            });
            abortControllerRef.current = null;
          },
        }
      );
    },
    [previewUrl, formik, uploadImage]
  );

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const titleError = formik.touched.title && formik.errors.title;
  const descriptionError =
    formik.touched.description && formik.errors.description;
  const coverImageError =
    (formik.touched.coverImage && formik.errors.coverImage) ||
    (formik.touched.coverImage?.url && formik.errors.coverImage?.url);

  console.log("formik.values", formik);
  return (
    <>
      <Typography
        id="blog-form-label"
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        Create a New Blog Post
      </Typography>
      <Box
        component={"form"}
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        data-testid="blog-form"
        role="form"
        aria-labelledby="blog-form-label"
      >
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="label"
            htmlFor={"title"}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            Blog Title
            <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>
          <TextareaAutosize
            id="title"
            placeholder="Enter blog title"
            aria-label="title"
            minRows={1}
            maxLength={150}
            aria-required="true"
            aria-describedby={titleError ? "title-error" : undefined}
            aria-invalid={!!titleError}
            {...formik.getFieldProps("title")}
            style={{
              width: "100%",
              fontSize: "1.8rem",
              fontWeight: 600,
              padding: "10px 14px",
              borderRadius: 8,
              outline: "none",
              border: `1px solid ${
                titleError ? theme.palette.error.main : theme.palette.divider
              }`,
              resize: "none",
              fontFamily: theme.typography.fontFamily,
              backgroundColor: theme.palette.background.paper,
            }}
            data-testid="title-input"
          />
          {titleError ? (
            <Typography id="title-error" variant="body2" color="error">
              {formik.errors.title}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                textAlign: "right",
                color: theme.palette.text.secondary,
              }}
            >
              {formik.values.title.length}/150 characters
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="label"
            htmlFor="description"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            Description
            <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>
          <TextareaAutosize
            id="description"
            aria-label="description"
            placeholder="Enter description here..."
            minRows={3}
            maxLength={300}
            aria-required="true"
            aria-describedby={
              descriptionError ? "description-error" : undefined
            }
            aria-invalid={!!descriptionError}
            {...formik.getFieldProps("description")}
            style={{
              width: "100%",
              fontSize: "1rem",
              padding: "10px 14px",
              borderRadius: 8,
              outline: "none",
              border: `1px solid ${
                descriptionError
                  ? theme.palette.error.main
                  : theme.palette.divider
              }`,
              resize: "none",
              fontFamily: theme.typography.fontFamily,
              backgroundColor: theme.palette.background.paper,
            }}
            data-testid="description-input"
          />
          {descriptionError ? (
            <Typography id="description-error" variant="body2" color="error">
              {formik.errors.description}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                textAlign: "right",
                color: theme.palette.text.secondary,
              }}
            >
              {formik.values.description.length}/300 characters
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="label"
            htmlFor="cover-image-upload"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            Cover Image
            <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>
          <Box
            onClick={handleClick}
            sx={{
              border: !formik.values.coverImage?.url
                ? "2px dashed"
                : "0.1 dashed",
              borderColor: coverImageError
                ? theme.palette.error.main
                : theme.palette.divider,
              borderRadius: 0.9,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
              padding: {
                xs: 1.5,
                sm: 3,
                md: 4,
                lg: 5,
              },
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
            aria-describedby={
              coverImageError ? "cover-image-error" : "image-upload-description"
            }
            data-testid="cover-image-upload-area"
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
                  role="img"
                  aria-label="Blog cover"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                  data-testid="cover-image-preview"
                  loading="lazy"
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
                    data-testid="upload-progress-overlay"
                  >
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                      size={60}
                      thickness={4}
                      aria-label={`Upload progress: ${uploadProgress}%`}
                      data-testid="upload-progress-circle"
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
                      aria-live="polite" // Announce changes to screen readers
                      data-testid="upload-progress-text"
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
                      role="button"
                      data-testid="cancel-upload-button"
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
                    size={60}
                    color={theme.palette.text.secondary}
                    style={{
                      margin: "10 auto",
                    }}
                    data-testid="upload-icon"
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      fontSize: {
                        xs: "0.9rem",
                        sm: "1rem",
                        md: "1.1rem",
                      },
                    }}
                  >
                    Click to upload or drag & drop
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                    id="image-upload-description"
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
              accept="image/png,image/jpeg,image/gif,image/avif,image/webp"
              id="cover-image-upload"
              sx={{ display: "none" }}
              onChange={handleFileChange}
              aria-hidden="true"
              data-testid="cover-image-input"
            />
          </Box>
          {coverImageError && (
            <Typography
              variant="body2"
              color="error"
              data-testid="cover-image-error"
            >
              {formik.errors.coverImage?.url ||
                formik.errors.coverImage?.publicId}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Blog Content{" "}
            <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>
          <TiptapEditor
            initialContent={formik.values.content}
            onChange={handleEditorChange}
            readingTime={formik.values.readingTime}
            isError={formik.touched.content && formik.errors.content}
          />
          {formik.touched.content && formik.errors.content && (
            <Typography color="error" variant="caption">
              {formik.errors.content}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2 }} data-testid="category-autocomplete-container">
          <Typography
            variant="h6"
            gutterBottom
            component="label"
            htmlFor="category"
            aria-label="Category selection"
          >
            Category <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>

          <Autocomplete
            disablePortal
            id="category"
            name="category"
            options={categoryOptions}
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
                id="category"
                sx={{
                  m: 0,
                }}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
                slotProps={{
                  htmlInput: {
                    ...params.inputProps,
                    "aria-required": "true",
                    "aria-invalid":
                      formik.touched.category &&
                      Boolean(formik.errors.category),
                    "data-testid": "category-input",
                  },
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="label"
            htmlFor="tags"
            aria-label="Tags selection"
          >
            Tags (optional)
          </Typography>

          <Autocomplete
            multiple
            id="tags"
            name="tags"
            options={tagOptions}
            getOptionLabel={(option) => option.name}
            value={formik.values.tags || []}
            onChange={(event, value) => {
              if (value.length <= 10) {
                formik.setFieldValue("tags", value);
              }
            }}
            filterSelectedOptions
            onBlur={() => formik.setFieldTouched("tags", true)}
            sx={{
              width: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select tags"
                name="tags"
                id="tags"
                sx={{
                  m: 0,
                }}
                data-testid="tags-input"
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            component={"label"}
            htmlFor="status"
            aria-label="Status selection"
          >
            Status <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>
          <Select
            labelId="status-label"
            id="status-select"
            name="status"
            fullWidth
            value={formik.values.status}
            onChange={(e) => {
              const newStatus = e.target.value;
              // Cancel any pending auto-save when status changes
              //   debouncedSaveDraft.cancel();
              formik.setFieldValue("status", newStatus);
              formik.setFieldTouched("status", true);

              // Clear scheduled date if status is not 'scheduled'
              if (newStatus !== BLOG_STATUS.SCHEDULED) {
                formik.setFieldValue("scheduleDateAndTime", "");
                formik.setFieldTouched("scheduleDateAndTime", false);
              }
            }}
          >
            {Object.entries(BLOG_STATUS).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ mt: 2 }}>
          {formik.values.status === "scheduled" && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                component="label"
                htmlFor="schedule-date"
                aria-label="Scheduled Date and Time selection"
              >
                Scheduled Date and Time
                <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <TextField
                id="schedule-date"
                name="scheduleDateAndTime"
                type="datetime-local"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.scheduleDateAndTime}
                error={
                  formik.touched.scheduleDateAndTime &&
                  Boolean(formik.errors.scheduleDateAndTime)
                }
                helperText={
                  formik.touched.scheduleDateAndTime &&
                  formik.errors.scheduleDateAndTime
                }
                slotProps={{
                  htmlInput: {
                    min: new Date().toISOString().slice(0, 16),
                  },
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    cursor: "pointer",
                  },
                }}
                fullWidth
                margin="normal"
                data-testid="schedule-date-input"
              />
            </>
          )}
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          sx={{ mt: 2 }}
          data-testid="submit-button"
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default memo(BlogForm);
