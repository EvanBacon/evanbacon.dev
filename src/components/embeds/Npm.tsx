import { Pressable } from '@bacons/react-views';
import React from 'react';
import { Animated } from 'react-native';

import { ExternalLink } from '../ExternalLink';
import { useFont } from '../useFont';

export function NpmPackage({ url }: { url: string }) {
  const pkg = url.match(/npmjs\.com\/package\/(.*)/)?.[1].toLowerCase();

  return (
    <div
      style={{ backgroundColor: 'black', borderRadius: 12, overflow: 'hidden' }}
    >
      <div
        style={{
          backgroundColor: '#3a3f42',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
          paddingLeft: 16,
          paddingRight: 8,
          flexDirection: 'row',
        }}
      >
        <span
          data-text="true"
          style={{
            color: '#ECEDEE',
            fontFamily: useFont('Inter_400Regular'),
            fontSize: 16,
          }}
        >
          Terminal
        </span>

        <ExternalLink asChild href={url}>
          <Pressable>
            {({ hovered }) => (
              <div
                style={[
                  {
                    padding: 8,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: 'transparent',
                    transitionDuration: '200ms',
                  },
                  hovered && {
                    borderColor: '#ECEDEE',
                  },
                ]}
              >
                <span
                  style={{
                    fontFamily: useFont('Inter_400Regular'),
                    fontSize: 14,
                    color: '#ECEDEE',
                  }}
                >
                  View on NPM
                </span>
              </div>
            )}
          </Pressable>
        </ExternalLink>
      </div>
      <div style={{ padding: 16 }}>
        <span style={{ color: 'white', fontSize: 16, lineHeight: 24 }}>
          <code data-text="true">𝝠&nbsp;</code>
          <code>yarn add {pkg}</code>
          <PulsingCursor />
        </span>
      </div>
    </div>
  );
}

function PulsingCursor() {
  const value = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const ref = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    ref.start();

    return () => {
      ref.stop();
    };
  }, []);
  return (
    <Animated.Text
      style={{
        opacity: value,
        color: '#ECEDEE',
      }}
    >
      {' '}
      _
    </Animated.Text>
  );
}

// <ExternalCard url={url}>
// <div>
//   <h1>{pkg}</h1>
//   <p>npm package</p>
// </div>
// </ExternalCard>
