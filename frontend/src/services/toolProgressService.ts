import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getProgress = async (token: string) => {
  const { data } = await API.get(
    "/tools/progress",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};