import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
    cookies().delete('token')
    return NextResponse.json({msg: 'Logout'})
}