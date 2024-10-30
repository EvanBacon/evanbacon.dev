import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { Slot, Tabs, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import React from 'react';
import Background from '@/components/background';
import Colors from '@/constants/Colors';
import { Meta } from '@/Data';
import { loadAsync } from '@/components/useFont';
import { HapticTab } from '@/components/HapticTab';

import * as QuickActions from 'expo-quick-actions';
import { RouterAction } from 'expo-quick-actions/router';

// Read
// book.fill
// Hello
// hand.wave.fill
// Play
// gamecontroller.fill

QuickActions.setItems<RouterAction>([
  {
    id: '1',
    title: 'Read',
    icon: 'symbol:book.fill',
    params: {
      href: '/(blog)/blog',
    },
  },
  {
    id: '2',
    title: 'Play',
    icon: 'symbol:gamecontroller.fill',
    params: {
      href: '/(games)/games',
    },
  },
  {
    id: '3',
    title: "Wait! Don't Delete!",
    subtitle: 'Let us help you out',
    icon: 'symbol:person.bubble',
    params: {
      href: 'mailto:bacon@expo.io',
    },
  },
]);

const site = {
  title: 'Evan Bacon',
  author: '@baconbrix',
  description:
    'Learn more about Evan Bacon the Open Source Programmer and Master Lego Artist',
};

export function ensureSlash(inputPath: string, needsSlash: boolean): string {
  const hasSlash = inputPath.startsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(1, inputPath.length);
  } else if (!hasSlash && needsSlash) {
    return `/${inputPath}`;
  } else {
    return inputPath;
  }
}

function CustomHead() {
  const themeColor = Colors.theme;
  const pathname = usePathname();

  const currentPath = ensureSlash(pathname || '', false) || 'home';
  const { image = {}, title = site.title, description = site.description } =
    Meta[currentPath] || Meta.brand;

  const injectMeta = [
    {
      name: `description`,
      content: description,
    },
    // Open Graph
    {
      property: `og:description`,
      content: description,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: 'og:site_name',
      content: 'Evan Bacon',
    },
    {
      property: 'og:url',
      content: `https://www.evanbacon.dev/${currentPath}`,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    // Image
    { property: 'og:image', content: `https://evanbacon.dev${image.url}` },
    {
      property: 'og:image:secure_url',
      content: `https://evanbacon.dev/${image.url.replace(/^\/+/, '')}`,
    },
    // { property: 'og:image:type', content: image.type },
    { property: 'og:image:width', content: image.width },
    { property: 'og:image:height', content: image.height },
    { property: 'og:image:alt', content: image.description },
    // Twitter
    { name: `twitter:card`, content: `summary` },
    { name: `twitter:creator`, content: site.author },
    { name: `twitter:title`, content: title },
    { name: `twitter:description`, content: description },
    { name: `twitter:image`, content: `https://evanbacon.dev${image.url}` },

    // Fix viewport by disabling scaling
    {
      // key: 'viewport',
      name: 'viewport',
      content:
        'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover',
    },
    {
      name: 'msapplication-TileColor',
      content: themeColor,
    },
    {
      name: 'theme-color',
      content: themeColor,
    },
  ];

  const siteTitle = title === site.title ? title : `${title} | ${site.title}`;

  return (
    <Head>
      <title>{siteTitle}</title>

      {injectMeta.map((value, index) => (
        <meta key={`meta-${index}`} {...value} />
      ))}
    </Head>
  );
}

import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import BlurTabBarBackground from '@/components/ui/TabBarBackground.ios';

export default function App() {
  loadAsync({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
    Inter_900Black,
    SourceCodePro_400Regular,
  });

  if (process.env.EXPO_OS !== 'web') {
    return (
      <ThemeProvider value={DarkTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarActiveTintColor: 'white',
            tabBarBackground: BlurTabBarBackground,
            tabBarStyle:
              process.env.EXPO_OS === 'ios' ? { position: 'absolute' } : {},
          }}
        >
          <Tabs.Screen
            name="(blog)"
            options={{
              title: 'Read',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="book.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(index)"
            options={{
              title: 'Hello',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="hand.wave.fill" color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="(games)"
            options={{
              title: 'Play',
              tabBarIcon: ({ color }) => (
                <IconSymbol
                  size={28}
                  name="gamecontroller.fill"
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </ThemeProvider>
    );
  }

  return (
    <>
      <CustomHead />
      <Background />
      <Slot />
    </>
  );
}
