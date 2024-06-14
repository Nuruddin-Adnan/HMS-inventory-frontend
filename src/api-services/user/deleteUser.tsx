import { fetchData } from "@/lib/fetchData";
import Cookies from 'js-cookie'

export const deleteUser = async (id: string) => {
  const result = await fetchData(`users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": Cookies.get('accessToken')
    },
  });

  return result;
};
