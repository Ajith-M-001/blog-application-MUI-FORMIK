import { Box, Button } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import BlogHeader from "../components/BlogHeader";
import { Footer } from "../../../shared/components/layout/Footer";
import { BlogContent } from "../components/BlogContent";
import { useNavigate } from "react-router";
import { useBlogData } from "../../../shared/store/blogStore";
import { Save, SquarePen } from "lucide-react";

const PreviewBlog = () => {
  const navigate = useNavigate();
  const blog = useBlogData();

  const goToEdit = () => {
    navigate("/create-blog");
  };

  const handlePublish = () => {
    // Here you would typically make an API call to create/update the blog
    console.log("Publishing blog:", blog);
    // After successful submission
    navigate("/");
  };

  return (
    <AnimatePresence>
      <motion.div
        key="preview-blog"
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
          <BlogHeader goToEdit={goToEdit} />
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
            <Box
              sx={{
                width: "100%",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              <BlogContent />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={goToEdit}
                  startIcon={<SquarePen size={18} />} // Replace with appropriate icon if needed
                  sx={{
                    textTransform: "capitalize",
                    py: "3px",
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                  size="small"
                  color="secondary"
                  disableElevation
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  startIcon={<Save size={18} />} // Replace with appropriate icon if needed
                  sx={{
                    textTransform: "capitalize",
                    py: "4px",
                    fontSize: "1rem",
                    fontWeight: "400",
                    ml: 2,
                  }}
                  size="small"
                  color="secondary"
                  disableElevation
                >
                  Publish
                </Button>
              </Box>
            </Box>
          </Box>
          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewBlog;
