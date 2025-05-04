import {
  Autocomplete,
  Box,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { Footer } from "../../components/Footer";
import { useGetAllCategory } from "../../hooks/api/category";
import { useGetAllTags } from "../../hooks/api/tags";
import { useBlogData } from "../../store/zustand.store";
import { BlogContent } from "./components/BlogContent";
import BlogHeader from "./components/BlogHeader";
import { useBlogForm } from "./components/BlogFormProvider";

const PreviewBlog = () => {
  const theme = useTheme();

  const { formik, goToEdit } = useBlogForm();

  console.log("formik", formik);

  // Preview mode that shows how the blog will appear to readers

  const { data: allCategories } = useGetAllCategory();
  const { data: allTags } = useGetAllTags();

  const blog = useBlogData();

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
          <BlogHeader previewFormik={formik} goToEdit={goToEdit} />
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
              py: 2,
            }}
          >
            <Grid2
              container
              spacing={3}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Grid2 size={{ xs: 12, md: 8 }}>
                <BlogContent />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }} spacing={4}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    description{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>
                  <TextareaAutosize
                    aria-label="short-description"
                    minRows={3}
                    name="shortDescription"
                    placeholder="Enter description here..."
                    maxLength={200}
                    style={{
                      fullWidth: true,
                      width: "100%",
                      fontSize: "1rem",
                      padding: "10px 14px",
                      borderRadius: 2,
                      outline: "none",
                      border: `1px solid ${
                        formik.touched.shortDescription &&
                        formik.errors.shortDescription
                          ? theme.palette.error.main
                          : theme.palette.divider
                      }`,
                      resize: "none",
                      fontFamily: theme.typography.fontFamily,
                      backgroundColor: theme.palette.background.paper,
                    }}
                    value={formik.values.shortDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.shortDescription &&
                    formik.errors.shortDescription && (
                      <div
                        style={{
                          color: theme.palette.error.main,
                          fontSize: "0.875rem",
                          marginTop: "4px",
                        }}
                      >
                        {formik.errors.shortDescription}
                      </div>
                    )}
                </Box>

                <Box sx={{ mb: 4, width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    category{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>

                  <Autocomplete
                    disablePortal
                    id="category"
                    name="category"
                    options={allCategories?.data || []} // Pass the array directly
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => {
                      formik.setFieldValue("category", value); // Only update Formik state
                    }}
                    value={formik.values.category}
                    sx={{
                      width: "100%",
                      mt: 2,
                      backgroundColor: theme.palette.background.paper,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select category"
                        label="Categories"
                        name="category"
                        error={
                          formik.touched.category &&
                          Boolean(formik.errors.category)
                        }
                      />
                    )}
                  />
                  {formik.touched.category && formik.errors.category && (
                    <div
                      style={{
                        color: theme.palette.error.main,
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {formik.errors.category}
                    </div>
                  )}
                </Box>

                <Box sx={{ mb: 4, width: "100%" }}>
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
                      mt: 2,
                      backgroundColor: theme.palette.background.paper,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select up to 10 tags"
                        label="Tags"
                        name="tags"
                        error={
                          formik.touched.tags && Boolean(formik.errors.tags)
                        }
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 4, width: "100%" }}>
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

                  {blog?.status === "scheduled" && (
                    <TextField
                      id="schedule-date"
                      label="Schedule Date"
                      name="scheduleDateAndTime"
                      type="datetime-local"
                      value={formik.values.scheduleDateAndTime || ""}
                      onChange={(event) =>
                        formik.setFieldValue(
                          "scheduleDateAndTime",
                          event.target.value
                        )
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      borderColor={
                        formik.touched.scheduleDateAndTime &&
                        formik.errors.scheduleDateAndTime
                          ? theme.palette.error.main
                          : theme.palette.divider
                      }
                      error={
                        formik.touched.scheduleDateAndTime &&
                        Boolean(formik.errors.scheduleDateAndTime)
                      }
                      fullWidth
                      margin="normal"
                    />
                  )}
                  {formik.touched.scheduleDateAndTime &&
                    formik.errors.scheduleDateAndTime && (
                      <div
                        style={{
                          color: theme.palette.error.main,
                          fontSize: "0.875rem",
                          marginTop: "4px",
                        }}
                      >
                        {formik.errors.scheduleDate}
                      </div>
                    )}
                </Box>
              </Grid2>
            </Grid2>
          </Box>
          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewBlog;
