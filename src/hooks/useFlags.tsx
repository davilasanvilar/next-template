import { useContext } from 'react';
import { FlagsContext } from '../providers/FlagsProvider';

export const useFlags = () => {
    const ctx = useContext(FlagsContext);
    if (ctx === null) {
        throw new Error(
            'useFlags() can only be used on the descendants of FlagsProvider'
        );
    } else {
        return ctx;
    }
};
