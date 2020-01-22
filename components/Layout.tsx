import PropTypes from 'prop-types';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { useLayout } from 'react-native-web-hooks';

import { useSafeArea } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native-appearance';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import Footer from './Footer';
import Header from './Header';

const MAX_WIDTH = 720;

export default function Layout({ children, navigation }) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  const scheme = useColorScheme();

  const backgroundColor = isDark ? '#1a1923' : 'rgb(250, 250, 250)';
  React.useEffect(() => {
    const backgroundColor =
      scheme === 'dark' ? '#1a1923' : 'rgb(250, 250, 250)';
    // @ts-ignore
    document.body.style.backgroundColor = backgroundColor;
  }, [scheme]);

  const { onLayout, width } = useLayout();

  const mainStyle =
    width > MAX_WIDTH + 40 ? styles.mainLarge : styles.mainSmall;

  const { bottom, left, right } = useSafeArea();

  const style: any = StyleSheet.flatten(
    Platform.select({
      web: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'scroll',
        transitionDuration: '0.5s',
        backgroundColor,
      },
      default: {
        flex: 1,
        backgroundColor,
      },
    })
  );

  // TODO: Account for tab bar changing height
  const paddingBottom = Platform.select({ web: 0, default: bottom + 24 });

  return (
    <ScrollView
      onLayout={onLayout as any}
      contentContainerStyle={{
        backgroundColor,
      }}
      contentInset={{ top: 0, bottom: paddingBottom }}
      style={style}
    >
      <Header siteTitle="Evan Bacon" navigation={navigation} />
      <View
        style={[
          mainStyle,
          {
            paddingLeft: left,
            paddingRight: right,
            opacity: width === 0 ? 0 : 1,
          },
        ]}
      >
        <View accessibilityRole="summary">{children}</View>
      </View>
      {Platform.OS === 'web' && <Footer />}
    </ScrollView>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

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
});
