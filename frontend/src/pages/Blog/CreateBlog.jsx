import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import useStore from "../../store/zustand.store";
import BlogHeader from "./components/BlogHeader";
import { Footer } from "../../components/Footer";
import { Box, Input, Stack, Typography, useTheme } from "@mui/material";
import { ImageUp } from "lucide-react";
import { useRef } from "react";
import { useUploadImage } from "../../hooks/api/Upload";

const CreateBlog = () => {
  const inputRef = useRef(null);
  const theme = useTheme();
  const error = false;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const { blog, setBlogData, clearBlogData } = useStore(
    useShallow((state) => ({
      blog: state.blog,
      setBlogData: state.setBlogData,
      clearBlogData: state.clearBlogData,
    }))
  );

  const { mutate: uploadImages, isLoading: isUploading } = useUploadImage({});

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;
    console.log("selectedFile", file);
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
            sx={{
              flex: 1,
              p: 2,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
            }}
          >
            <Box
              onClick={handleClick}
              sx={{
                border: "2px dashed",
                borderColor: error
                  ? theme.palette.error.main
                  : theme.palette.divider,
                borderRadius: 0.9,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                padding: 5,
                aspectRatio: "16/9",
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                },
              }}
            >
              <Box sx={{ flexGrow: 1 }} />
              <>
                <ImageUp
                  size={80}
                  color={theme.palette.text.secondary}
                  style={{
                    margin: "10 auto",
                  }}
                />

                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Click to upload or drag & drop
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  PNG, JPG , GIF , AVIF , JPEG or WEBP — max 10MB
                </Typography>
              </>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Recommended size: 1280×720 (16:9)
              </Typography>

              <Input
                type="file"
                inputRef={inputRef}
                accept="image/*"
                onChange={handleFileChange}
                // disabled={isUploading}
                sx={{ display: "none" }}
                id="cover-image-upload"
              />
            </Box>
          </Box>

          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlog;

// import { AnimatePresence, motion } from "motion/react";
// import { useShallow } from "zustand/react/shallow";
// import useStore from "../../store/zustand.store";
// import BlogHeader from "./components/BlogHeader";
// import { Footer } from "../../components/Footer";
// import {
//   Box,
//   CircularProgress,
//   Input,
//   Stack,
//   Typography,
//   useTheme
// } from "@mui/material";
// import { ChevronUpSquare, ImageUp, X } from "lucide-react";
// import { useRef, useState } from "react";
// import { useUploadImage, useDeleteImage } from "../../hooks/api/Upload";

// const CreateBlog = () => {
//   const inputRef = useRef(null);
//   const theme = useTheme();
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploadedImageInfo, setUploadedImageInfo] = useState(null);
//   const error = false;

//   const { blog, setBlogData, clearBlogData } = useStore(
//     useShallow((state) => ({
//       blog: state.blog,
//       setBlogData: state.setBlogData,
//       clearBlogData: state.clearBlogData,
//     }))
//   );

//   const uploadImageMutation = useUploadImage({
//     onSuccess: (data) => {
//       const imageInfo = data.data[0];
//       setUploadedImageInfo(imageInfo);
//       setBlogData({ coverImage: imageInfo.secure_url });
//       setPreviewUrl(imageInfo.secure_url);
//       setIsUploading(false);
//       setUploadProgress(0);
//     },
//     onError: () => {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   });

//   const deleteImageMutation = useDeleteImage({
//     onSuccess: () => {
//       setPreviewUrl(null);
//       setUploadedImageInfo(null);
//       setBlogData({ coverImage: null });
//     }
//   });

//   const handleClick = () => {
//     if (!isUploading && !previewUrl) {
//       inputRef.current?.click();
//     }
//   };

//   const handleFileChange = (event) => {
//     event.preventDefault();
//     const selectedFile = event.target.files[0];

//     if (selectedFile) {
//       // Show a local preview immediately
//       const localPreviewUrl = URL.createObjectURL(selectedFile);
//       setPreviewUrl(localPreviewUrl);
//       setIsUploading(true);

//       // Upload to server
//       uploadImageMutation.mutate({
//         file: selectedFile,
//         onProgress: (progress) => {
//           setUploadProgress(progress);
//         }
//       });
//     }
//   };

