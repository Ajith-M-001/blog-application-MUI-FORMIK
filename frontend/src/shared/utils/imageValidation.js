export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/avif",
  "image/webp",
];

export const validateFile = (file) => {
  if (!file) return { valid: false, error: "No file selected" };

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        "File type not supported. Please upload PNG, JPG, GIF, AVIF, JPEG or WEBP",
    };
  }

  return { valid: true, error: null };
};
