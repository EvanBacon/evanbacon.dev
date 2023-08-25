import Head from 'expo-router/head';
import { Stack, usePathname, useSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useFont } from '@/components/useFont';
import { LD_EVAN_BACON } from '@/data/structured';

export async function generateStaticParams(): Promise<{ post: string }[]> {
  return mdxctx
    .keys()
    .filter(i => i.match(/\.js$/))
    .map(key => mdxctx(key).slug)
    .map(post => ({ post }));
}

const mdxctx = require.context('../../../../blog', true, /\.(mdx|js)$/);

type PostInfo = {
  tags: string[];
  date: string;
  title: string;
  subtitle: string;
  slug: string;
  featuredImage: number;
};

function useData(
  postId: string
): null | {
  MarkdownComponent: any;
  info: PostInfo;
} {
  const MDKey = React.useMemo(
    () => mdxctx.keys().find(p => p === './' + postId + '/index.mdx'),
    [postId]
  );

  const mdinfo = React.useMemo(
    () => mdxctx.keys().find(p => p === './' + postId + '/index.js'),
    [postId]
  );

  const MD = MDKey ? mdxctx(MDKey).default : null;
  const Info = mdinfo ? mdxctx(mdinfo) : null;

  if (!MD || !Info) {
    return null;
  }
  return { MarkdownComponent: MD, info: Info };
}

import { resolveAssetUri } from '@/utils/resolveMetroAsset';
import { MarkdownTheme } from '@/components/MarkdownTheme';

function BlogHead({ info }: { info: PostInfo }) {
  const pathname = usePathname();
  const url = React.useMemo(() => Linking.createURL(pathname), [pathname]);
  const img = resolveAssetUri(info.featuredImage) ?? '/images/appjs-2022.jpg';
  return (
    <Head>
      <title>{info.title}</title>
      <meta name="description" content={info.subtitle} />
      {/* TODO: Dynamic */}
      <meta name="keywords" content={info.tags.join(',')} />

      <meta property="og:image" content={img} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={info.title} />
      <meta property="og:description" content={info.subtitle} />
      <meta property="og:url" content={url} />
      <meta property="og:published_time" content={info.date} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={info.title} />
      <meta name="twitter:description" content={info.subtitle} />

      <script id="ld+article" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: info.title,
          preview: info.subtitle,
          slug: info.slug,
          url: url,
          status: 'Published',
          image: [img],
          datePublished: info.date,
          dateModified: info.date,
          author: [LD_EVAN_BACON],
        })}
      </script>
    </Head>
  );
}

export default function Page() {
  const { post: postId } = useSearchParams();
  const data = useData(postId);

  const Inter_900Black = useFont('Inter_900Black');

  if (!data) {
    return <span>Not Found: {postId}</span>;
  }

  const { MarkdownComponent, info } = data;

  return (
    <>
      <BlogHead info={info} />

      <Stack.Screen
        options={{
          title: info.title,
          headerTitleStyle: {
            fontFamily: Inter_900Black,
          },
          headerLargeTitleStyle: {
            fontFamily: Inter_900Black,
          },
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingVertical: 24,
          maxWidth: 680,
          marginHorizontal: 'auto',
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <MarkdownTheme>
            <MarkdownComponent />
            <Thanks />
          </MarkdownTheme>
        </View>
      </ScrollView>
    </>
  );
}

import Thanks from '@/components/thanks';

function AutoHeightImage(props) {
  const [imgSize, setImageSize] = React.useState({});
  const [imageHeight, setImageHeight] = React.useState(100);

  React.useEffect(() => {
    Image.getSize(props.source.uri, (w, h) => {
      setImageSize({ width: w, height: h });
    });
  }, [props.source]);

  const [layoutWidth, setLayoutWidth] = React.useState(0);

  React.useEffect(() => {
    if (layoutWidth === 0) return;

    const ratio = imgSize.width / imgSize.height;
    const newHeight = layoutWidth / ratio;
    if (isNaN(newHeight)) return;
    setImageHeight(newHeight);
  }, [imgSize, layoutWidth]);

  return (
    <Image
      style={[props.style, { height: imageHeight }]}
      onLayout={e => {
        if (layoutWidth === e.nativeEvent.layout.width) return;
        setLayoutWidth(e.nativeEvent.layout.width);
      }}
      source={props.source}
    />
  );
}
