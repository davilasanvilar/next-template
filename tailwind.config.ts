import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      primary: {
        50: '#C8D2DE',
        100: '#AFBCCD',
        200: '#98A8BD',
        300: '#8294AC',
        400: '#6E829C',
        500: '#5B708B',
        600: '#4A5F7A',
        700: '#3B4F6A',
        800: '#2D4059',
        900: '#293A50',
        1000: '#121A24',
        disabled: '#415849'
      },
      background: {
        50: '#F9FAFB',
        100: '#F4F6F8',
        200: '#E9ECF0',
        300: '#DDE2E7',
        400: '#C8D2DE',
        500: '#B3C3D5',
        600: '#9EAFCC',
        700: '#8A9EC3',
        800: '#758EBB',
        900: '#5B708B',
        1000: '#121A24'
      },
      success: {
        50: '#F0F9F4',
        100: '#E0F3E9',
        200: '#C1E7D3',
        300: '#A2DBBD',
        400: '#64CFA1',
        500: '#26C385',
        600: '#24B576',
        700: '#1F9B66',
        800: '#197F56',
        900: '#146346'
      },
      error: {
        50: '#FDF2F2',
        100: '#FCE5E5',
        200: '#F9CACA',
        300: '#F6AFAF',
        400: '#F17D7D',
        500: '#EC4B4B',
        600: '#D64444',
        700: '#B83B3B',
        800: '#993232',
        900: '#7A2929'
      },
      warning: {
        50: '#FFFAF0',
        100: '#FFF5E1',
        200: '#FFECC2',
        300: '#FFE3A3',
        400: '#FFCD65',
        500: '#FFB727',
        600: '#E6A025',
        700: '#BF851F',
        800: '#997A19',
        900: '#736E13'
      },
      transparent: 'transparent'
    },
    extend: {
      keyframes: {},
      animation: {}
    }
  },
  plugins: [],
};
export default config;
