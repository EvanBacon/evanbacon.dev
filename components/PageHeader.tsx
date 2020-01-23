import React from 'react';
import { useDimensions } from 'react-native-web-hooks';

import { Platform } from 'react-native';
import { H2 } from './Elements';

export default function({ children }) {
  const {
    window: { width },
  } = useDimensions();

  const isSmall = width < 720;
  const transitionStyle = Platform.select({
    web: {
      transitionDuration: '0.5s',
      transitionProperty: 'color',
    },
    default: {},
  });
  return (
    <H2 style={{ ...transitionStyle, marginLeft: isSmall ? 40 : 0 }}>
      {children}
    </H2>
  );
}
