import Layout from '@/components/Layout';
import { Slot } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'universal-links',
};

export default function ExpoLayout() {
  return (
    <Layout>
      <Slot />
    </Layout>
  );
}
