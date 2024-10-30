import { Stack } from 'expo-router';

export default function Layout({ segment }: { segment: string }) {
  const route = segment.match(/\((.*)\)/)[1]!;
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
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
    </Stack>
  );
}

const titles = {
  blog: 'Blog',
  games: 'Games',
  index: 'Home',
};
