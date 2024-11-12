'use client';
import { useState, useEffect, useRef } from 'react';
import { ApiError, ErrorCode } from '@/types/types';
import StatusCode from 'status-code-enum';
import { PublicFormLayout } from '@/components/organism/PublicFormLayout';
import { BiCheck } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { api } from '@/api';
import { useRouter } from 'next/navigation';

export default function ValidateAccountPage() {
    // const navigate = useNavigate();
    const params = useParams<{ username: string; code: string }>();
    const [step, setStep] = useState<number>(1);
    // const { code, username } = useParams();
    const [codeError, setCodeError] = useState<string>('');

    //Avoid problems of double validation (strict mode)
    const alreadyValidatedRef = useRef(false);

    const router = useRouter();

    useEffect(() => {
        if (alreadyValidatedRef.current) {
            return;
        }
        onValidateAccount();
        alreadyValidatedRef.current = true;
    }, []);

    const validate = async () => {
        await api.validateAccount(params.username, params.code);
    };

    const { mutate: onValidateAccount, isPending: isLoading } = useMutation({
        mutationFn: validate,
        onSettled: () => {
            setStep(2);
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

    const sendCode = async () => {
        await api.sendValidationCode(params.username);
    };

    const { mutate: onResendCode } = useMutation({
        mutationFn: sendCode,
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
            // showToast('error', 'There was an error sending the new code');
        }
    });

    return (
        <PublicFormLayout title={'Email validation'}>
            {step === 1 ? (
                <div className="ml-auto mr-auto mt-2 flex flex-col items-center gap-4">
                    <span className="mb-4">{'Validating...'}</span>
                </div>
            ) : (
                <>
                    {codeError ? (
                        <>
                            <div className="flex gap-2">
                                <IoMdClose className="text-3xl text-error" />
                                <span className="mb-4">{codeError}</span>
                            </div>
                            <span className="flex">
                                {isLoading ? (
                                    <span>{'Sending...'}</span>
                                ) : (
                                    <>
                                        <span>{`Try to `}</span>
                                        <a
                                            className="text-blue-500"
                                            onClick={() => onResendCode()}
                                        >
                                            {' send another code'}
                                        </a>
                                    </>
                                )}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <BiCheck className="text-3xl text-success" />
                                <span className="mb-4">
                                    {'Your email has been validated'}
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
            <></>
        </PublicFormLayout>
    );

}
