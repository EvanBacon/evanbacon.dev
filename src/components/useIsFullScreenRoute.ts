import { usePathname } from 'expo-router';

export function useIsFullScreenRoute() {
  const pathname = usePathname();

  if (/\/lego\/[^/]+\/build\/?$/.test(pathname)) return false;
  return pathname.match(/(blog\/expo-apps|lego\/?)/);
}
