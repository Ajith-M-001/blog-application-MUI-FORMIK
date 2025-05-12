import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { BLOG_STATUS } from "../../../shared/constants/constants";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";

const countWordsInContent = (content) => {
  if (!content?.content?.length) return 0;

  const text = content.content
    .map((item) =>
      item?.content?.map((textNode) => textNode?.text || "").join(" ")
    )
    .join(" ");

  return text.trim().split(/\s+/).filter(Boolean).length;
};

const createBlogSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(Object.values(BLOG_STATUS), "Invalid status")
    .required("Status is required"),
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be at most 150 characters"),
  coverImage: Yup.object()
    .required("Cover image is required")
    .shape({
      url: Yup.string()
        .url("Invalid image URL")
        .required("Cover image URL is required"),
      public_id: Yup.string().required("Public ID is required"),
    }),
  content: Yup.object()
    .required("Content is required")
    .test("word-count", "Content must have at least 50 words", (value) => {
      const wordCount = countWordsInContent(value);
      return wordCount >= 50;
    })
    .test("word-count-max", "Content must have at most 5000 words", (value) => {
      const wordCount = countWordsInContent(value);
      return wordCount <= 5000;
    }),
});

const previewBlogSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(Object.values(BLOG_STATUS), "Invalid status")
    .required("Status is required"),
  shortDescription: Yup.string()
    .required("Short Description is required")
    .min(5, "Short Description must be at least 5 characters")
    .max(200, "Short Description must be at most 200 characters"),
  category: Yup.object().required("Category is required"),
  tags: Yup.array().max(10, "Maximum 10 tags allowed").optional(),
  scheduleDateAndTime: Yup.string().when("status", {
    is: BLOG_STATUS.SCHEDULED,
    then: (schema) => schema.required("Schedule date and time is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

const blogValidationSchema = Yup.object().shape({
  ...createBlogSchema.fields,
  ...previewBlogSchema.fields,
});

const BlogFormContext = createContext();

const BlogFormProvider = ({ children }) => {
  const navigate = useNavigate();
  const blog = useBlogData();
  const { setBlogData } = useBlogActions();

  const initialValues = useMemo(() => blog, [blog]);

  // Use ref to avoid unnecessary validation during simple navigation
  const skipValidationRef = useRef(false);

  const formik = useFormik({
    initialValues,
    validationSchema: blogValidationSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    validate: (values) => {
      if (skipValidationRef.current) {
        return {};
      }
      return blogValidationSchema
        .validate(values, { abortEarly: false })
        .then(() => ({}))
        .catch((err) => {
          const errors = {};
          err.inner.forEach((e) => {
            errors[e.path] = e.message;
          });
          return errors;
        });
    },
    onSubmit: (values) => {
      console.log(values, "onSubmit");
    },
  });

  // Debounce blog data updates to reduce state updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (setBlogData) {
        setBlogData(formik.values);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [formik.values, setBlogData]);

  const goToPreview = useCallback(async () => {
    try {
      const step1Errors = await createBlogSchema
        .validate(formik.values, { abortEarly: false })
        .then(() => ({}))
        .catch((err) => {
          const errors = {};
          err.inner.forEach((e) => {
            errors[e.path] = e.message;
          });
          return errors;
        });

      const hasErrors = Object.keys(step1Errors).length > 0;

      if (!hasErrors) {
        navigate("/preview-blog");
      } else {
        // Set touched state for fields with errors
        Object.keys(step1Errors).forEach((field) =>
          formik.setFieldTouched(field, true)
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  }, [formik, navigate]);

  // Optimized edit navigation
  const goToEdit = useCallback(() => {
    navigate("/create-blog");
  }, [navigate]);

  // Add direct navigation function that skips validation
  const navigateWithoutValidation = useCallback(
    (path) => {
      skipValidationRef.current = true;
      navigate(path);
      // Reset after navigation
      setTimeout(() => {
        skipValidationRef.current = false;
      }, 500);
    },
    [navigate]
  );

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      formik,
      goToPreview,
      goToEdit,
      navigateWithoutValidation,
    }),
    [formik, goToPreview, goToEdit, navigateWithoutValidation]
  );

  return (
    <BlogFormContext.Provider value={contextValue}>
      {children}
    </BlogFormContext.Provider>
  );
};

BlogFormProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BlogFormProvider;

export const useBlogForm = () => {
  const context = useContext(BlogFormContext);
  if (!context) {
    throw new Error("useBlogForm must be used within a BlogFormProvider");
  }
  return context;
};
