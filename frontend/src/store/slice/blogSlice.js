import { BLOG_STATUS } from "../../../../common/constants/constants";

const initialBlogState = {
  title: "",
  coverImage: {
    url: "",
    public_id: "",
  },
  content: {},
  category: "",
  tags: [],
  shortDescription: "",
  status: BLOG_STATUS.DRAFT,
  scheduleDate: "",
  readingTime: {
    minutes: 0,
    words: 0,
  },
};

export const createBlogSlice = (set) => ({
  blog: initialBlogState,
  setBlogData: (data) =>
    set(
      (state) => {
        Object.assign(state.blog, data);
      },
      false,
      "blog/setBlogData"
    ),

  clearBlogData: () =>
    set(() => ({ blog: initialBlogState }), false, "blog/clearBlogData"),
});
