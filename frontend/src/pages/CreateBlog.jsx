import { Box, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";

const CreateBlog = () => {
  return (
    <AnimatePresence mode="wait">
      <Box
        component={motion.div}
        key="create-blog"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          gap={2}
          sx={{
            width: "100%",
            maxWidth: "55rem",
          }}
        >
          <Typography variant="h2">Create Blog</Typography>
        </Stack>
      </Box>
    </AnimatePresence>
  );
};

export default CreateBlog;
