import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const cookie = request.cookies.get('token')?.value
    const pathName = request.nextUrl.pathname

    const response = await fetch('http://localhost:8080/me', {
        headers: {
            Authorization: `Bearer ${cookie}`,
        }
    });
    const data = await response.json()

    if (response.status !== 200 && pathName.startsWith('/dashboard')) return NextResponse.redirect(new URL('/', request.url))
    if (response.status === 200 && pathName === '/') return NextResponse.redirect(new URL('/dashboard', request.url))
    if (pathName.startsWith('/dashboard') && pathName !== '/dashboard/employee' && data.data[0].role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/employee', request.url))
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/', '/logout'],
}

