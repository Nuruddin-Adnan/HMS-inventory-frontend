import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createBrand = async (payload: any) => {
  const result = await fetchData(`brands/create-brand`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
