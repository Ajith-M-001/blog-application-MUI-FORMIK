import { BLOG_STATUS } from "../../../../common/constants/constants.mjs";

const INITIAL_BLOG_STATE = {
  title: "",
  coverImage: {
    url: "",
    public_id: "",
  },
  content: {},
  category: null,
  tags: [],
  shortDescription: "",
  status: BLOG_STATUS.DRAFT,
  scheduleDateAndTime: "",
  readingTime: {
    minutes: 0,
    words: 0,
  },
};

export const createBlogSlice = (set) => ({
  blog: INITIAL_BLOG_STATE,

  blogActions: {
    setBlogData: (data) => {
      console.log("Setting blog data:", data);
      set((state) => {
        Object.assign(state.blog, data);
        console.log("Updated blog state:", state.blog); // Optional: to log post-update
      });
    },

    clearBlogData: () =>
      set(() => ({ blog: INITIAL_BLOG_STATE }), false, "blog/clearBlogData"),
  },
});
