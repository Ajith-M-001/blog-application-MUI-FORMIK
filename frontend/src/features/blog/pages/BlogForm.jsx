import { Box, Button, TextField, Typography } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import BlogHeader from "../components/BlogHeader";
import { Footer } from "../../../shared/components/layout/Footer";
import { useParams } from "react-router";
import { Formik } from "formik";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";
import {
  useGetAllCategory,
  useGetAllTags,
  useGetBlogBySlug,
} from "../hooks/use-blog";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BLOG_STATUS } from "../../../shared/constants/constants";
import { debounce, isEqual } from "lodash";
import * as Yup from "yup";
import MUITextareaAutosize from "../../../components/MUI/MUITextareaAutosize";
import MUIAutocomplete from "../../../components/MUI/MUIAutocomplete";
import MUISelect from "../../../components/MUI/MUISelect";
import MUIDateTimePicker from "../../../components/MUI/MUIDateTimePicker";
import dayjs from "dayjs";

const BlogValidationSchema = Yup.object({
  status: Yup.string()
    .required("Status is required")
    .oneOf(Object.values(BLOG_STATUS), "Invalid status"),
});

const BlogForm = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log("BlogForm render count:", renderCount.current);
  });
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const blog = useBlogData();
  const { setBlogData } = useBlogActions();
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
      const newBlogData = {
        _id: fetchedBlog.data._id || null,
        slug: fetchedBlog.data.slug || null,
        title: fetchedBlog.data.title || "",
        coverImage: {
          url: fetchedBlog.data.coverImage?.url || "",
          publicId: fetchedBlog.data.coverImage?.publicId || "",
        },
        content: fetchedBlog.data.content || null,
        category: fetchedBlog.data.category || null,
        tags: fetchedBlog.data.tags || [],
        description: fetchedBlog.data.description || "",
        status: fetchedBlog.data.status || BLOG_STATUS.DRAFT,
        scheduleDateAndTime: fetchedBlog.data.scheduleDateAndTime || "",
        readingTime: {
          minutes: fetchedBlog.data.readingTime?.minutes || 0,
          words: fetchedBlog.data.readingTime?.words || 0,
        },
      };

      if (!isEqual(newBlogData, blog)) {
        setBlogData(newBlogData);
      }
    }
  }, [isEditMode, fetchedBlog, setBlogData, blog]);

  const handleFormChange = useCallback(
    (values) => {
      debouncedSetBlogData(values);
    },
    [debouncedSetBlogData]
  );

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
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
          <header role="banner">
            <BlogHeader />
          </header>
          <Box
            component="main"
            role="main"
            data-testid="blog-form-container"
            sx={{
              flex: 1,
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
              }) => {
                if (!isEqual(values, blog)) {
                  handleFormChange(values);
                }

                return (
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
                            target: { name: "scheduleDateAndTime", value: "" },
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