//   const handleRemoveImage = () => {
//     if (uploadedImageInfo && uploadedImageInfo.public_id) {
//       deleteImageMutation.mutate([uploadedImageInfo.public_id]);
//     } else {
//       setPreviewUrl(null);
//       setBlogData({ coverImage: null });
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         key="create-blog"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.3 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh",
//           }}
//         >
//           <BlogHeader />

//           <Box
//             sx={{
//               flex: 1,
//               p: 2,
//               width: "100%",
//               maxWidth: "1100px",
//               mx: "auto",
//               px: 2,
//             }}
//           >
//             <Box
//               onClick={handleClick}
//               sx={{
//                 border: "2px dashed",
//                 borderColor: error
//                   ? theme.palette.error.main
//                   : theme.palette.divider,
//                 borderRadius: 0.9,
//                 cursor: previewUrl ? "default" : "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexDirection: "column",
//                 padding: 5,
//                 aspectRatio: "16/9",
//                 position: "relative",
//                 overflow: "hidden",
//                 "&:hover": {
//                   borderColor: previewUrl ? theme.palette.divider : theme.palette.text.primary,
//                 },
//               }}
//             >
//               {previewUrl ? (
//                 <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
//                   <Box
//                     component="img"
//                     src={previewUrl}
//                     sx={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       opacity: isUploading ? 0.6 : 1,
//                       transition: "opacity 0.3s"
//                     }}
//                     alt="Blog cover"
//                   />

//                   <Box
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (!isUploading) {
//                         handleRemoveImage();
//                       }
//                     }}
//                     sx={{
//                       position: "absolute",
//                       top: 8,
//                       right: 8,
//                       backgroundColor: "rgba(0,0,0,0.5)",
//                       borderRadius: "50%",
//                       width: 32,
//                       height: 32,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: isUploading ? "not-allowed" : "pointer",
//                       "&:hover": {
//                         backgroundColor: isUploading ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.7)",
//                       }
//                     }}
//                   >
//                     <X size={20} color="#fff" />
//                   </Box>

//                   {isUploading && (
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 1
//                       }}
//                     >
//                       <CircularProgress
//                         variant="determinate"
//                         value={uploadProgress}
//                         size={60}
//                         thickness={4}
//                       />
//                       <Typography variant="body2" color="white" sx={{
//                         fontWeight: 500,
//                         backgroundColor: 'rgba(0,0,0,0.6)',
//                         px: 2,
//                         py: 0.5,
//                         borderRadius: 1
//                       }}>
//                         {uploadProgress}% Uploaded
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               ) : (
//                 <>
//                   <Box sx={{ flexGrow: 1 }} />
//                   <ImageUp
//                     size={80}
//                     color={theme.palette.text.secondary}
//                     style={{
//                       margin: "10 auto",
//                     }}
//                   />

//                   <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//                     Click to upload or drag & drop
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 0.5 }}
//                   >
//                     PNG, JPG, GIF, AVIF, JPEG or WEBP — max 10MB
//                   </Typography>
//                   <Box sx={{ flexGrow: 1 }} />
//                   <Typography variant="caption" color="text.secondary">
//                     Recommended size: 1280×720 (16:9)
//                   </Typography>
//                 </>
//               )}

//               <Input
//                 type="file"
//                 inputRef={inputRef}
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 disabled={isUploading}
//                 sx={{ display: "none" }}
//                 id="cover-image-upload"
//               />
//             </Box>
//           </Box>

//           <Footer />
//         </Box>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default CreateBlog;


// import { AnimatePresence, motion } from "motion/react";
// import { useShallow } from "zustand/react/shallow";
// import useStore from "../../store/zustand.store";
// import BlogHeader from "./components/BlogHeader";
// import { Footer } from "../../components/Footer";
// import { Box, CircularProgress, Input, Typography, useTheme } from "@mui/material";
// import { ImageUp, X } from "lucide-react";
// import { useRef, useState } from "react";
// import { useUploadImages } from "../../hooks/api/Users";
// import { showToast } from "../../utils/toast";

// const CreateBlog = () => {
//   const inputRef = useRef(null);
//   const theme = useTheme();
//   const [error, setError] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [previewImage, setPreviewImage] = useState(null);

//   const { blog, setBlogData, clearBlogData } = useStore(
//     useShallow((state) => ({
//       blog: state.blog,
//       setBlogData: state.setBlogData,
//       clearBlogData: state.clearBlogData,
//     }))
//   );

