// blog.store.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BLOG_STATUS } from "../../shared/constants/constants";

const INITIAL_BLOG_STATE = Object.freeze({
  _id: null,
  slug: null,
  title: "",
  coverImage: {
    url: "",
    publicId: "",
  },
  content: null,
  category: null,
  tags: [],
  description: "",
  status: BLOG_STATUS.DRAFT,
  scheduleDateAndTime: "",
  readingTime: {
    minutes: 0,
    words: 0,
  },
});

const useBlogStore = create(
  devtools(
    persist(
      immer((set) => ({
        blog: { ...INITIAL_BLOG_STATE },
        blogActions: {
          setBlogData: (data) =>
            set(
              (state) => {
                Object.assign(state.blog, data);
              },
              false,
              "blog/setBlogData"
            ),
          clearBlogData: () =>
            set(
              (state) => {
                state.blog = { ...INITIAL_BLOG_STATE };
              },
              false,
              "blog/clearBlogData"
            ),
        },
      })),
      {
        name: "blog-store",
        version: 1,
        partialize: (state) => ({ blog: state.blog }),
      }
    ),
    { name: "BlogStore" }
  )
);

// Selectors
export const useBlogData = () => useBlogStore((state) => state.blog);
export const useBlogActions = () => useBlogStore((state) => state.blogActions);
