// 'use client';

// import { createContext, ReactNode } from 'react';
// import { LoginResponse, User } from '../types/entities';
// import { ApiError, ApiResponse } from '../types/types';
// import StatusCode from 'status-code-enum';

// export interface AuthContext {
//     user?: User;
//     authToken?: string;
//     authenticate: (
//         email: string,
//         password: string,
//         rememberMe: boolean
//     ) => void;
//     logout: () => void;
//     isLoadingUserInfo: boolean;
//     fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
// }

// export const AuthContext = createContext<AuthContext>({} as AuthContext);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;



//     // const fetchWithAuth = async (url: string, options: RequestInit) => {
//     //     if (options.headers === undefined) {
//     //         options.headers = new Headers();
//     //     }
//     //     const headers = options.headers as Headers;
//     //     headers.set('Authorization', `Bearer ${authToken || authTokenRef.current}`)
//     //     const response = await fetch(url, options)
//     //     //If the first response is unauthorized, we try to refresh the token
//     //     if (response.status === StatusCode.ClientErrorUnauthorized) {
//     //         //If the token is already being refreshed, we wait until it is finished
//     //         let newAuthToken = ''
//     //         if (refreshingPromise) {
//     //             newAuthToken = await refreshingPromise
//     //         } else {
//     //             refreshingPromise = refreshToken()
//     //             try {
//     //                 newAuthToken = await refreshingPromise
//     //             } catch { }
//     //             finally {
//     //                 refreshingPromise = null
//     //             }
//     //         }
//     //         if (newAuthToken) {
//     //             const secondResponse = await fetch(url, options)
//     //             return secondResponse
//     //             //If the refresh token fails, we clean the user data and return the first response (unauthorized)
//     //         } else {
//     //             return response;
//     //         }
//     //     }
//     //     return response
//     // }


//     // const self = async (): Promise<User | undefined> => {
//     //     const url = `${apiUrl}self`;
//     //     const options: RequestInit = {
//     //         method: 'GET',
//     //         credentials: 'include',
//     //     };
//     //     const res = await fetchWithAuth(url, options);
//     //     const result: ApiResponse<User> = await res.json();
//     //     if (!res.ok) {
//     //         if (res.status !== StatusCode.ClientErrorUnauthorized) {
//     //             throw new ApiError({
//     //                 statusCode: res.status,
//     //                 message: result.errorMessage,
//     //                 code: result.errorCode
//     //             });
//     //         }
//     //     }
//     //     return result.data;
//     // };

//     // const login = async (
//     //     username: string,
//     //     password: string,
//     //     rememberMe: boolean
//     // ): Promise<LoginResponse> => {
//     //     const url = `${apiUrl}public/login`;
//     //     const options: RequestInit = {
//     //         method: 'POST',
//     //         credentials: 'include',
//     //         body: JSON.stringify({ username, password, rememberMe }),
//     //         headers: new Headers({
//     //             'content-type': 'application/json'
//     //         })
//     //     };
//     //     const res = await fetch(url, options);
//     //     const result: ApiResponse<LoginResponse> = await res.json();
//     //     if (!res.ok) {
//     //         throw new ApiError({
//     //             statusCode: res.status,
//     //             message: result.errorMessage,
//     //             code: result.errorCode
//     //         });
//     //     }
//     //     return result.data;
//     // };




//     const value: AuthContext = {
//         user,
//         authToken,
//         authenticate,
//         logout,
//         isLoadingUserInfo,
//         fetchWithAuth
//     };

//     return (
//         <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//     );
// };
