import { Image, Pressable } from '@bacons/react-views';
import React from 'react';
import { View, Text } from 'react-native';

import { ExternalLink } from '../ExternalLink';

export function ProfileCard({
  url,
  title,
  subtitle,
  website,
  image,
}: {
  url: string;
  title: string;
  subtitle: string;
  website: string;
  image: string;
}) {
  return (
    <ExternalCard url={url}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 8,
          padding: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#f2f5f7',
          }}
        >
          {title} – Overview
        </Text>
        <Text
          style={{
            fontSize: 16,

            // light gray
            color: '#f2f5f7',
          }}
        >
          {subtitle ?? 'No bio available'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#6572A0',
          }}
        >
          Follow on {website}
        </Text>
      </View>

      <Image
        source={{ uri: image }}
        resizeMode="cover"
        style={{
          minHeight: 100,
          height: '100%',
          aspectRatio: 1,
        }}
      />
    </ExternalCard>
  );
}

export function ExternalCard({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <ExternalLink asChild href={url} style={{ flex: 1 }}>
      <Pressable>
        {({ hovered }) => (
          <View
            style={{
              marginTop: 8,
              borderColor: '#6572A0',
              borderWidth: 1,
              transitionDuration: '200ms',
              backgroundColor: hovered ? '#373848' : '#21222B',

              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {children}
          </View>
        )}
      </Pressable>
    </ExternalLink>
  );
}
