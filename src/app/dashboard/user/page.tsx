import UserPage from '@/app/components/UserPage'
import { cookies } from 'next/headers'

export default function GetToken() {
    const cookieStore = cookies()
    const tokenCookies = cookieStore.get('token')!.value
    return (
        <>
            <UserPage cookie={tokenCookies}/>
        </>
    )
}