//   const { mutate: uploadImages, isLoading: isUploading } = useUploadImages({
//     onSuccess: (data) => {
//       const imageData = data.data[0]; // Assuming we're uploading a single image
//       setPreviewImage(imageData.secure_url);
//       setBlogData({ coverImage: imageData });
//       showToast("Image uploaded successfully", { type: "success" });
//     },
//   });

//   const handleClick = () => {
//     if (previewImage && !isUploading) {
//       // If there's already an image and we're not uploading, clear it
//       setPreviewImage(null);
//       setBlogData({ coverImage: null });
//       return;
//     }
//     inputRef.current?.click();
//   };

//   const handleFileChange = (event) => {
//     event.preventDefault();
//     const file = event.target.files[0];
    
//     if (!file) return;
    
//     // Validate file size (max 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       setError(true);
//       showToast("Image size should be less than 10MB", { type: "error" });
//       return;
//     }
    
//     // Reset error state
//     setError(false);
    
//     // Create a temporary preview
//     const objectUrl = URL.createObjectURL(file);
//     setPreviewImage(objectUrl);
    
//     // Create form data for upload
//     const formData = new FormData();
//     formData.append("images", file);
    
//     // Upload the image with progress tracking
//     uploadImages({
//       formData,
//       onUploadProgress: (progress) => {
//         setUploadProgress(progress);
//       },
//     });
    
//     // Clean up the temporary object URL when done
//     return () => URL.revokeObjectURL(objectUrl);
//   };

//   const handleRemoveImage = (e) => {
//     e.stopPropagation();
//     setPreviewImage(null);
//     setBlogData({ coverImage: null });
//     setUploadProgress(0);
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         key="create-blog"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.3 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh",
//           }}
//         >
//           <BlogHeader />

//           <Box
//             sx={{
//               flex: 1,
//               p: 2,
//               width: "100%",
//               maxWidth: "1100px",
//               mx: "auto",
//               px: 2,
//             }}
//           >
//             <Box
//               onClick={handleClick}
//               sx={{
//                 border: "2px dashed",
//                 borderColor: error
//                   ? theme.palette.error.main
//                   : theme.palette.divider,
//                 borderRadius: 0.9,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexDirection: "column",
//                 padding: 5,
//                 aspectRatio: "16/9",
//                 "&:hover": {
//                   borderColor: theme.palette.text.primary,
//                 },
//                 position: "relative",
//                 overflow: "hidden",
//               }}
//             >
//               {previewImage ? (
//                 <>
//                   <Box
//                     component="img"
//                     src={previewImage}
//                     alt="Blog cover"
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                   {!isUploading && (
//                     <Box
//                       onClick={handleRemoveImage}
//                       sx={{
//                         position: "absolute",
//                         top: 10,
//                         right: 10,
//                         backgroundColor: "rgba(0,0,0,0.5)",
//                         borderRadius: "50%",
//                         width: 32,
//                         height: 32,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                         zIndex: 2,
//                       }}
//                     >
//                       <X size={20} color="#fff" />
//                     </Box>
//                   )}
//                   {isUploading && (
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         backgroundColor: "rgba(0,0,0,0.5)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         zIndex: 1,
//                       }}
//                     >
//                       <CircularProgress
//                         variant="determinate"
//                         value={uploadProgress}
//                         size={60}
//                         thickness={4}
//                         sx={{ color: "white" }}
//                       />
//                       <Typography
//                         variant="h6"
//                         sx={{ color: "white", mt: 2 }}
//                       >
//                         {uploadProgress}%
//                       </Typography>
//                     </Box>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <Box sx={{ flexGrow: 1 }} />
//                   <ImageUp
//                     size={80}
//                     color={theme.palette.text.secondary}
//                     style={{
//                       margin: "10 auto",
//                     }}
//                   />

//                   <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//                     Click to upload or drag & drop
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 0.5 }}
//                   >
//                     PNG, JPG, GIF, AVIF, JPEG or WEBP — max 10MB
//                   </Typography>
//                   <Box sx={{ flexGrow: 1 }} />
//                   <Typography variant="caption" color="text.secondary">
//                     Recommended size: 1280×720 (16:9)
//                   </Typography>
//                 </>
//               )}

//               <Input
//                 type="file"
//                 inputRef={inputRef}
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 disabled={isUploading}
//                 sx={{ display: "none" }}
//                 id="cover-image-upload"
//               />
//             </Box>
//           </Box>

//           <Footer />
//         </Box>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default CreateBlog;