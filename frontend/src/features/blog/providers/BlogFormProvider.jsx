import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { createContext, useCallback, useContext, useEffect } from "react";
import { BLOG_STATUS } from "../../../shared/constants/constants";
import { useBlogActions, useBlogData } from "../../../shared/store/blogStore";

const countWordsInContent = (content) => {
  const text = content?.content?.length
    ? content.content
        .map((item) =>
          item?.content?.map((textNode) => textNode.text).join(" ")
        )
        .join(" ")
    : "";

  return text.trim().split(/\s+/).filter(Boolean).length;
};

const createBlogSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(Object.values(BLOG_STATUS), "Invalid status")
    .required("Status is required"),
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be at most 50 characters"),
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

  const formik = useFormik({
    initialValues: blog,
    validationSchema: blogValidationSchema,
    onSubmit: (values) => {
      console.log(values, "onSubmit");
    },
  });

  useEffect(() => {
    if (setBlogData) {
      setBlogData(formik.values);
    }
  }, [formik.values, setBlogData]);

  const goToPreview = useCallback(async () => {
    const step1Errors = await formik.validateForm(formik.values);
    const step1Fields = Object.keys(createBlogSchema.fields);
    const hasStep1Errors = step1Fields.some((field) => step1Errors[field]);
    if (!hasStep1Errors) {
      navigate("/preview-blog");
    } else {
      step1Fields.forEach((field) => formik.setFieldTouched(field, true));
    }
  }, [formik, navigate]);

  const goToEdit = useCallback(() => {
    navigate("/create-blog");
  }, [navigate]);

  return (
    <BlogFormContext.Provider value={{ formik, goToPreview, goToEdit }}>
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
