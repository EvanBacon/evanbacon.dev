// import { Inter_400Regular } from '@expo-google-fonts/inter';
// import registry from '@react-native/assets-registry/registry';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';
// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Text, View } from 'react-native';
import satori from 'satori';

// const origin = manifest?.extra?.router?.origin
// const MyFont = fs.readFileSync(assetToPath(Inter_400Regular));

const root =
  process.env.NODE_ENV === 'production'
    ? 'https://evanbacon.dev'
    : 'http://localhost:8081';

const blogs = require.context('../../../../../blog', true, /\.json$/);

export async function GET(req: ExpoRequest, { post }: { post: string }) {
  const MyFont = await fetch(root + '/fonts/Inter_400Regular.ttf').then(res =>
    res.arrayBuffer()
  );

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
        backgroundImage: `url(${root}/og/og-background.jpg)`,
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

  return new ExpoResponse(svgString, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}

// function assetToPath(source: number): string {
//   // get the URI from the packager
//   const asset = registry.getAssetByID(source);
//   if (asset == null) {
//     throw new Error(
//       `Asset with ID "${source}" could not be found. Please check the image source or packager.`
//     );
//   }
//   return path.join(
//     __dirname,
//     process.env.NODE_ENV === 'production' ? '../../../' : '',
//     decodeURIComponent(
//       asset.httpServerLocation.replace('/assets/?unstable_path=', '')
//     ),
//     `${asset.name}.${asset.type}`
//   );
// }
