// api/course.js
const app = getApp();

/**
 * 获取课程列表
 */
export const getCourseList = async (category) => {
  const url = category ? `/courses?category=${category}` : '/courses';
  const res = await app.request({ url });
  return res.data;
};

/**
 * 获取课程详情
 */
export const getCourseDetail = async (courseId) => {
  const res = await app.request({
    url: `/courses/${courseId}`,
  });
  return res.data;
};

/**
 * 获取课程句子列表
 */
export const getCourseSentences = async (courseId) => {
  const res = await app.request({
    url: `/courses/${courseId}/sentences`,
  });
  return res.data;
};
