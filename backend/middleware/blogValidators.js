import { body, check, validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { BLOG_STATUS } from "../constants/constants.js";

const MIN_WORDS = 50;
const MAX_WORDS = 5000;

// Helper function to check if status is PUBLISHED or SCHEDULED
const isPublishedOrScheduled = (status) =>
  [BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(status);

// Handles the validation result
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        ApiResponse.error("Validation failed", 400, { errors: errors.array() })
      );
  }
  next();
}

// Custom function to validate the schedule date is in the future
const validateScheduleDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  if (date < new Date()) {
    throw new Error("Schedule date and time must be in the future");
  }
  return true;
};

// Main validation middleware
export const validatePublishBlog = [
  body("status")
    .isIn(Object.values(BLOG_STATUS))
    .withMessage("Invalid blog status"),

  body("title")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("Title must be between 5 and 150 characters"),

  body("content")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .notEmpty()
    .withMessage("Content is required")
    .bail()
    .isObject()
    .withMessage("Content must be a valid Tiptap JSON document")
    .custom((content) => {
      if (!content.type || content.type !== "doc") {
        throw new Error("Invalid Tiptap JSON document");
      }
      const words = countWordsInTiptap(content);
      if (words < MIN_WORDS) {
        throw new Error(
          `Minimum ${MIN_WORDS} words required (current: ${words})`
        );
      }
      if (words > MAX_WORDS) {
        throw new Error(
          `Maximum ${MAX_WORDS} words allowed (current: ${words})`
        );
      }
      return true;
    }),

  body("description")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ min: 5, max: 200 })
    .withMessage("Description must be between 5 and 200 characters"),

  body("coverImage")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .notEmpty()
    .withMessage("Cover image is required")
    .bail()
    .isObject()
    .withMessage("Cover image must be an object"),

  body("coverImage.url")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .notEmpty()
    .withMessage("Cover image URL is required")
    .bail()
    .isURL()
    .withMessage("Cover image must be a valid URL"),

  body("coverImage.public_id")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .notEmpty()
    .withMessage("Cover image public ID is required")
    .bail()
    .isString()
    .withMessage("Cover image public ID must be a string"),

  body("category._id")
    .if((_, { req }) => isPublishedOrScheduled(req.body.status))
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) =>
      tags.every((tag) => tag._id && mongoose.Types.ObjectId.isValid(tag._id))
    )
    .withMessage("Each tag must have a valid _id"),

  body("scheduleDateAndTime")
    .if((_, { req }) => req.body.status === BLOG_STATUS.SCHEDULED)
    .notEmpty()
    .withMessage("Schedule date and time is required for scheduled blogs")
    .bail()
    .custom(validateScheduleDate),

  body("readingTime")
    .optional()
    .isObject()
    .withMessage("Reading time must be an object"),

  check("readingTime.minutes")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Invalid reading minutes"),

  check("readingTime.words")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Invalid word count"),

  handleValidation, // must be last
];

const countWordsInTiptap = (content) => {
  let wordCount = 0;
  const traverseNodes = (nodes) => {
    nodes?.forEach((node) => {
      if (node.type === "text" && node.text) {
        const words = node.text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        wordCount += words.length;
      }
      if (node.content) {
        traverseNodes(node.content);
      }
    });
  };

  if (content?.content) {
    traverseNodes(content.content);
  }

  return wordCount;
};
