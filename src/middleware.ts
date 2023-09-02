import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const cookie = request.cookies.get('token')
    const pathName = request.nextUrl.pathname

    if (!cookie?.value && pathName.startsWith('/dashboard')) return NextResponse.redirect(new URL('/', request.url))
    if (cookie && pathName === '/') return NextResponse.redirect(new URL('/dashboard', request.url))

    if (cookie && pathName === '/dashboard/user' || pathName === '/dashboard') {
        try {
            const response = await fetch('http://localhost:8080/me', {
                headers: {
                    Authorization: `Bearer ${cookie!.value}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const role = data.data[0].role
                if (role !== "ADMIN") return NextResponse.redirect(new URL('/dashboard/employee', request.url))
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/', '/logout'],
}

