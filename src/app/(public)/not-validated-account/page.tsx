'use client';
import { ApiError, ErrorCode } from '@/types/types';
import StatusCode from 'status-code-enum';
import { PublicFormLayout } from '@/components/organism/PublicFormLayout';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { useSearchParams } from 'next/navigation';

export default function NotValidatedAccountPage() {

    const searchParams = useSearchParams();
    const username = searchParams.get('username');

    const sendCode = async () => {
        if (!username) {
            return;
        }
        await api.sendValidationCode(username);
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
        <PublicFormLayout title={'Not validated account'}>
            <p>{`Your account ${username} has not been validated yet`}</p>
            <p>{`If you can't see the code, you can `}
                <a
                    className="text-blue-500"
                    onClick={() => onResendCode()}
                >
                    {' send another code'}
                </a>
            </p>
        </PublicFormLayout >
    );

}
