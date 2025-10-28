// import { useEffect } from 'react';
// import useLocalStorage from './useLocalStorage';

// const useColorMode = () => {
//   const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

//   useEffect(() => {
//     const className = 'dark';
//     const root = window.document.documentElement.classList;

//     if (colorMode === 'dark') root.add(className);
//     else root.remove(className);
//   }, [colorMode]);

//   return [colorMode, setColorMode];
// };

// export default useColorMode;

