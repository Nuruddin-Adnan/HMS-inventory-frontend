import { fetchData } from "@/lib/fetchData";
import { IUser } from "@/types/uesr";
import Cookies from 'js-cookie'

export const updateMyProfile = async (payload: Partial<IUser>) => {
    const result = await fetchData("users/my-profile", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": Cookies.get('accessToken')
        },
        body: JSON.stringify(payload),
    });

    return result;
};