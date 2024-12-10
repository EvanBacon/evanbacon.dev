import '../../../../global.css';

import PageHeader from '@/components/PageHeader';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { B, Div, LI, Span, UL } from '@expo/html-elements';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

type DataType = {
  title: string;
  description: string;
  value: string;
  href: string;
};

const mdxctx = require.context('../../../../blog', true, /\.(mdx|js)$/);

const posts = mdxctx
  .keys()
  .filter(i => i.match(/\.js$/))
  .map(key => mdxctx(key));

const POSTS = posts
  .map(({ title, shortTitle, subtitle, date, slug, featuredImage }) => ({
    title: shortTitle ?? title,
    description: subtitle,
    value: new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    date,
    href: `/blog/${slug}`,
    slug,
    img: featuredImage,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

import { ExtensionStorage } from '@bacons/apple-targets';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

const extStorage = new ExtensionStorage('group.bacon.data');

function updateWidgetData(
  data: {
    imageUrl: string;
    title: string;
    date: string;
    href: string;
  }[]
) {
  extStorage.set('articlesData', data);
  ExtensionStorage.reloadWidget();
}

function sortRandomly<T>(arr: T[]) {
  return arr.sort(() => Math.random() - 0.5);
}

function useLatestPostsInWidget() {
  useEffect(() => {
    if (process.env.EXPO_OS === 'ios') {
      (async () => {
        try {
          const posts = await Promise.all(
            sortRandomly(POSTS.slice(0, 6)).map(
              async ({ title, img, date, href, slug }) => ({
                title,
                date: new Date(date).toISOString(),
                imageUrl: new URL(
                  '/blog/' + slug + '.jpg',
                  window.location.href
                ).toString(),
                // imageUrl: !img
                //   ? 'https://github.com/evanbacon.png'
                //   : (await Asset.fromModule(img).downloadAsync()).localUri,
                // imageUrl: 'https://github.com/evanbacon.png',
                href: Linking.createURL(href.replace(/^\//, '')),
              })
            )
          );

          updateWidgetData(posts);
        } catch (error) {
          console.error('error', error);
        }
      })();
    }
  }, []);
}

export default function App() {
  useLatestPostsInWidget();

  const paddingBottom = useBottomTabOverflow();

  if (process.env.EXPO_OS === 'web') {
    return (
      <div className="flex flex-1 flex-col gap-4 overflow-x-hidden">
        <PageHeader>Blog</PageHeader>

        <div className="mt-8 space-y-6">
          <ul className="divide-y divide-slate-800/50">
            {POSTS.map((item, index) => (
              <li key={index} className="py-4">
                <LineItem key={index} {...item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        flexDirection: 'column',
        gap: 16,
      }}
      contentContainerStyle={{
        paddingBottom,
        paddingHorizontal: 4,
      }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      <PageHeader>Blog</PageHeader>

      <Div className="mt-8 space-y-6">
        <UL className="divide-y divide-slate-800/50">
          {POSTS.map((item, index) => (
            <LI key={index} className="py-4">
              <LineItemNative key={index} {...item} />
            </LI>
          ))}
        </UL>
      </Div>
    </ScrollView>
  );
}

function LineItemNative({ title, description, value, href }: DataType) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity>
        <Div
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            justifyContent: 'center',
          }}
          className="text-slate-50 rounded-lg flex flex-row items-center hover:bg-slate-200/5 p-4 transition-colors ease-in-out"
        >
          <Span
            className="inline"
            style={{
              color: '#f8fafc',
            }}
          >
            <B>
              {title}
              {'  '}
            </B>

            {/* <Span className="opacity-60 hidden md:flex">{description}</Span> */}
          </Span>
          {/* divider pushing  */}
          <Span
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              // borderStyle: 'dotted',
              // minWidth: '2rem',
              marginHorizontal: 8,
            }}
            className="flex-1 border-b border-dotted border-slate-800 mx-2 md:mx-3 min-w-[2rem]"
          />
          <Span
            style={{
              color: '#f8fafc',
            }}
          >
            {value}
          </Span>
        </Div>
      </TouchableOpacity>
    </Link>
  );
}

function LineItem({ title, description, value, href }: DataType) {
  return (
    <Link href={href}>
      <div className="text-default text-slate-50 rounded-lg flex flex-row items-center hover:bg-slate-200/5 p-4 transition-colors ease-in-out">
        <span className="inline">
          <b>
            {title}
            {'  '}
          </b>

          <span className="opacity-60 hidden md:flex">{description}</span>
        </span>
        {/* divider pushing  */}
        <span className="flex-1 border-b border-dotted border-slate-800 mx-2 md:mx-3 min-w-[2rem]" />
        <span>{value}</span>
      </div>
    </Link>
  );
}
