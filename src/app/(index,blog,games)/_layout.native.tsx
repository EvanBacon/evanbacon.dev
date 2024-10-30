import { Stack } from 'expo-router';

import * as AppleColors from '@bacons/apple-colors';
import { useQuickActionRouting } from 'expo-quick-actions/router';

export default function Layout({ segment }: { segment: string }) {
  const route = segment.match(/\((.*)\)/)[1]!;
  useQuickActionRouting(callback => {
    console.log('Quick action', callback);
  });
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTintColor: 'white',

        headerTransparent: true,
        headerBlurEffect: 'prominent',
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerStyle: {
          // Hack to ensure the collapsed small header shows the shadow / border.
          backgroundColor: 'rgba(255,255,255,0.01)',
        },
        headerLargeStyle: {
          backgroundColor: AppleColors.systemGroupedBackground,
        },
        contentStyle: {
          backgroundColor: AppleColors.systemGroupedBackground,
        },
      }}
    >
      <Stack.Screen
        name={route === 'blog' ? 'blog/index' : route}
        options={{
          title: titles[route],
        }}
      />
      <Stack.Screen
        name={'blog/[post]'}
        options={{
          headerLargeTitle: false,
          headerTitle: 'Blog',
        }}
      />
      <Stack.Screen
        name={'faq'}
        options={{
          headerLargeTitle: false,
          headerTitle: 'FAQ',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

const titles = {
  blog: 'Blog',
  games: 'Games',
  index: 'Home',
};

export const unstable_settings = {
  anchor: 'index',
  '(blog)': {
    anchor: 'blog/index',
  },
  '(games)': {
    anchor: 'games',
  },
};
