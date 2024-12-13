"use client";

import Button from "@/components/ui/button/Button";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      className="justify-center font-bold text-base"
      loading={pending}
    >
      Login
    </Button>
  );
}
