import Layout from '@/components/Layout';
import { Slot } from 'expo-router';

export default function ExpoLayout() {
  return (
    <Layout>
      <Slot />
    </Layout>
  );
}
