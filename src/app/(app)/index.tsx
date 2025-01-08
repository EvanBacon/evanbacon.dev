import HomeRoute from '@/components/index-route';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useScrollRef } from '@/hooks/useTabToTop';

export default function IndexRoute() {
  const paddingBottom = useBottomTabOverflow();
  return (
    <HomeRoute
      paddingBottom={paddingBottom}
      ref={useScrollRef()}
      dom={{
        contentInsetAdjustmentBehavior: 'automatic',
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
