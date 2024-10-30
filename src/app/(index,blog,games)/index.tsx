import HomeRoute from '@/components/index-route';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function IndexRoute() {
  const paddingBottom = useBottomTabOverflow();
  return (
    <HomeRoute
      paddingBottom={paddingBottom}
      dom={{
        contentInsetAdjustmentBehavior: 'automatic',
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
