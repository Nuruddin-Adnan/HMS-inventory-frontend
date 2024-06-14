import { fetchData } from "@/lib/fetchData";
import Cookies from 'js-cookie'

export const updateSignature = async (id: string, payload: any) => {
    const result = await fetchData(`users/update-signature/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": Cookies.get('accessToken')
        },
        body: payload,
    });

    return result;
};
