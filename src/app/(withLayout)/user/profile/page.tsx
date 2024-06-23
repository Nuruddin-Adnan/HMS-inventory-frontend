import React from 'react'
import UserForm from './userForm'
import { getMyProfile } from '@/api-services/user/myProfile';

export default async function Profile() {
    const { data } = await getMyProfile();

    return (
        <div className='container'>
            <div className="card max-w-5xl mx-auto">
                <div className="border-b border-gray-200 2xl:p-4 p-3">
                    <h2 className='font-bold 2xl:text-2xl text-xl text-textPrimary'>Profile</h2>
                </div>
                <div className="2xl:px-4 px-3 2xl:py-5 py-4">
                    <UserForm user={data} />
                </div>
            </div>
        </div>
    )
}
