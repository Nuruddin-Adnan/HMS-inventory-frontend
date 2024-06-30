import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createStock = async (payload: any) => {
  const result = await fetchData(`stocks/create-stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
