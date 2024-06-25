import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createCategory = async (payload: any) => {
  const result = await fetchData(`categories/create-category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
