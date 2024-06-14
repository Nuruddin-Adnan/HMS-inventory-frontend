import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface IUser extends JwtPayload {
  _id: string;
  name: string;
  role: string;
  department: any;
  email: string;
  permission: string[];
  status: "active" | "deactive";
}

export function isUserExist() {
  if (!cookies().has("accessToken")) {
    return false;
  } else {
    return true;
  }
}

export function getUserServer(): IUser | null {
  if (cookies().get("accessToken")) {
    const token = cookies().get("accessToken");

    if (token?.value) {
      try {
        const user: IUser = jwtDecode(token?.value);
        return user;
      } catch (error) {
        return null;
      }
    }
  }

  return null; // Make sure to have a default return statement for all cases
}
