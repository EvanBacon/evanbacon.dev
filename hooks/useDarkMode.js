import { useColorScheme } from 'react-native-appearance';

export default function useDarkMode() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    return isDark;
}