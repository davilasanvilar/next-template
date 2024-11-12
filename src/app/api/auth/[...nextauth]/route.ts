import { useValidator } from './../../../../hooks/useValidator';
import { LoginResult, User } from "@/types/entities";
import { ApiError, ApiResponse } from "@/types/types";
import NextAuth, { getServerSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User as NextUser } from "next-auth";
import { AuthCredentials } from "@/types/next-auth";
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const login = async (credentials: AuthCredentials): Promise<NextUser | null> => {
    const url = `${apiUrl}public/login`;
    const options: RequestInit = {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            username: credentials.username, password: credentials.password,
            rememberMe: credentials.rememberMe === 'true'
        }),
        headers: new Headers({
            'content-type': 'application/json'
        })
    };
    const res = await fetch(url, options);
    const result: ApiResponse<LoginResult> = await res.json();
    if (!res.ok) {
        console.log("Error::::::", result.errorMessage)
        return null;
    }
    console.log("RESULT::::", result)
    return {
        id: result.data.user.id,
        name: result.data.user.username,
        email: result.data.user.email,
        authToken: result.data.authToken,
        authTokenExpiration: result.data.authTokenExpiration,
        refreshToken: result.data.refreshToken,
        validated: result.data.user.validated
    };

}


const refreshToken = async (refreshToken: string): Promise<LoginResult> => {
    const url = `${apiUrl}public/refresh-token`;
    const options: RequestInit = {
        method: 'POST',
        body: refreshToken,
        headers: new Headers({
            'content-type': 'application/json'
        })
    };
    const res = await fetch(url, options);
    const result: ApiResponse<LoginResult> = await res.json();
    if (!res.ok) {
        throw new ApiError({ message: result.errorMessage, statusCode: res.status, code: result.errorCode });
    }
    return result.data;
}

const signOut = async (): Promise<void> => {
    const session = await getServerSession(authOptions);
    const url = `${apiUrl}logout`;
    const options: RequestInit = {
        method: 'POST',
        headers: new Headers({
            'authorization': `Bearer ${session?.user.authToken ?? ''}`
        })
    };
    const res = await fetch(url, options);
    if (!res.ok) {
        const result: ApiResponse<void> = await res.json();
        throw new ApiError({ message: result.errorMessage, statusCode: res.status, code: result.errorCode });
    }
}


export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',

    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {},
                password: {},
                rememberMe: {}
            },
            async authorize(credentials, req) {
                if (credentials) {
                    const user = await login(credentials)
                    if (user) {
                        return user
                    }
                }
                return null
            }
        }),

    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user }) {
            console.log("USER::::", user)
            if (user.validated) {
                return true
            } else {
                return '/not-validated-account?username=' + user.name
            }
        },
        async jwt({ token, user }) {
            //If there is a user, we are in a sign in flow, so we only need to return the existing token
            if (user) {
                return {
                    ...token,
                    authToken: user.authToken,
                    authTokenExpiration: user.authTokenExpiration,
                    refreshToken: user.refreshToken
                }
            }
            const bufferExpirationTime = 1000 * 5
            if (token.authTokenExpiration <= (new Date()).getTime() + bufferExpirationTime) {
                try {
                    const newToken = await refreshToken(token.refreshToken)
                    return {
                        ...token,
                        authToken: newToken.authToken,
                        authTokenExpiration: newToken.authTokenExpiration,
                        refreshToken: newToken.refreshToken
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            return token
        },
        async session({ session, token }: any): Promise<any> {
            console.log("SESSION::::", session)
            console.log("TOKEN::::", token)
            session.user.authToken = token.authToken
            return session
        },
    },
    events: {
        signOut: async (message) => {
            await signOut()
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }