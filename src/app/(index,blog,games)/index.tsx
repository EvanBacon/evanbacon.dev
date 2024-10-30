import HomeRoute from '@/components/index-route';

export default function IndexRoute() {
  return (
    <HomeRoute
      dom={{
        contentInsetAdjustmentBehavior: 'automatic',
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
