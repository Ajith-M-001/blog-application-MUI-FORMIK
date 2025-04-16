import { BLOG_STATUS } from "../../../../common/constants/constants";

const initialBlogData = {
  blog: {
    title: "dafsdfds",
    coverImage: {},
    content: {},
    category: "sadfdsaf",
    tags: [],
    shortDescription: "asdfdsaf",
    status: BLOG_STATUS.DRAFT,
    scheduleDate: "asdfdsfd",
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
