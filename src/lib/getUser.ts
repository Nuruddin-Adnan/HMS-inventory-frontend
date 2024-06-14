import Cookies from 'js-cookie'

import { jwtDecode, JwtPayload } from "jwt-decode";

interface IUser extends JwtPayload {
  _id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  permission: string[];
  status: "active" | "deactive";
}

export function getUser(): IUser | null {
  if (typeof window !== "undefined") {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const user: IUser = jwtDecode(token);
        return user;
      } catch (error) {
        return null;
      }
    }
  }

  return null;
}
