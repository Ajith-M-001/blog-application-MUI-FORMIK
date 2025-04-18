import { BLOG_STATUS } from "../../../../common/constants/constants";

const initialBlogData = {
  blog: {
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
  },
};

export const createBlogSlice = (set) => ({
  ...initialBlogData,
  setBlogData: (data) =>
    set(
      (state) => ({
        ...state,
        ...data,
      }),
      false,
      "blog/setBlogData"
    ),

  clearBlogData: () =>
    set(() => ({ ...initialBlogData }), false, "blog/clearBlogData"),
});
