import { MarkdownTheme } from '@/components/MarkdownTheme';
import CenterInFull from '@/components/center-in-full';
import Thanks from '@/components/thanks.mdx';
import classNames from 'classnames';
import React from 'react';
import { ScrollView, Text } from 'react-native';

const mdxctx = require.context('../../blog', true, /\.(mdx|js)$/);

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

export default function Page({
  postId,
  isFullScreen,
}: {
  postId: string;
  isFullScreen: boolean;
}) {
  const data = useData(postId);

  if (!data) {
    return <Text>Not Found: {postId}</Text>;
  }

  const { MarkdownComponent } = data;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingVertical: 24,
      }}
    >
      <div
        className={classNames('flex flex-1 flex-col', !isFullScreen && 'px-3')}
      >
        <MarkdownTheme>
          <MarkdownComponent />

          {isFullScreen ? (
            <CenterInFull>
              <Thanks />
            </CenterInFull>
          ) : (
            <Thanks />
          )}
        </MarkdownTheme>
      </div>
    </ScrollView>
  );
}
