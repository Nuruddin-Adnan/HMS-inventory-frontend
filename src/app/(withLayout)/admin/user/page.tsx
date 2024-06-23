import { getAllUsers } from '@/api-services/user/getAllUsers'
import UserTable from './userTable'

export default async function User() {
    const { data: users } = await getAllUsers('sort=-createdAt')

    return (
        <div className='card pb-4'>
            <UserTable users={users} />
        </div>
    )
}
