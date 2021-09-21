import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Head from 'next/head';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

import CustomAppearanceProvider from '../context/CustomAppearanceProvider';
import { Meta } from '../Data';

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

EStyleSheet.build({}); // always call EStyleSheet.build() even if you don't use global variables!

export default function App({ Component, router = {}, pageProps }: any) {
  const themeColor = Colors.theme;

  const currentPath = ensureSlash(router.route || '', false) || 'talks';
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

        {injectMeta.map((value, index) => {
          return <meta key={`meta-${index}`} {...value} />;
        })}
      </Head>
      <SafeAreaProvider>
        <AppearanceProvider>
          <CustomAppearanceProvider>
            <ActionSheetProvider>
              <>
                <Component {...pageProps} />
              </>
            </ActionSheetProvider>
          </CustomAppearanceProvider>
        </AppearanceProvider>
      </SafeAreaProvider>
    </>
  );
}
