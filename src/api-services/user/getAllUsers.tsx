import { fetchData } from "@/lib/fetchData";
import { IUser } from "@/types/uesr";
import { cookies } from "next/headers";

export const getAllUsers = async (query: string = "") => {
  const result = await fetchData(
    `users?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      next: { revalidate: 60, tags: ["user"] },
    },
    false
  );

  return result;
};
