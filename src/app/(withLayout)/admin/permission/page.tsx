import PermissionTable from './permissionTable'
import { getAllPermissions } from '@/api-services/permission/getAllPermissions'

export default async function Permission() {
    const { data: permissions } = await getAllPermissions('sort=-createdAt')
    return (
        <div className='card pb-4'>
            <PermissionTable permissions={permissions} />
        </div>
    )
}
