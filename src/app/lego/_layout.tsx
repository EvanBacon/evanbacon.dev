import Head from 'expo-router/head';
import { Slot } from 'expo-router';
import { Platform } from 'react-native';

import '@/components/lego/lego.css';

export default function LegoLayout() {
  if (Platform.OS !== 'web') return null;
  return (
    <>
      <Head>
        <title>LEGO Scene · Evan Bacon</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Cinzel:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Slot />
    </>
  );
}
