import { useLocalSearchParams, useRouter } from 'expo-router';

import BuildView from '@/components/lego/BuildView';

export default function LegoBuild() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  return (
    <BuildView
      onBack={() => router.push(`/lego/${slug ?? ''}` as never)}
    />
  );
}
