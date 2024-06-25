import { getUserServer } from '@/lib/user';
import { redirect } from 'next/navigation';
import React from 'react'

export default function AdminDashboard() {
    const user = getUserServer();

    const allowedRoles = new Set(["super_admin", "admin"]);
    if (!allowedRoles.has(user!?.role)) {
        redirect("/");
    }
    return (
        <div>AdminDashboard</div>
    )
}
