import { fetchData } from "@/lib/fetchData";
import { IPermission } from "@/types/permission";
import Cookies from 'js-cookie'

export const updatePermission = async (
  id: string,
  payload: Partial<IPermission>
) => {
  const result = await fetchData(`permissions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": Cookies.get('accessToken')
    },
    body: JSON.stringify(payload),
  });

  return result;
};
