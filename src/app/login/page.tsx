/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Input from "@/components/ui/form/Input";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { useFormState } from "react-dom";
import { createUser } from "./actions";
import { SubmitButton } from "./submit-button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const initialState = {
  message: "",
};

export default function Login() {
  const [state, formAction] = useFormState(createUser, initialState);

  const router = useRouter();

  // Inside your `useFormState` handler:
  useEffect(() => {
    if (state.message === "Login successful") {
      router.push("/");
    }
  }, [state.message]);

  return (
    <main className="grid place-items-center h-screen bg-[#E9EFF2]">
      <div className="max-w-md w-full p-2">
        <div className="text-center">
          <Image src={logo} alt="logo" width={50} className="mx-auto" />
          <h1 className="text-textPrimary text-3xl font-bold py-4">Sign in </h1>
          <p className="text-sm text-textSecondary">
            Thank you for get back Hospital, let&apos;s acess our the best
            recommendation for you.
          </p>
        </div>
        <div className="sm:p-8 p-4 shadow-lg rounded-2xl bg-white mt-4">
          <form action={formAction} className="grid space-y-3">
            <Input
              type="text"
              name="email"
              placeholder="user name"
              label="Username"
              className="py-1.5"
            />
            <Input
              type="password"
              name="password"
              placeholder="password"
              label="Password"
              className="py-1.5"
            />
            <p aria-live="polite" className={state?.message === 'Login successful' ? 'text-green-600' : 'text-red-500'}>
              {state?.message}
            </p>
            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  );
}
