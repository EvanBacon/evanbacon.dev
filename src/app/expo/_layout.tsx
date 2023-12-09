import Layout from '@/components/Layout';
import { Slot } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'showcase',
};

export default function ExpoLayout() {
  return (
    <Layout>
      <Slot />
    </Layout>
  );
}
