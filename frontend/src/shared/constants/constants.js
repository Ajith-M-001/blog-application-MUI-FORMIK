export const SESSION_PREFERENCE = {
  SINGLE: "single",
  MULTIPLE: "multiple",
};

export const USER_ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  AUTHOR: "Author",
  READER: "Reader",
  SUBSCRIBER: "Subscriber",
};

export const BLOG_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
};

export const GUARD_TYPE = {
  AUTH: "auth",
  NO_AUTH: "no-auth",
};

export const TOAST_TYPES = {
  DEFAULT: "default",
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  LOADING: "loading",
  PROMISE: "promise",
  CUSTOM: "custom",
  NOTIFICATION: "notification",
};

export const TOAST_POSITIONS = {
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_RIGHT: "bottom-right",
};

export const NOTIFICATION_TYPES = {
  NEW_BLOG_POST: "NEW_BLOG_POST",
  BLOG_LIKED: "BLOG_LIKED",
  BLOG_COMMENTED: "BLOG_COMMENTED",
  NEW_FOLLOWER: "NEW_FOLLOWER",
  BLOG_SHARED: "BLOG_SHARED",
  COMMENT_REPLY: "COMMENT_REPLY",
  BLOG_BOOKMARKED: "BLOG_BOOKMARKED",
};

export const DEFAULT_TOAST_CONFIG = {
  position: TOAST_POSITIONS.TOP_RIGHT,
  richColors: true,
  closeButton: true,
  expand: true,
  visibleToasts: 5,
  duration: 5000,
  gap: 12,
};
