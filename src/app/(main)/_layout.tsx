import { ResponsiveNavigator } from '@/components/top-nav/navigator';
import { Slot } from 'expo-router';

export default function Layout() {
  return <ResponsiveNavigator />;
  return (
    <div className="container mx-auto px-4 max-w-3xl md:px-0">
      <Slot />
    </div>
  );
}
