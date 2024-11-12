'use client';
import { useState, useEffect } from 'react';
import {
    emailValidator,
    minLength8Validator,
    notEmptyValidator,
    upperLowerCaseValidator,
    useValidator
} from '@/hooks/useValidator';
import { ApiError, ErrorCode } from '@/types/types';
import StatusCode from 'status-code-enum';
import { PublicFormLayout } from '@/components/organism/PublicFormLayout';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [serviceTermsAccepted, setServiceTermsAccepted] =
        useState<boolean>(false);

    const router = useRouter();

    const [
        usernameDirty,
        usernameError,
        usernameMessage,
        usernameValidate,
        setDirtyUsername
    ] = useValidator(username, [notEmptyValidator]);
    const [emailDirty, emailError, emailMessage, emailValidate, setDirtyEmail] =
        useValidator(email, [notEmptyValidator, emailValidator]);
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
    const [serviceTermsAcceptedDirty, setServiceTermsAcceptedDirty] =
        useState<boolean>(false);
    const [serviceTermsAcceptedError, setServiceTermsAcceptedError] =
        useState<string>('');
    const [, setIsTermsOfServiceOpen] = useState<boolean>(false);


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

    const serviceTermsAcceptedValidate = () => {
        if (!serviceTermsAcceptedDirty) {
            setServiceTermsAcceptedDirty(true);
        } else {
            if (serviceTermsAccepted) {
                setServiceTermsAcceptedError('');
                return true;
            } else {
                setServiceTermsAcceptedError(
                    'You must accepte the terms of service'
                );
                return false;
            }
        }
    };

    useEffect(() => {
        passwordMatchValidate();
    }, [password, repeatPassword]);

    useEffect(() => {
        serviceTermsAcceptedValidate();
    }, [serviceTermsAccepted]);

    const registerUser = async () => {
        const usernameValid = usernameValidate();
        const emailValid = emailValidate();
        const passwordValid = passwordValidate();
        const passwordMatch = passwordMatchValidate();
        const serviceTermsAccepted = serviceTermsAcceptedValidate();
        if (
            usernameValid &&
            emailValid &&
            passwordValid &&
            passwordMatch &&
            serviceTermsAccepted
        ) {
            await api.register({ username, email, password });
        } else {
            throw new Error('There are errors in the form');
        }
    };

    const { mutate: onRegister, isPending: isLoading } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            // showToast('success', 'User succesfully registered');
            router.push('/login');
        },
        onError: (e) => {
            if (e instanceof ApiError) {
                if (e.statusCode === StatusCode.ClientErrorConflict) {
                    if (e.code === ErrorCode.USERNAME_ALREADY_IN_USE) {
                        // showToast('error', 'The username is already in use');
                        return;
                    }
                    if (e.code === ErrorCode.EMAIL_ALREADY_IN_USE) {
                        // showToast('error', 'The email is already in use');
                        return;
                    }
                }
            }
            if (e instanceof Error) {
                // showToast('error', 'Internal error');
                return;
            }
        }
    });

    const disabledButton =
        isLoading ||
        emailError ||
        passwordError ||
        passwordMatchError !== '' ||
        usernameError ||
        serviceTermsAcceptedError !== '' ||
        !serviceTermsAccepted;

    return (
        <PublicFormLayout onSubmit={() => onRegister()} title={'Sign up'}>
            <input
                placeholder="Email"
                value={email}
                onBlur={() => setDirtyEmail()}
                onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && emailDirty ? (
                <span className="text-error-600">{emailMessage}</span>
            ) : (
                <></>
            )}

            <input
                placeholder="Username"
                value={username}
                onBlur={() => setDirtyUsername()}
                onChange={(e) => setUsername(e.target.value)}
            />
            {usernameDirty && usernameError ? (
                <span className="text-error-600">{usernameMessage}</span>
            ) : (
                <></>
            )}

            <input
                placeholder="Password"
                type="password"
                value={password}
                onBlur={() => setDirtyPassword()}
                onChange={(e) => setPassword(e.target.value)}
            />
            {passwordDirty && passwordError ? (
                <span className="text-error-600">{passwordMessage}</span>
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
                <span className="text-error-600">{passwordMatchError}</span>
            ) : (
                <></>
            )}
            <label className="flex gap-2 items-center">
                <input
                    type="checkbox"
                    onChange={(e) =>
                        setServiceTermsAccepted(e.target.checked)
                    }
                ></input>
                {'I accept the '}
                <a onClick={() => setIsTermsOfServiceOpen(true)}>
                    {'terms of service'}
                </a>
            </label>
            {serviceTermsAcceptedDirty &&
                serviceTermsAcceptedError != '' ? (
                <span className="text-error-600">
                    {serviceTermsAcceptedError}
                </span>
            ) : (
                <></>
            )}
            <button disabled={disabledButton} type="submit">
                {isLoading ? 'Loading...' : 'Sign up'}
            </button>

            {/* <Modal isOpen={isTermsOfServiceOpen} onClose={() => setIsTermsOfServiceOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{'Terms of service'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Typography mode='body'>{conf.termsOfService}</Typography>
                        </ModalBody>
                    </ModalContent>
                </Modal> */}
        </PublicFormLayout>
    );
}
