import BlogPostRoute from '@/components/blog-post-route';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useFont } from '@/components/useFont';
import { useIsFullScreenRoute } from '@/components/useIsFullScreenRoute';
import { LD_EVAN_BACON } from '@/data/structured';
import { resolveAssetUri } from '@/utils/resolveMetroAsset';
import { router, Stack, useLoaderData, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import React from 'react';
import { Clipboard, Text } from 'react-native';

const mdxctx = require.context('../../../../blog', true, /\.(mdx|js)$/);

type PostInfo = {
  tags: string[];
  date: string;
  title: string;
  subtitle: string;
  slug: string;
  featuredImage: number;
};

export async function generateStaticParams(): Promise<{ post: string }[]> {
  return mdxctx
    .keys()
    .filter(i => i.match(/\.js$/))
    .map(key => mdxctx(key).slug)
    .map(post => ({ post }));
}

export async function loader(
  _request: unknown,
  params: { post: string }
): Promise<{ info: PostInfo; postId: string } | null> {
  const postId = params.post;
  const mdinfo = mdxctx.keys().find(p => p === './' + postId + '/index.js');
  if (!mdinfo) {
    return null;
  }

  const info = mdxctx(mdinfo) as PostInfo;
  return { info, postId };
}

function BlogHead({ info }: { info: PostInfo }) {
  const pathname = usePathname();
  // const url = React.useMemo(() => Linking.createURL(pathname), [pathname]);
  const img =
    resolveAssetUri(info.featuredImage) ?? '/blog/og-image/' + info.slug;
  const imgUrl = `https://evanbacon.dev${img}`;
  const url = `https://evanbacon.dev${pathname}`;
  return (
    <Head>
      <title>{info.title}</title>
      <meta name="description" content={info.subtitle} />
      {/* TODO: Dynamic */}
      <meta name="keywords" content={info.tags.join(',')} />

      <meta property="og:image:secure_url" content={imgUrl} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:alt" content={info.subtitle} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={info.title} />
      <meta property="og:description" content={info.subtitle} />
      <meta property="og:url" content={url} />
      <meta property="og:published_time" content={info.date} />

      <meta property="twitter:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={info.title} />
      <meta name="twitter:description" content={info.subtitle} />
      <meta name="twitter:image" content={imgUrl} />

      <script id="ld+article" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: info.title,
          preview: info.subtitle,
          slug: info.slug,
          url: url,
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

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const isFullScreen = useIsFullScreenRoute();
  const Inter_900Black = useFont('Inter_900Black');
  const paddingBottom = useBottomTabOverflow();

  if (!data) {
    return <Text>Not Found</Text>;
  }

  const { info, postId } = data;

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

      <BlogPostRoute
        paddingBottom={paddingBottom}
        dom={{
          menuItems: [
            { key: 'copy', label: 'Copy' },
            { key: 'x', label: '𝕏' },
          ],
          onCustomMenuSelection({ nativeEvent }) {
            if (nativeEvent.key === 'copy') {
              Clipboard.setString(nativeEvent.selectedText);
            } else if (nativeEvent.key === 'x') {
              // compose a tweet with the selected text
              const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                nativeEvent.selectedText
              )}`;
              router.navigate(
                // @ts-expect-error
                tweet
              );
            }
          },
          contentInsetAdjustmentBehavior: 'automatic',
          automaticallyAdjustsScrollIndicatorInsets: true,
          mediaPlaybackRequiresUserAction: false,
          allowsInlineMediaPlayback: true,
        }}
        isFullScreen={!!isFullScreen}
        postId={postId}
      />
    </>
  );
}
