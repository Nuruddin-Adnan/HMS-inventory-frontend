import { fetchData } from "@/lib/fetchData";
import { IResetPassword } from "@/types/auth";
import Cookies from 'js-cookie'

export const resetPassword = async (id: string, payload: Partial<IResetPassword>) => {
    const result = await fetchData(`auth/reset-password/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": Cookies.get('accessToken')
        },
        body: JSON.stringify(payload),
    });

    return result;
};

