export interface BaseEntity {
    id: string;
    createdAt: Date;
    createdBy?: User;
}

export interface User extends BaseEntity {
    username: string;
    email: string;
    balance?: number;
    validated: boolean;
}

export interface LoginResult {
    authToken: string;
    authTokenExpiration: number;
    refreshToken: string;
    user: User;
}

export interface RegisterUserForm {
    username: string;
    email: string;
    password: string;
}

export interface Activity extends BaseEntity {
    name: string;
    description?: string;
}

export interface ActivityForm {
    name: string;
    description?: string;
}