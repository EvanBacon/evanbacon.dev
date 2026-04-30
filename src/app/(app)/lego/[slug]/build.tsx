import { useLocalSearchParams, Redirect } from 'expo-router';

import BuildView from '@/components/lego/BuildView';

const MODEL_FILES: Record<string, string> = {
  batman: 'batman.ldr',
  'captain-america': 'captain-america.ldr',
  'master-chief': 'master-chief-ground.ldr',
};

export default function LegoBuild() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const modelFile = slug ? MODEL_FILES[slug] : undefined;
  if (!modelFile) return <Redirect href="/lego" />;
  return <BuildView key={modelFile} modelFile={modelFile} />;
}
