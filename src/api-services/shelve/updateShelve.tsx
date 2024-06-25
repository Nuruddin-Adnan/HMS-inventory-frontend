import { fetchData } from "@/lib/fetchData";
import { IPermission } from "@/types/permission";
import Cookies from "js-cookie";

export const updateShelve = async (
  id: string,
  payload: any
) => {
  const result = await fetchData(`shelves/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("accessToken"),
    },
    body: JSON.stringify(payload),
  });

  return result;
};
