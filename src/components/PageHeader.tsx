import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useDimensions, useREM } from 'react-native-web-hooks';

import CustomAppearanceContext from '@/context/CustomAppearanceContext';

export default function({ children }) {
  const width = 1024;
  // const {
  //   window: { width },
  // } = useDimensions();
  const { isDark } = React.useContext(CustomAppearanceContext);

  const isSmall = width < 720;
  return (
    <h1
      style={[
        styles.container,
        {
          color: isDark ? 'white' : 'black',
          marginLeft: isSmall ? 16 : 0,
        },
      ]}
    >
      {children}
    </h1>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        transitionDuration: '0.5s',
        transitionProperty: 'color',
      },
      default: {},
    }),
    fontSize: useREM(3),
    marginTop: 0,
  },
});
