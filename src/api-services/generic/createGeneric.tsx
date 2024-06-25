import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const createGeneric = async (payload: any) => {
  const result = await fetchData(`generics/create-generic`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
