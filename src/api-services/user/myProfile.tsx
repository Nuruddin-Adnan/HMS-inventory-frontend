import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";

export const getMyProfile = async () => {
    const result = await fetchData(
        `users/my-profile`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookies().toString(),
            },
        },
        false
    );

    return result;
};