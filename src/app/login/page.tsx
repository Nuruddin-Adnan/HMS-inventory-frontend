"use client";
import { loginUser } from "@/api-services/auth/loginUser";
import Input from "@/components/ui/form/Input";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const payload = {
      email: (formData.get("email") ?? "") as string,
      password: (formData.get("password") ?? "") as string,
    };

    const result = await loginUser(payload);

    if (result && result.success === true) {
      const token = result.data.accessToken;
      Cookies.set("accessToken", token);
      router.push("/", { scroll: false });
    }
  };

  return (
    <main className="grid place-items-center h-screen bg-[#E9EFF2]">
      <div className="max-w-md w-full">
        <div className="text-center">
          <Image src={logo} alt="logo" width={50} className="mx-auto" />
          <h1 className="text-textPrimary text-3xl font-bold py-4">Sign in </h1>
          <p className="text-sm text-textSecondary">
            Thank you for get back Hospital, let&apos;s acess our the best
            recommendation for you.
          </p>
        </div>
        <div className="p-8 shadow-lg rounded-2xl bg-white mt-4">
          <form action={handleSubmit} className="grid space-y-5">
            <Input
              type="text"
              name="email"
              placeholder="user name"
              label="Username"
              className="py-2"
            />
            <Input
              type="password"
              name="password"
              placeholder="password"
              label="Password"
              className="py-2"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-primary text-white rounded font-bold text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
