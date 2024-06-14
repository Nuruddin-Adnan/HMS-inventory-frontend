import { fetchData } from "@/lib/fetchData";
import Cookies from 'js-cookie'

export const createUser = async (payload: any) => {
    const result = await fetchData("auth/signup", {
        method: "POST",
        headers: {
            // "Content-Type": "application/json",
            "Authorization": Cookies.get('accessToken')
        },
        body: payload,
    });

    return result;
};