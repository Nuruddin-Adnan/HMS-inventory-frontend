import { fetchData } from "@/lib/fetchData";
import Cookies from "js-cookie";

export const updateTax = async (id: string, payload: any) => {
  const result = await fetchData(`taxs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
