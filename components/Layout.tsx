import PropTypes from 'prop-types';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { useLayout } from 'react-native-web-hooks';

import CustomAppearanceContext from '../context/CustomAppearanceContext';
import Footer from './Footer';
import Header from './Header';

const MAX_WIDTH = 720;

export default function Layout({ children }) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  const { onLayout, width } = useLayout();

  const mainStyle =
    width > MAX_WIDTH + 40 ? styles.mainLarge : styles.mainSmall;

  const backgroundColor = isDark ? '#1a1923' : 'rgb(250, 250, 250)';
  const style: any = StyleSheet.flatten(
    Platform.select({
      web: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'scroll',
        transitionDuration: '0.5s',
        backgroundColor,
      },
      default: { flex: 1, backgroundColor: 'green' },
    })
  );

  return (
    <ScrollView
      onLayout={onLayout as any}
      contentContainerStyle={{ backgroundColor }}
      style={style}
    >
      <Header siteTitle="Evan Bacon" />
      <View style={[mainStyle, { opacity: width === 0 ? 0 : 1 }]}>
        <View accessibilityRole="summary">{children}</View>
      </View>
      <Footer />
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
