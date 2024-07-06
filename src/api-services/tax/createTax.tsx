import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createTax = async (payload: any) => {
  const result = await fetchData(`taxs/create-tax`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
