'use client'

import { useEffect, useLayoutEffect, useState } from 'react';
import { useValidator, notEmptyValidator } from '@/hooks/useValidator';
import { ApiError, ApiResponse, ErrorCode } from '@/types/types';
import { IoMdClose } from 'react-icons/io';
import StatusCode from 'status-code-enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { PublicFormLayout } from '@/components/organism/PublicFormLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/types/entities';
import { getSession, signIn } from 'next-auth/react';


export default function LoginForm() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const goHomeIfAuthenticated = async () => {
        const session = await getSession();
        if (session && session.user.authTokenExpiration <= new Date().getTime()) {
            router.push('/home');
        }
    }

    useLayoutEffect(() => {
        goHomeIfAuthenticated();
    }, [])


    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [notValidatedAccount, setNotValidatedAccount] =
        useState<boolean>(false);

    const [
        usernameDirty,
        usernameError,
        usernameMessage,
        usernameValidate,
        setDirtyUsername
    ] = useValidator(username, [notEmptyValidator]);
    const [
        passwordDirty,
        passwordError,
        passwordMessage,
        passwordValidate,
        setDirtyPassword
    ] = useValidator(password, [notEmptyValidator]);

    const resendCode = async () => {
        // await sendValidationCode(username);
    };

    const { mutate: onResendCode } = useMutation({
        mutationFn: resendCode,
        onSuccess: () => {
            // showToast('success', 'The code was succesfully sent!');
        },
        onError: (e) => {
            if (e instanceof ApiError) {
                if (e.statusCode === StatusCode.ClientErrorConflict) {
                    // showToast('error', 'The account is already validated');
                    return;
                }
            }
            if (e instanceof Error) {
                // showToast('error', 'Internal error');
                return;
            }
        }
    });



    const login = async (
        username: string,
        password: string,
        rememberMe: boolean
    ): Promise<User> => {
        const url = `${apiUrl}public/login`;
        const options: RequestInit = {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ username, password, rememberMe }),
            headers: new Headers({
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const result: ApiResponse<User> = await res.json();
        if (!res.ok) {
            throw new ApiError({
                statusCode: res.status,
                message: result.errorMessage,
                code: result.errorCode
            });
        }
        return result.data;
    };

    const authenticate = async () => {
        const usernameValid = usernameValidate();
        const passwordValid = passwordValidate();
        if (usernameValid && passwordValid) {
            await signIn("credentials", { username, password, rememberMe, redirect: true, callbackUrl: '/home' });
        } else {
            console.log('There was an error in the form');
            // showToast('error', 'There are errors in the form');
        }
    }


    const { mutate: onLogin, isPending: isLoading } = useMutation({
        mutationFn: authenticate,
        onSuccess: () => {
            // console.log('onSuccess');
        },
        onError: (e) => {
            console.log("ERRORRRR",e);
            if (e instanceof ApiError) {
                if (
                    e.statusCode === StatusCode.ClientErrorForbidden &&
                    e.code === ErrorCode.NOT_VALIDATED_ACCOUNT
                ) {
                    setNotValidatedAccount(true);
                    return;
                }
                if (
                    e.statusCode === StatusCode.ClientErrorUnauthorized &&
                    e.code === ErrorCode.INVALID_CREDENTIALS
                ) {
                    // showToast('error', 'Wrong credentials');
                    return;
                }
            }
            if (e instanceof Error) {
                // showToast('error', 'Internal error');
                return;
            }
        }
    });

    const disabledButton = isLoading || usernameError || passwordError;

    return (
        !notValidatedAccount ? (
            <PublicFormLayout onSubmit={() => onLogin()} title={'Sign in'}>
                <input
                    placeholder="Username"
                    value={username}
                    onBlur={() => setDirtyUsername()}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameDirty && usernameError ? (
                    <span className="text-error-600">
                        {usernameMessage}
                    </span>
                ) : (
                    <></>
                )}

                <input
                    placeholder="Password"
                    type="password"
                    onBlur={() => setDirtyPassword()}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordDirty && passwordError ? (
                    <span className="text-error-600">
                        {passwordMessage}
                    </span>
                ) : (
                    <></>
                )}
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                            setRememberMe(e.target.checked)
                        }
                    />
                    {'Remember me'}
                </label>
                <button type="submit" disabled={disabledButton}>
                    {isLoading ? 'Loading...' : 'Sign in'}
                </button>

                <Link href="/forgotten-password">
                    {'I have forgotten my password'}

                </Link>

                <span className="flex mt-5">
                    <span>{`New here? ${'\u00A0'}`}</span>
                    <Link href="/register">
                        {'Sign up'}

                    </Link>
                </span>
            </PublicFormLayout>
        ) : (
            <>
                <div className="flex gap-2">
                    <IoMdClose className="text-3xl text-error" />
                    <span className="mb-4">
                        {'Your account has not been validated'}
                    </span>
                </div>
                <span className="mb-4">{`In order to validate the account you should follow the instructions we sent you via email`}</span>
                <span>
                    <span>{`You can't see the email? Try to `}</span>
                    <a
                        className="text-blue-500"
                        onClick={() => onResendCode()}
                    >
                        {'send another code'}
                    </a>
                </span>
            </>
        )
    );
}

