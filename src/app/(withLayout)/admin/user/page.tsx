import { getAllUsers } from '@/api-services/user/getAllUsers'
import UserTable from './userTable'
import { getUserServer } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function User() {
    const user = getUserServer();

    const allowedRoles = new Set(["super_admin", "admin"]);
    if (!allowedRoles.has(user!?.role)) {
        redirect("/");
    }

    const { data: users } = await getAllUsers('sort=-createdAt')

    return (
        <div className='card pb-4'>
            <UserTable users={users} />
        </div>
    )
}
