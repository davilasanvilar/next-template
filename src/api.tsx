import { RegisterUserForm, User } from '@/types/entities';
import { ApiResponse } from '@/types/types';
import { checkResponseException } from '@/utils/utilFunctions';

export interface Api {
    register: (user: RegisterUserForm) => void;
    sendValidationCode: (username: string) => Promise<void>;
    validateAccount: (username: string, code: string) => Promise<void>;
    forgottenPassword: (username: string) => Promise<void>;
    resetPassword: (
        username: string,
        code: string,
        password: string
    ) => Promise<void>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export const api: Api = {
    register: async (form: RegisterUserForm) => {
        const url = `${apiUrl}public/register`;
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify(form),
            headers: new Headers({
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<User> = await res.json();
        checkResponseException(res, resObject);
    },
    sendValidationCode: async (username: string): Promise<void> => {
        const url = `${apiUrl}public/validate/${username}/resend`;
        const options: RequestInit = {
            method: 'POST'
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<void> = await res.json();
        checkResponseException(res, resObject);
    },

    validateAccount: async (
        username: string,
        code: string
    ): Promise<void> => {
        const url = `${apiUrl}public/validate/${username}/${code}`;
        const options: RequestInit = {
            method: 'POST'
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<unknown> = await res.json();
        checkResponseException(res, resObject);
    },

    forgottenPassword: async (username: string): Promise<void> => {
        const url = `${apiUrl}public/forgotten-password/${username}`;
        const options: RequestInit = {
            method: 'POST'
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<unknown> = await res.json();
        checkResponseException(res, resObject);
    },

    resetPassword: async (
        username: string,
        code: string,
        password: string
    ): Promise<void> => {
        const url = `${apiUrl}public/reset-password/${username}/${code}`;
        const options: RequestInit = {
            method: 'POST',
            body: password,
            headers: new Headers({
                'content-type': 'text/plain'
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<unknown> = await res.json();
        checkResponseException(res, resObject);
    }
};
