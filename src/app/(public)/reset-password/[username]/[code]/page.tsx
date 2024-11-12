'use client';
import { useState, useEffect, use } from 'react';
import {
    useValidator,
    notEmptyValidator,
    minLength8Validator,
    upperLowerCaseValidator
} from '@/hooks/useValidator';
import { ApiError, ErrorCode } from '@/types/types';
import StatusCode from 'status-code-enum';
import { PublicFormLayout } from '@/components/organism/PublicFormLayout';
import { BiCheck } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/api';

export default function ResetPasswordPage() {
    const [step, setStep] = useState<number>(1);
    const [password, setPassword] = useState<string>('');

    const router = useRouter();

    const [repeatPassword, setRepeatPassword] = useState<string>('');

    const [
        passwordDirty,
        passwordError,
        passwordMessage,
        passwordValidate,
        setDirtyPassword
    ] = useValidator(password, [
        notEmptyValidator,
        minLength8Validator,
        upperLowerCaseValidator
    ]);
    const [passwordMatchError, setPasswordMatchError] = useState<string>('');
    const [passwordMatchDirty, setPasswordMatchDirty] =
        useState<boolean>(false);
    const [codeError, setCodeError] = useState<string>('');
    const { code, username } = useParams<{ username: string, code: string }>();

    const passwordMatchValidate = () => {
        if (!passwordMatchDirty && (password || repeatPassword)) {
            setPasswordMatchDirty(true);
        }
        if (password === repeatPassword) {
            setPasswordMatchError('');
            return true;
        } else {
            setPasswordMatchError('The passwords do not match');
            return false;
        }
    };

    useEffect(() => {
        passwordMatchValidate();
    }, [password, repeatPassword]);

    const changePassword = async () => {
        const passwordValid = passwordValidate();
        const passwordMatchValid = passwordMatchValidate();
        if (passwordValid && passwordMatchValid) {
            await api.resetPassword(username, code, password);
        } else {
            // showToast('error', 'There are errors in the form');
        }
    };
    const { mutate: onChangePassword, isPending: isLoading } = useMutation({
        mutationFn: changePassword,
        onSettled: () => {
            setStep(2);
        },
        onSuccess: () => {
            // showToast('success', 'The password has been changed');
        },
        onError: (e) => {
            if (e instanceof ApiError) {
                if (e.statusCode === StatusCode.ClientErrorConflict) {
                    setCodeError('The code has already been used');
                    return;
                }
                if (e.statusCode === StatusCode.ClientErrorGone) {
                    setCodeError('The code has expired');
                    return;
                }
                if (
                    e.statusCode === StatusCode.ClientErrorUnauthorized &&
                    e.code === ErrorCode.INCORRECT_VALIDATION_CODE
                ) {
                    setCodeError('The code is invalid');
                    return;
                }
            }
            setCodeError('An internal error occurred');
        }
    });

    const disabledButton =
        isLoading || passwordError || passwordMatchError !== '';
    const sendCode = async () => {
        await api.forgottenPassword(username);
    };

    const { mutate: onSendCode } = useMutation({
        mutationFn: sendCode,
        onSuccess: () => {
            // showToast('success', 'The code was succesfully sent!');
        },
        onError: () => {
            // showToast('error', 'There was an error sending the new code');
        }
    });
    return (
        <PublicFormLayout
            title={'Reset password'}
            onSubmit={() => onChangePassword()}
        >
            {step === 1 ? (
                <>
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onBlur={() => setDirtyPassword()}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordDirty && passwordError ? (
                        <span className="text-error-600">
                            {passwordMessage}
                        </span>
                    ) : (
                        <></>
                    )}
                    <input
                        placeholder="Repeat password"
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    {passwordMatchDirty && passwordMatchError != '' ? (
                        <span className="text-error-600">
                            {passwordMatchError}
                        </span>
                    ) : (
                        <></>
                    )}
                    <button disabled={disabledButton} type="submit">
                        {isLoading ? 'Loading...' : 'Change password'}
                    </button>
                </>
            ) : (
                <>
                    {codeError ? (
                        <>
                            <div className="flex gap-2">
                                <IoMdClose className="text-3xl text-error" />
                                <span className="mb-4">{codeError}</span>
                            </div>
                            <span className="flex">
                                <span>{`Try to `}</span>
                                <a
                                    className="text-blue-500"
                                    onClick={() => onSendCode()}
                                >
                                    {' send another code'}
                                </a>
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <BiCheck className="text-3xl text-success" />
                                <span className="mb-4">
                                    {'Your password has been changed'}
                                </span>
                            </div>
                            <span className="flex">
                                <span>{`Now you can `}</span>
                                <a
                                    className="text-blue-500"
                                    onClick={() => router.push('/login')}
                                >
                                    {' sign in'}
                                </a>
                            </span>
                        </>
                    )}
                </>
            )}
        </PublicFormLayout>
    );
}
