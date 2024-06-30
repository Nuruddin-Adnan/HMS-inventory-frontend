'use client'

import { createPermission } from "@/api-services/permission/createPermission"
import Button from "@/components/ui/button/Button"
import Input from "@/components/ui/form/Input"
import { removeEmptyFields } from "@/lib/removeEmptyFields"
import tagRevalidate from "@/lib/tagRevalidate"
import { redirect } from "next/navigation"
import { useState, useRef } from "react"

export default function PermissionForm() {
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null);



    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const payload = {
            name: (formData.get("name") ?? "") as string,
        };

        const nonEmptyPayload = removeEmptyFields(payload);
        const result = await createPermission(nonEmptyPayload);
        if (result && result.success === true) {
            // Reset the form
            if (formRef.current) {
                formRef.current.reset();
            }

            await tagRevalidate('permission')
            redirect('/admin/permission')
        }
        setLoading(false);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 shadow">
            <form ref={formRef} action={handleSubmit} className="grid 2xl:space-y-4 space-y-3">
                <Input type='text' name='name' label='Permission Name*' autoFocus />
                <div className="text-right">
                    <Button type='submit' variant='primary' loading={loading}>Create</Button>
                </div>
            </form>
        </div>
    )
}