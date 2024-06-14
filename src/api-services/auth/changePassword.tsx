import { fetchData } from "@/lib/fetchData";
import { IChangePassword } from "@/types/auth";
import Cookies from 'js-cookie'

export const changePassword = async (payload: Partial<IChangePassword>) => {
    const result = await fetchData("auth/change-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": Cookies.get('accessToken')
        },
        body: JSON.stringify(payload),
    });

    return result;
};

