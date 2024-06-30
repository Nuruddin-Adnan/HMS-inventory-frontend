import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createShelve = async (payload: any) => {
  const result = await fetchData(`shelves/create-shelve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};