import { usePathname } from 'expo-router';

export function useIsFullScreenRoute() {
  const pathname = usePathname();

  return pathname.match(/blog\/expo-apps/);
}
