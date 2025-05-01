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
import { useBlogActions, useBlogData } from "../../store/zustand.store";
import { BlogContent } from "./components/BlogContent";
import BlogHeader from "./components/BlogHeader";

const PreviewBlog = () => {
  const theme = useTheme();

  // Preview mode that shows how the blog will appear to readers

  const { data: allCategories } = useGetAllCategory();
  const { data: allTags } = useGetAllTags();

  console.log("allCategories", allTags);

  const { setBlogData } = useBlogActions();
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
          <BlogHeader />
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
                    placeholder="Enter description here..."
                    maxLength={200}
                    style={{
                      fullWidth: true,
                      width: "100%",
                      fontSize: "1rem",
                      padding: "10px 14px",
                      borderRadius: 2,
                      outline: "none",
                      border: `0.1px solid ${theme.palette.divider}`,
                      resize: "none",
                      fontFamily: theme.typography.fontFamily,
                      backgroundColor: theme.palette.background.paper,
                    }}
                    onChange={(e) =>
                      setBlogData({ shortDescription: e.target.value })
                    }
                    value={blog?.shortDescription || ""}
                  />
                </Box>

                <Box sx={{ mb: 4, width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    category{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>

                  <Autocomplete
                    disablePortal
                    id="category"
                    options={allCategories?.data || []} // Pass the array directly
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => {
                      setBlogData({ category: value }); // Save selected category
                    }}
                    value={blog?.category || null}
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
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 4, width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Tags{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>

                  <Autocomplete
                    multiple
                    id="tags"
                    options={allTags?.data || []}
                    getOptionLabel={(option) => option.name}
                    value={blog?.tags || []}
                    onChange={(event, value) => {
                      if (value.length <= 10) {
                        setBlogData({ tags: value });
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
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 4, width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Status{" "}
                    <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>
                  <FormControl fullWidth mt={2}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status-select"
                      value={blog?.status || ""}
                      label="Status"
                      onChange={(event) =>
                        setBlogData({ status: event.target.value })
                      }
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                    </Select>
                  </FormControl>

                  {blog?.status === "scheduled" && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        select date and time for schedule  the Blog to go published{" "}
                        <span style={{ color: theme.palette.error.main }}>
                          *
                        </span>
                      </Typography>
                      <TextField
                        id="schedule-date"
                        label="Schedule Date"
                        type="datetime-local"
                        value={blog?.scheduleDate || ""}
                        onChange={(event) =>
                          setBlogData({ scheduleDate: event.target.value })
                        }
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        fullWidth
                        margin="normal"
                      />
                    </>
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
