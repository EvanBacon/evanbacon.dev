import { Link } from 'expo-router';

import PageHeader from '@/components/PageHeader';

type DataType = {
  title: string;
  description: string;
  value: string;
  href: string;
};

import '../../../../global.css';

const mdxctx = require.context('../../../../blog', true, /\.(mdx|js)$/);

const posts = mdxctx
  .keys()
  .filter(i => i.match(/\.js$/))
  .map(key => mdxctx(key));

const POSTS = posts
  .map(({ title, shortTitle, subtitle, date, slug }) => ({
    title: shortTitle ?? title,
    description: subtitle,
    value: new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    date,
    href: `/blog/${slug}`,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export default function App() {
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

import { Div, UL, LI, Span, B } from '@expo/html-elements';
import { ScrollView, StyleSheet } from 'react-native';

function LineItemNative({ title, description, value, href }: DataType) {
  return (
    <Link href={href}>
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
