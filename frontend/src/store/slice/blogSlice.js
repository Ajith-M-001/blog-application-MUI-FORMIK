import { BLOG_STATUS } from "../../shared/constants/constants";

const INITIAL_BLOG_STATE = {
  title: "",
  coverImage: {
    url: "",
    public_id: "",
  },
  content: null,
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
    setBlogData: (data) =>
      set((state) => {
        Object.assign(state.blog, data);
      }),

    clearBlogData: () =>
      set(() => ({ blog: INITIAL_BLOG_STATE }), false, "blog/clearBlogData"),
  },
});
