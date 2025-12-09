import type Response from "../type/response";
import client from "./client";

const getResponse = async <T>(url: string) => {
  const response = await client.get<Response<T>>(url);
  return response.data;
};

export default getResponse;
