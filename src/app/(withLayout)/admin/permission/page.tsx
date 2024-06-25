import { getUserServer } from '@/lib/user';
import PermissionTable from './permissionTable'
import { getAllPermissions } from '@/api-services/permission/getAllPermissions'
import { redirect } from 'next/navigation';

export default async function Permission() {
    const user = getUserServer();

    const allowedRoles = new Set(["super_admin", "admin"]);
    if (!allowedRoles.has(user!?.role)) {
        redirect("/");
    }

    const { data: permissions } = await getAllPermissions('sort=-createdAt')
    return (
        <div className='card pb-4'>
            <PermissionTable permissions={permissions} />
        </div>
    )
}
