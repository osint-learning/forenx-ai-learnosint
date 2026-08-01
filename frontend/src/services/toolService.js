import api from "./api";

export const getAllTools = async () => {
  const response = await api.get("/tools");
  return response.data.data;
};
export const getToolsByCategory = async (category) => {
  const response = await api.get(
    `/tools/category/${encodeURIComponent(category)}`
  );

  return response.data.data;
};
export const getToolById = async (id) => {
  const response = await api.get(`/tools/${id}`);
  return response.data.data;
};