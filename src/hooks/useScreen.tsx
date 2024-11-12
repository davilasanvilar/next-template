import { useContext } from 'react';
import { ScreenContext } from '../providers/ScreenProvider';

export const useScreen = () => {
    const ctx = useContext(ScreenContext);
    if (ctx === null) {
        throw new Error(
            'useScreen() can only be used on the descendants of ScreenProvider'
        );
    } else {
        return ctx;
    }
};
