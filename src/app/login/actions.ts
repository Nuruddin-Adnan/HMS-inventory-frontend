"use server";

import { cookies } from "next/headers";

export async function createUser(prevState: any, formData: FormData) {
  const payload = {
    email: (formData.get("email") ?? "") as string,
    password: (formData.get("password") ?? "") as string,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      return {
        message: "Login failed. Please try again.",
      };
    }

    const result = await response.json();
    const token = result.data.accessToken;

    // Set the token as a cookie
    cookies().set("accessToken", token);

    return {
      message: "Login successful",
    };
  } catch (error) {
    return {
      message: "Something went wrong. Please try again later.",
    };
  }
}
