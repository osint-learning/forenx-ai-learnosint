import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllLessons = async () => {
  const { data } = await API.get("/lessons");
  return data;
};

export const getLessonById = async (id: string) => {
  const { data } = await API.get(`/lessons/${id}`);
  return data;
};