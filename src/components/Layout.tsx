import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from 'react-native-web-hooks';

import Colors from '@/constants/Colors';
import CustomAppearanceContext from '@/context/CustomAppearanceContext';
import Footer from './Footer';
import Header from './Header';

const MAX_WIDTH = 720;

const transitionStyle = Platform.select({
  web: {
    transitionDuration: '0.5s',
    transitionProperty: 'all',
  },
  default: {},
});

export default function Layout({
  children,
  maxWidth,
}: {
  children?: any;
  maxWidth?: number;
}) {
  const { isDark } = React.useContext(CustomAppearanceContext);
  const backgroundColor = isDark
    ? Colors.backgroundDark
    : Colors.backgroundLight;

  React.useEffect(() => {
    // eslint-disable-next-line
    // document.body.style.backgroundColor = backgroundColor;
  }, [isDark]);

  const { onLayout, width } = useLayout();
  const trueMaxWidth = maxWidth || MAX_WIDTH;
  const mainStyle =
    width > trueMaxWidth + 40
      ? [styles.mainLarge, { width: trueMaxWidth }]
      : styles.mainSmall;

  const { bottom, left, right } = useSafeAreaInsets();

  // TODO: Account for tab bar changing height
  const paddingBottom = Platform.select({ web: 0, default: bottom + 24 });

  return (
    <ScrollView
      testID="scroller"
      onLayout={onLayout as any}
      // contentContainerStyle={{
      //   // backgroundColor,
      //   ...transitionStyle,
      // }}
      style={{ flex: 1, backgroundColor: '#10141A' }}
      contentInset={{ top: 0, bottom: paddingBottom }}
      // style={styles.scrollView}
    >
      {/* <Sky isDark={isDark}> */}
      <Header siteTitle="Evan Bacon" />
      {/* <Header siteTitle="Evan Bacon 🥓" /> */}
      {/* <main
          style={[
            mainStyle,
            {
              paddingLeft: left,
              paddingRight: right,
              // opacity: width === 0 ? 0 : 1,
            },
          ]}
        > */}
      {children}
      {/* </main> */}
      {/* </Sky> */}
      {Platform.OS === 'web' && <Footer />}
    </ScrollView>
  );
}

function Sky({ children, isDark }) {
  return children;

  return (
    <LinearGradient
      colors={isDark ? ['#192740', '#35465d'] : ['#94C6C9', '#D5DEBB']}
      style={{ ...transitionStyle, flex: 1 }}
      children={children}
    />
  );
}

const styles = StyleSheet.create({
  mainLarge: {
    marginHorizontal: `auto`,
    width: MAX_WIDTH,
    paddingBottom: `1.0875rem`,
    paddingTop: 0,
  },
  mainSmall: {
    paddingHorizontal: `1.45rem`,
    paddingBottom: `1.0875rem`,
    paddingTop: 0,
  },
  scrollView: Platform.select({
    web: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'scroll',
    },
    default: {
      flex: 1,
    },
  }),
});
