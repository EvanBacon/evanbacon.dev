import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Slot, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import React from 'react';

import Colors from '@/constants/Colors';
import CustomAppearanceProvider from '@/context/CustomAppearanceProvider';
import { Meta } from '@/Data';

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

export default function App() {
  const themeColor = Colors.theme;
  const pathname = usePathname();

  const currentPath = ensureSlash(pathname || '', false) || 'talks';
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
    { property: 'og:image', content: `http://evanbacon.dev/${image.url}` },
    {
      property: 'og:image:secure_url',
      content: `https://evanbacon.dev/${image.url}`,
    },
    { property: 'og:image:type', content: image.type },
    { property: 'og:image:width', content: image.width },
    { property: 'og:image:height', content: image.height },
    { property: 'og:image:alt', content: image.description },
    // Twitter
    { name: `twitter:card`, content: `summary` },
    { name: `twitter:creator`, content: site.author },
    { name: `twitter:title`, content: title },
    { name: `twitter:description`, content: description },
    // Fix viewport by disabling scaling
    {
      key: 'viewport',
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
    <>
      <Head>
        <title>{siteTitle}</title>

        {injectMeta.map((value, index) => (
          <meta key={`meta-${index}`} {...value} />
        ))}
      </Head>
      <CustomAppearanceProvider>
        <ActionSheetProvider>
          <>
            <Slot />
          </>
        </ActionSheetProvider>
      </CustomAppearanceProvider>
    </>
  );
}
