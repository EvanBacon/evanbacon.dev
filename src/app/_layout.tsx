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
import Colors from '@/constants/Colors';
import { Meta } from '@/Data';
import { loadAsync } from '@/components/useFont';
import { HapticTab } from '@/components/HapticTab';
import { LD_EVAN_BACON } from '@/data/structured';

const blogCtx = require.context('../../blog', true, /\.(js)$/);

type BlogPostInfo = {
  tags: string[];
  date: string;
  title: string;
  subtitle: string;
  slug: string;
  featuredImage: number;
  // Stable, crawler-friendly JPEG/PNG path under /public (e.g. /og/blog-expo.jpg).
  // Social scrapers reject AVIF/SVG, so OG images must be a raster JPEG/PNG.
  ogImage?: string;
};

// Generic OG image for posts without a dedicated one. Already committed and live
// on evanbacon.dev, so it validates immediately.
const DEFAULT_BLOG_OG_IMAGE = '/og/talks.jpg';

function BlogPostHead({
  slug,
  themeColor,
}: {
  slug: string;
  themeColor: string;
}) {
  const key = blogCtx.keys().find(p => p === './' + slug + '/index.js');
  if (!key) {
    return null;
  }

  const info = blogCtx(key) as BlogPostInfo;
  const imgUrl = `https://evanbacon.dev${info.ogImage ?? DEFAULT_BLOG_OG_IMAGE}`;
  const url = `https://evanbacon.dev/blog/${slug}`;
  const siteTitle = `${info.title} | ${site.title}`;

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={info.subtitle} />
      <meta name="keywords" content={info.tags.join(',')} />

      <meta property="og:image:secure_url" content={imgUrl} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={info.subtitle} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={info.title} />
      <meta property="og:description" content={info.subtitle} />
      <meta property="og:site_name" content="Evan Bacon" />
      <meta property="og:url" content={url} />
      <meta property="og:published_time" content={info.date} />

      <meta property="twitter:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.author} />
      <meta name="twitter:title" content={info.title} />
      <meta name="twitter:description" content={info.subtitle} />
      <meta name="twitter:image" content={imgUrl} />

      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />

      <script id="ld+article" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: info.title,
          preview: info.subtitle,
          slug: info.slug,
          url,
          status: 'Published',
          image: [imgUrl],
          datePublished: info.date,
          dateModified: info.date,
          author: [LD_EVAN_BACON],
        })}
      </script>
    </Head>
  );
}

import * as QuickActions from 'expo-quick-actions';
import { RouterAction } from 'expo-quick-actions/router';

QuickActions.setItems<RouterAction>([
  {
    id: '1',
    title: 'Read Blog',
    icon: 'symbol:book',
    params: {
      href: '/(blog)/blog',
    },
  },
  // {
  //   id: '2',
  //   title: 'Play Games',
  //   icon: 'symbol:gamecontroller',
  //   params: {
  //     href: '/(games)/games',
  //   },
  // },
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

  // Blog post detail routes (/blog/<slug>) need per-post article meta. The
  // page-level <Head> in [post].tsx isn't captured during static export (loader
  // + DOM-component route), so emit the post's meta from here instead — this is
  // the only <Head> that reliably serializes into the static HTML.
  const blogPostMatch = currentPath.match(/^blog\/(.+)$/);
  if (blogPostMatch) {
    return <BlogPostHead slug={blogPostMatch[1]} themeColor={themeColor} />;
  }

  const metaKey = currentPath in Meta
    ? currentPath
    : currentPath.split('/')[0] in Meta
    ? currentPath.split('/')[0]
    : null;
  const { image = {}, title = site.title, description = site.description } =
    (metaKey && Meta[metaKey]) || Meta.brand;

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

import * as AppleColors from '@bacons/apple-colors';


export function SuspenseFallback() {
  return (
    <div className='flex flex-1'/>
  );
}


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
            // lazy: false,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarActiveTintColor: 'white',
            tabBarBackground: BlurTabBarBackground,
            tabBarInactiveTintColor: AppleColors.placeholderText,
            tabBarStyle:
              process.env.EXPO_OS === 'ios' ? { position: 'absolute' } : {},
          }}
        >
          <Tabs.Screen
            name="(index)"
            options={{
              title: 'Hello',
              tabBarIcon: ({ color, focused }) => (
                <IconSymbol
                  size={28}
                  name={focused ? 'hand.wave.fill' : 'hand.wave'}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="(blog)"
            options={{
              title: 'Read',
              tabBarIcon: ({ color, focused }) => (
                <IconSymbol
                  size={28}
                  name={focused ? 'book.fill' : 'book'}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="(games)"
            options={{
              title: 'Play',
              // Apple does not allow opening clones of other apps inside of your app. Hide this for now.
              href: null,
              tabBarIcon: ({ color, focused }) => (
                <IconSymbol
                  size={28}
                  name={focused ? 'gamecontroller.fill' : 'gamecontroller'}
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
      <Slot />
    </>
  );
}
