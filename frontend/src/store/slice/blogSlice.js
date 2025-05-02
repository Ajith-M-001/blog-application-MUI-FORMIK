import { BLOG_STATUS } from "../../constants/constants";

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
    setBlogData: (data) =>
      set((state) => {
        Object.assign(state.blog, data);
      }),

    clearBlogData: () =>
      set(() => ({ blog: INITIAL_BLOG_STATE }), false, "blog/clearBlogData"),
  },
});

// setBlogData: (data) =>
//   set((state) => {
//     Object.assign(state.blog, data);
//   }),
