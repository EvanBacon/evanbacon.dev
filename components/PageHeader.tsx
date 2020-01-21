import React from 'react';
import { useDimensions } from 'react-native-web-hooks';

import { H2 } from './Elements';

export default function({ children }) {
  const {
    window: { width },
  } = useDimensions();

  const isSmall = width < 720;

  return <H2 style={{ marginLeft: isSmall ? 40 : 0 }}>{children}</H2>;
}
