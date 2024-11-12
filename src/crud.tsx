import { ApiResponse, PageMetadata } from '@/types/types';
import { checkResponseException } from '@/utils/utilFunctions';

interface CrudOperations<T> {
    create: (form: unknown, authToken: string) => Promise<T>;
    update: (id: string, form: unknown) => Promise<T>;
    get: (id: string) => Promise<T>;
    search: (
        page: number,
        pageSize: number | null,
        filters: SearchFilters,
        authToken: string
    ) => Promise<T[]>;
    searchMetadata: (
        page: number,
        pageSize: number | null,
        filters: SearchFilters,
        authToken: string
    ) => Promise<PageMetadata>;
    
    remove: (id: string) => void;
}

type SearchFilters = { [key: string]: string | boolean | string[] };

export function crud<T>(entity: string): CrudOperations<T> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const create = async (form: unknown, authToken: string): Promise<T> => {
        const url = `${apiUrl}${entity}`;
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify(form),
            credentials: 'include',
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': `Bearer ${authToken}`
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<T> = await res.json();
        checkResponseException(res, resObject);
        return resObject.data;
    };
    const update = async (id: string, form: unknown): Promise<T> => {
        const url = `${apiUrl}${entity}/${id}`;
        const options: RequestInit = {
            method: 'PATCH',
            body: JSON.stringify(form),
            credentials: 'include',
            headers: new Headers({
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<T> = await res.json();
        checkResponseException(res, resObject);
        return resObject.data;
    };

    const get = async (id: string): Promise<T> => {
        const url = `${apiUrl}${entity}/${id}`;
        const options: RequestInit = {
            method: 'GET',
            credentials: 'include',
            headers: new Headers({
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<T> = await res.json();
        checkResponseException(res, resObject);
        return resObject.data;
    };

    const search = async (
        page: number,
        pageSize: number | null,
        filters: SearchFilters,
        authToken: string
    ) => {
        const body = { page:page, pageSize };
        Object.assign(body, filters);
        const url = `${apiUrl}${entity}/search`;
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            headers: new Headers({
                'authorization': `Bearer ${authToken}`,
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<T[]> = await res.json();
        checkResponseException(res, resObject);
        return resObject.data;
    };

    const searchMetadata = async (
        page: number,
        pageSize: number | null,
        filters: SearchFilters,
        authToken: string
    ) => {
        const body = { page:page, pageSize };
        Object.assign(body, filters);
        const url = `${apiUrl}${entity}/search/metadata`;
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            headers: new Headers({
                'authorization': `Bearer ${authToken}`,
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const resObject: ApiResponse<PageMetadata> = await res.json();
        checkResponseException(res, resObject);
        return resObject.data;
    };

    const remove = async (id: string): Promise<void> => {
        const url = `${apiUrl}${entity}/${id}`;
        const options: RequestInit = {
            method: 'DELETE',
            credentials: 'include',
            headers: new Headers({
                'content-type': 'application/json'
            })
        };
        const res = await fetch(url, options);
        const resObject = await res.json();
        checkResponseException(res, resObject);
    };

    const value: CrudOperations<T> = {
        create,
        update,
        get,
        search,
        searchMetadata,
        remove
    };

    return value;
}