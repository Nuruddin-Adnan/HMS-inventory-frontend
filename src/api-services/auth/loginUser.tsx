import { fetchData } from "@/lib/fetchData";
import { ILoginUser } from "@/types/auth";

export const loginUser = async (payload: Partial<ILoginUser>) => {
  const result = await fetchData("auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return result;
};



// createUser,
// loginUser,
// refreshToken,
// changePassword,
