'use client';
import { createContext, ReactNode, useEffect, useLayoutEffect, useState } from 'react';

export interface ScreenContext {
    screenWidth: number;
    screenHeight: number;
    isDesktop: boolean;
    isLaptop: boolean;
    isTablet: boolean;
    isMobileL: boolean;
    isMobileM: boolean;
}

const ScreenWidthEnum = {
    MOBILE_S: 320,
    MOBILE_M: 375,
    MOBILE_L: 425,
    TABLET: 768,
    LAPTOP: 1024,
    DESKTOP: 1440
};

export const ScreenContext = createContext<ScreenContext>({} as ScreenContext);

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [screenHeight, setScreenHeight] = useState<number>(0);



    const isMobileM = screenWidth >= ScreenWidthEnum.MOBILE_M;
    const isMobileL = screenWidth >= ScreenWidthEnum.MOBILE_L;
    const isTablet = screenWidth >= ScreenWidthEnum.TABLET;
    const isLaptop = screenWidth >= ScreenWidthEnum.LAPTOP;
    const isDesktop = screenWidth >= ScreenWidthEnum.DESKTOP;

    const onResize = () => {
        setScreenWidth(window.screen.width);
        setScreenHeight(window.screen.height);
    };

    useLayoutEffect(() => {
        onResize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const value: ScreenContext = {
        screenWidth,
        screenHeight,
        isDesktop,
        isLaptop,
        isTablet,
        isMobileL,
        isMobileM
    };

    return (
        <ScreenContext.Provider value={value}>
            {children}
        </ScreenContext.Provider>
    );
};
