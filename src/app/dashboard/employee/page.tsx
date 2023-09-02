import EmployeePage from '@/app/components/EmployeePage'
import { cookies } from 'next/headers'

export default function GetToken() {
    const cookieStore = cookies()
    const tokenCookies = cookieStore.get('token')!.value
    return (
        <>
            <EmployeePage cookie={tokenCookies} />
        </>
    )
}