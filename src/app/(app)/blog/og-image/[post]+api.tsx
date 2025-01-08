import React from 'react';
import { Text, View } from 'react-native';
import satori from 'satori';

const blogs = require.context('../../../../../blog', true, /\.json$/);

export async function GET(req: Request, { post }: { post: string }) {
  const MyFont = await fetch(
    new URL('/fonts/Inter_400Regular.ttf', req.url).toString()
  ).then(res => res.arrayBuffer());

  const matchedPost = blogs
    .keys()
    .find(value => value === `./${post}/index.json`);

  const postTitle = matchedPost ? blogs(matchedPost)?.title : post;

  const svgString = await satori(
    <View
      style={{
        height: '100%',
        display: 'flex',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundImage: `url(${new URL(
          '/og/og-background.jpg',
          req.url
        ).toString()})`,
      }}
    >
      <Text
        style={{
          display: 'flex',
          color: 'white',
          marginLeft: 164,
          marginRight: 164,
          fontSize: 130,
        }}
      >
        {postTitle}
      </Text>
    </View>,
    {
      width: 1920,
      height: 1080,
      fonts: [
        {
          name: 'inter',
          data: MyFont,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  return new Response(svgString, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}
