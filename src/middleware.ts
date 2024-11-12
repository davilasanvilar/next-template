import { getServerSession } from 'next-auth'
import { decode, encode, getToken, JWT } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LoginResult } from './types/entities'
import { ApiError, ApiResponse } from './types/types'

const PUBLIC_ROUTES = ['/login', '/register', '/forgotten-password', '/reset-password', '/validate','/not-validated-account', '/home']
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const refreshToken = async (token: JWT): Promise<JWT> => {
    const url = `${apiUrl}public/refresh-token`;
    const options: RequestInit = {
        method: 'POST',
        body: token.refreshToken,
        headers: new Headers({
            'content-type': 'application/json'
        })
    };
    const res = await fetch(url, options);
    const result: ApiResponse<LoginResult> = await res.json();
    if (!res.ok) {
        throw new ApiError({ message: result.errorMessage, statusCode: res.status, code: result.errorCode });
    }
    return {
        ...token,
        authToken: result.data.authToken,
        authTokenExpiration: result.data.authTokenExpiration,
        refreshToken: result.data.refreshToken
    }
}

const updateCookie = (request: NextRequest, response: NextResponse, token: string):
    NextResponse<unknown> => {
    request.cookies.set("next-auth.session-token", token);
    response = NextResponse.next({
        request: {
            headers: request.headers
        }
    });
    response.cookies.set("next-auth.session-token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 30,
        secure: false,
        sameSite: "lax"
    });
    return response
}

const removeCookie = (request: NextRequest, response: NextResponse) => {
    response = NextResponse.next({
        request: {
            headers: request.headers
        }
    });
    response.cookies.delete("next-auth.session-token");
}

export async function middleware(request: NextRequest) {
    console.log("middleware", request.nextUrl.pathname)
    if (PUBLIC_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next()
    }
    const token = await getToken({ req: request })
    
    if (!token) {
        const url = new URL("/login", request.nextUrl.origin)
        return NextResponse.redirect(url)
    }
    const bufferExpirationTime = 1000 * 5
    if (token.authTokenExpiration <= (new Date()).getTime() + bufferExpirationTime) {
        try {
            const newToken = await refreshToken(token)
            const newSessionToken = await encode({
                secret: process.env.NEXTAUTH_SECRET || '',
                token: newToken,
                maxAge: 60 * 60 * 30
            });
            const responseWithNewCookie = updateCookie(request, NextResponse.next(), newSessionToken)
            return responseWithNewCookie
        } catch (e) {
            removeCookie(request, NextResponse.next())
            const url = new URL("/login", request.nextUrl.origin)
            url.searchParams.set("expiredSession", "true")
            return NextResponse.redirect(url)
        }
    }
    return NextResponse.next()
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        `/((?!_next/static|_next/image|favicon.ico|api/auth).*)`,
    ]
}
