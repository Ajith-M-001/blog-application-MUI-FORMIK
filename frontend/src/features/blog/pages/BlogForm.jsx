import { Box, Button, Grid2, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import BlogHeader from "../components/BlogHeader";
import { Footer } from "../../../shared/components/layout/Footer";
import { useNavigate, useParams } from "react-router";
import { Formik } from "formik";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";
import {
  useGetAllCategory,
  useGetAllTags,
  useGetBlogBySlug,
  usePublishBlog,
  useUpdateBlog,
} from "../hooks/use-blog";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BLOG_STATUS } from "../../../shared/constants/constants";
import { debounce, isEqual } from "lodash";
import * as Yup from "yup";
import MUITextareaAutosize from "../../../components/MUI/MUITextareaAutosize";
import MUIAutocomplete from "../../../components/MUI/MUIAutocomplete";
import MUISelect from "../../../components/MUI/MUISelect";
import MUIDateTimePicker from "../../../components/MUI/MUIDateTimePicker";
import dayjs from "dayjs";
import CoverImageUpload from "../components/CoverImageUpload";
import TiptapEditor from "../components/editor/TiptapEditor";
import { transformBlogData } from "../utils/transformBlogData";

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
const BlogValidationSchema = Yup.object({
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
const BlogForm = () => {
  const [saveState, setSaveState] = useState({
    isSaving: false,
    lastSavedAt: null,
    error: null,
  });
  const renderCount = useRef(0);
  renderCount.current += 1;

  const navigate = useNavigate();

  const theme = useTheme();

  useEffect(() => {
    console.log("BlogForm render count:", renderCount.current);
  });
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const blog = useBlogData();
  const { setBlogData, clearBlogData } = useBlogActions();

  const lastSavedBlog = useRef(blog);
  const { data: fetchedBlog } = useGetBlogBySlug(slug, {
    enabled: isEditMode,
  });
  const { data: allCategories } = useGetAllCategory({
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: allTags } = useGetAllTags({
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate: publishBlog } = usePublishBlog();
  const { mutate: updateBlog } = useUpdateBlog();

  const debouncedSetBlogData = useCallback(
    debounce((nextValues) => {
      if (!isEqual(nextValues, blog)) {
        setBlogData(nextValues);
      }
    }, 500),
    [blog, setBlogData]
  );

  useEffect(() => {
    if (isEditMode && fetchedBlog?.data) {
      const newBlogData = transformBlogData(fetchedBlog.data);
      if (!isEqual(newBlogData, blog)) {
        setBlogData(newBlogData);
      }
    }

    return () => {
      clearBlogData();
    };
  }, [isEditMode, fetchedBlog, setBlogData, clearBlogData]);

  const debouncedAutoSave = useCallback(
    debounce((nextValues, setFieldValue) => {
      const omitFields = ["slug", "_id"];
      const sanitizeForCompare = (obj) => {
        const copy = { ...obj };
        omitFields.forEach((field) => delete copy[field]);
        return copy;
      };

      const currentSanitized = sanitizeForCompare(nextValues);
      const lastSanitized = sanitizeForCompare(lastSavedBlog.current);

      if (nextValues.status !== BLOG_STATUS.DRAFT) return;

      if (lastSavedBlog.current && isEqual(currentSanitized, lastSanitized)) {
        return;
      }

      if (nextValues.title.trim() === "") return;

      setSaveState((prev) => ({ ...prev, isSaving: true, error: null }));

      const onSuccess = (response) => {
        console.log("onSuccess", response);
        setSaveState((prev) => ({
          ...prev,
          isSaving: false,
          lastSavedAt: response?.data?.updatedAt,
        }));
        lastSavedBlog.current = nextValues;

        // Update form with server response if needed
        if (response.data?.slug !== nextValues.slug) {
          setFieldValue("slug", response.data.slug);
        }
        if (!nextValues._id && response.data?._id) {
          setFieldValue("_id", response.data._id);
        }
      };

      const onError = (error) => {
        setSaveState((prev) => ({
          ...prev,
          isSaving: false,
          error: error.message || "Failed to save",
        }));
      };

      if (nextValues._id) {
        updateBlog(
          { id: nextValues._id, blogData: nextValues },
          {
            onSuccess,
            onError,
            onSettled: () => {
              setSaveState((prev) => ({ ...prev, isSaving: false }));
            },
          }
        );
      } else {
        console.log("create blog", nextValues);
        publishBlog(nextValues, {
          onSuccess,
          onError,
          onSettled: () => {
            setSaveState((prev) => ({ ...prev, isSaving: false }));
          },
        });
      }
    }, 3000) // 3000ms debounce time
  );

  const handleFormChange = useCallback(
    (values, setFieldValue) => {
      debouncedSetBlogData(values);
      debouncedAutoSave(values, setFieldValue);
    },
    [debouncedSetBlogData, debouncedAutoSave]
  );

  const handleSubmit = (values) => {
    if (values?._id) {
      updateBlog(
        { id: values._id, blogData: values },
        {
          onSuccess: () => {
            navigate("/");
          },
        }
      );
    } else {
      console.log("create blog", values);
      publishBlog(values, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  const getCategoryOptionLabel = useCallback((option) => option.name || "", []);
  const getTagsOptionLabel = useCallback((option) => option.name || "", []);

  const categoryOptions = useMemo(
    () => allCategories?.data || [],
    [allCategories?.data]
  );
  const tagOptions = useMemo(() => allTags?.data || [], [allTags?.data]);
  const statusOptions = useMemo(
    () =>
      Object.entries(BLOG_STATUS).map(([key, val]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: val,
      })),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        role="document"
        aria-label={isEditMode ? "Edit Blog Page" : "Create Blog Page"}
        data-testid="blog-form-motion-container"
      >
        <Box
          data-testid={isEditMode ? "edit-blog-page" : "create-blog-page"}
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Box
            component="main"
            role="main"
            data-testid="blog-form-container"
            sx={{
              mt: 14,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              id="blog-form-label"
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {isEditMode ? "Edit Blog" : "Create a New Blog Post"}
            </Typography>
            <Formik
              initialValues={blog}
              validationSchema={BlogValidationSchema}
              enableReinitialize
              validateOnChange={false}
              validateOnBlur={true}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
              }) => {
                if (!isEqual(values, blog)) {
                  handleFormChange(values, setFieldValue);
                }

                return (
                  <>
                    <header role="banner">
                      <BlogHeader
                        saveState={saveState}
                        canPreview={
                          [
                            BLOG_STATUS.PUBLISHED,
                            BLOG_STATUS.SCHEDULED,
                          ].includes(values.status) &&
                          Object.keys(errors).length === 0 &&
                          Object.keys(touched).length > 0
                        }
                      />
                    </header>
                    <Box
                      component={"form"}
                      onSubmit={handleSubmit}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      data-testid="blog-form"
                      role="form"
                      aria-labelledby="blog-form-label"
                    >
                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12 }}>
                          <MUITextareaAutosize
                            id="title"
                            name="title"
                            label="Blog Title"
                            required
                            placeholder="Enter blog title"
                            minRows={1}
                            maxLength={150}
                            value={values.title}
                            error={errors.title}
                            touched={touched.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fontSize="1.8rem"
                            fontWeight={600}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <MUITextareaAutosize
                            id="description"
                            name="description"
                            label="Description"
                            required
                            placeholder="Enter description here..."
                            minRows={3}
                            maxLength={300}
                            value={values.description}
                            error={errors.description}
                            touched={touched.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <CoverImageUpload
                            id="coverImage"
                            name="coverImage"
                            label="cover Image"
                            testId="cover-image-upload"
                            required={true}
                            setFieldValue={setFieldValue}
                            value={values.coverImage}
                            error={errors.coverImage}
                            touched={touched.coverImage}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <Typography variant="h6" gutterBottom>
                            Content{" "}
                            <span style={{ color: theme.palette.error.main }}>
                              *
                            </span>
                          </Typography>
                          {console.log("values.content", values)}
                          <TiptapEditor
                            initialContent={values.content}
                            onChange={(content, stats) => {
                              // Update both content and readingTime fields
                              setFieldValue("content", content);
                              setFieldValue("readingTime", stats);
                            }}
                            isError={touched.content && errors.content}
                            readingTime={values.readingTime}
                          />
                          {touched.content && errors.content && (
                            <Typography color="error" variant="caption">
                              {errors.content}
                            </Typography>
                          )}
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <MUIAutocomplete
                            id="category"
                            name="category"
                            label="Category"
                            required
                            options={categoryOptions}
                            getOptionLabel={getCategoryOptionLabel}
                            maxSelectedOptions={1}
                            placeholder="Select a category"
                            value={values.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.category}
                            error={errors.category}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <MUIAutocomplete
                            id="tags"
                            name="tags"
                            label="Tags"
                            multiple
                            options={tagOptions}
                            getOptionLabel={getTagsOptionLabel}
                            maxSelectedOptions={10}
                            placeholder="Select tags"
                            value={values.tags}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.tags}
                            error={errors.tags}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <MUISelect
                            id="status"
                            name="status"
                            label="Status"
                            required
                            value={values.status}
                            error={errors.status}
                            touched={touched.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              handleChange(e);
                              if (newStatus !== BLOG_STATUS.SCHEDULED) {
                                handleChange({
                                  target: {
                                    name: "scheduleDateAndTime",
                                    value: "",
                                  },
                                });
                              }
                            }}
                            onBlur={handleBlur}
                            options={statusOptions}
                          />

                          {values.status === BLOG_STATUS.SCHEDULED && (
                            <MUIDateTimePicker
                              id="scheduleDateAndTime"
                              name="scheduleDateAndTime"
                              label="Scheduled Date & Time"
                              required
                              value={values.scheduleDateAndTime}
                              error={errors.scheduleDateAndTime}
                              touched={touched.scheduleDateAndTime}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              minDateTime={dayjs(new Date())} // ✅ Disable past date and time
                            />
                          )}
                        </Grid2>
                      </Grid2>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        data-testid="submit-blog-button"
                      >
                        {isEditMode ? "Update Blog" : "Submit Blog"}
                      </Button>
                    </Box>
                  </>
                );
              }}
            </Formik>
          </Box>
          <footer role="contentinfo">
            <Footer />
          </footer>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogForm;

// import { Box, Button, Grid2 } from "@mui/material";
// import MUITextareaAutosize from "../../../components/MUI/MUITextareaAutosize";
// import MUIAutocomplete from "../../../components/MUI/MUIAutocomplete";
// import MUISelect from "../../../components/MUI/MUISelect";
// import MUIDateTimePicker from "../../../components/MUI/MUIDateTimePicker";
// import { BLOG_STATUS } from "../../../shared/constants/constants";
// import dayjs from "dayjs";

// // Form fields configuration
// const FORM_FIELDS = [
//   {
//     id: "title",
//     name: "title",
//     label: "Blog Title",
//     component: MUITextareaAutosize,
//     required: true,
//     placeholder: "Enter blog title",
//     minRows: 1,
//     maxLength: 150,
//     fontSize: "1.8rem",
//     fontWeight: 600,
//   },
//   {
//     id: "description",
//     name: "description",
//     label: "Description",
//     component: MUITextareaAutosize,
//     required: true,
//     placeholder: "Enter description here...",
//     minRows: 3,
//     maxLength: 300,
//   },
//   {
//     id: "category",
//     name: "category",
//     label: "Category",
//     component: MUIAutocomplete,
//     required: true,
//     maxSelectedOptions: 1,
//     placeholder: "Select a category",
//   },
//   {
//     id: "tags",
//     name: "tags",
//     label: "Tags",
//     component: MUIAutocomplete,
//     multiple: true,
//     maxSelectedOptions: 10,
//     placeholder: "Select tags",
//   },
//   {
//     id: "status",
//     name: "status",
//     label: "Status",
//     component: MUISelect,
//     required: true,
//   },
// ];

// const BlogFormFields = ({
//   values,
//   setFieldValue,
//   handleFormChange,
//   categoryOptions,
//   tagOptions,
//   statusOptions,
//   getCategoryOptionLabel,
//   getTagsOptionLabel,
//   isEditMode,
//   handleSubmit,
// }) => {
//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{ display: "flex", flexDirection: "column" }}
//       data-testid="blog-form"
//       role="form"
//       aria-labelledby="blog-form-label"
//     >
//       <Grid2 container spacing={2}>
//         {FORM_FIELDS.map((field) => (
//           <Grid2 key={field.id} size={{ xs: 12 }}>
//             <field.component
//               id={field.id}
//               name={field.name}
//               label={field.label}
//               required={field.required}
//               placeholder={field.placeholder}
//               minRows={field.minRows}
//               maxLength={field.maxLength}
//               fontSize={field.fontSize}
//               fontWeight={field.fontWeight}
//               multiple={field.multiple}
//               maxSelectedOptions={field.maxSelectedOptions}
//               options={
//                 field.name === "category"
//                   ? categoryOptions
//                   : field.name === "tags"
//                   ? tagOptions
//                   : field.name === "status"
//                   ? statusOptions
//                   : []
//               }
//               getOptionLabel={
//                 field.name === "category"
//                   ? getCategoryOptionLabel
//                   : field.name === "tags"
//                   ? getTagsOptionLabel
//                   : undefined
//               }
//               value={values[field.name]}
//               onChange={(e, value) => {
//                 if (field.name === "status") {
//                   const newStatus = e.target.value;
//                   setFieldValue("status", newStatus);
//                   if (newStatus !== BLOG_STATUS.SCHEDULED) {
//                     setFieldValue("scheduleDateAndTime", "");
//                   }
//                 } else {
//                   setFieldValue(field.name, value || e.target.value);
//                 }
//                 handleFormChange(
//                   {
//                     ...values,
//                     [field.name]: value || e.target.value,
//                   },
//                   setFieldValue
//                 );
//               }}
//               onBlur={() => handleFormChange(values, setFieldValue)}
//               data-testid={`field-${field.name}`}
//             />
//           </Grid2>
//         ))}
//         {values.status === BLOG_STATUS.SCHEDULED && (
//           <Grid2 size={{ xs: 12 }}>
//             <MUIDateTimePicker
//               id="scheduleDateAndTime"
//               name="scheduleDateAndTime"
//               label="Scheduled Date & Time"
//               required
//               value={values.scheduleDateAndTime}
//               onChange={(value) => {
//                 setFieldValue("scheduleDateAndTime", value);
//                 handleFormChange(
//                   { ...values, scheduleDateAndTime: value },
//                   setFieldValue
//                 );
//               }}
//               onBlur={() => handleFormChange(values, setFieldValue)}
//               minDateTime={dayjs(new Date())}
//               data-testid="field-scheduleDateAndTime"
//             />
//           </Grid2>
//         )}
//       </Grid2>
//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         sx={{ mt: 2 }}
//         data-testid="submit-blog-button"
//       >
//         {isEditMode ? "Update Blog" : "Submit Blog"}
//       </Button>
//     </Box>
//   );
// };

// export default BlogFormFields;
