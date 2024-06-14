import { fetchData } from "@/lib/fetchData";
import { IUser } from "@/types/uesr";
import Cookies from 'js-cookie'

export const updateUser = async (id: string, payload: Partial<IUser>) => {
  const result = await fetchData(`users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": Cookies.get('accessToken')
    },
    body: JSON.stringify(payload),
  });

  return result;
};
