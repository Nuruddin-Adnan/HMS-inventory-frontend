import { fetchData } from "@/lib/fetchData";
import { IPermission } from "@/types/permission";
import Cookies from 'js-cookie'

export const createPermission = async (payload: IPermission) => {
  const result = await fetchData(`permissions/create-permission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": Cookies.get('accessToken')
    },
    body: JSON.stringify(payload),
  });

  return result;
};
