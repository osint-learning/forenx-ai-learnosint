import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const completeLesson = async (
  lessonId: string,
  toolId: string,
  token: string
) => {
  const { data } = await API.post(
    `/lesson-progress/${lessonId}`,
    {
      toolId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const getLessonProgress = async (
  toolId: string,
  token: string
) => {
  const { data } = await API.get(
    `/lesson-progress/${toolId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
export const isLessonCompleted = async (
  toolId: string,
  lessonId: string,
  token: string
) => {
  const { data } = await API.get(
    `/lesson-progress/${toolId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.data.some(
    (progress: any) =>
      progress.lesson === lessonId ||
      progress.lesson?._id === lessonId
  );
};