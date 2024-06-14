import { isUserExist } from "@/lib/user";
import { redirect } from "next/navigation";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isUserLogin = isUserExist();

    if (!isUserLogin) {
        redirect("/login");
    }

    return <>{children}</>;
}
