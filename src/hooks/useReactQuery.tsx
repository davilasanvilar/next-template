import { useContext } from 'react';
import { ReactQueryContext } from '../providers/ReactQueryProvider';

export const useReactQuery = () => {
    const ctx = useContext(ReactQueryContext);
    if (ctx === null) {
        throw new Error(
            'useReactQuery() can only be used on the descendants of ReactQyeryProvider'
        );
    } else {
        return ctx;
    }
};
