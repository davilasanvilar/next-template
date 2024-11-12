import { ApiError, ApiResponse } from '../types/types';

export const checkResponseException = (
    res: Response,
    resObject: ApiResponse<unknown>
) => {
    if (!res.ok) {
        throw new ApiError({
            statusCode: res.status,
            message: resObject.errorMessage,
            code: resObject.errorCode
        });
    }
};
