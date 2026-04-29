import { useLocalSearchParams } from 'expo-router';

import BuildView from '@/components/lego/BuildView';

export default function LegoBuild() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <BuildView backHref={`/lego/${slug ?? ''}`} />;
}
