export interface SelectOption {
    label: string;
    value: string;
}

export interface PageMetadata {
    totalPages: number;
    totalRows: number;
}

export interface ApiResponse<T> {
    data: T;
    errorMessage: string;
    errorCode: ErrorCode;
}

export class ApiError extends Error {
    statusCode: number;
    message: string;
    code?: string;

    constructor({
        message,
        statusCode,
        code
    }: {
        message: string;
        statusCode: number;
        code?: string;
    }) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
    }
}

export enum ErrorCode {
    NOT_JWT_TOKEN = 'NOT_JWT_TOKEN',
    NOT_CSR_TOKEN = 'NOT_CSR_TOKEN',
    INVALID_TOKEN = 'INVALID_TOKEN',
    NOT_VALIDATED_ACCOUNT = 'NOT_VALIDATED_ACCOUNT',
    USERNAME_ALREADY_IN_USE = 'USERNAME_ALREADY_IN_USE',
    EMAIL_ALREADY_IN_USE = 'EMAIL_ALREADY_IN_USE',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    EXPIRED_VALIDATION_CODE = 'EXPIRED_VALIDATION_CODE',
    INCORRECT_VALIDATION_CODE = 'INCORRECT_VALIDATION_CODE',
    ALREADY_USED_VALIDATION_CODE = 'ALREADY_USED_VALIDATION_CODE',
    ALREADY_INVITED_USER = 'ALREADY_INVITED_USER',
    ALREADY_MEMBER_GROUP = 'ALREADY_MEMBER_GROUP',
    NOT_GROUP_MEMBER = 'NOT_GROUP_MEMBER',
    KICKED_CREATOR = 'KICKED_CREATOR',
    NOT_ABOVE_0_AMOUNT = 'NOT_ABOVE_0_AMOUNT',
    PAYEE_NOT_IN_GROUP = 'PAYEE_NOT_IN_GROUP',
    PAYER_NOT_IN_GROUP = 'PAYER_NOT_IN_GROUP',
    INACTIVE_GROUP = 'INACTIVE_GROUP',
    NON_ZERO_BALANCE = 'NON_ZERO_BALANCE',
    ALREADY_VALIDATED_ACCOUNT = 'ALREADY_VALIDATED_ACCOUNT',
    TOKEN_ALREADY_USED = 'TOKEN_ALREADY_USED'  
}
