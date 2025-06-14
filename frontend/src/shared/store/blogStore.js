// src/store/blogStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { BLOG_STATUS } from "../constants/constants";

const INITIAL_BLOG_STATE = {
  _id: null,
  title: "",
  slug: "",
  content: { type: "doc", content: [] },
  description: "",
  coverImage: { url: null, public_id: null },
  author: { _id: null, username: "", avatar: { public_id: null, url: null } },
  tags: [],
  status: BLOG_STATUS.DRAFT,
  scheduleDateAndTime: null,
  readingTime: { words: 0, minutes: 0 },
  likes: [],
  bookmarks: [],
  publishedAt: null,
  blogActivity: {
    total_views: 0,
    total_likes: 0,
    total_comments: 0,
    total_shares: 0,
    total_bookmarks: 0,
    total_replies: 0,
  },
  createdAt: null,
  updatedAt: null,
  category: { _id: null, name: "" },
};

const useBlogStore = create(
  subscribeWithSelector(
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
  )
);

// Selectors
export const useBlogData = () => useBlogStore((state) => state.blog);
export const useBlogActions = () => useBlogStore((state) => state.blogActions);

export default useBlogStore;
