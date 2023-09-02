import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children?: any }) {
  const { bottom } = useSafeAreaInsets();

  // TODO: Account for tab bar changing height
  const paddingBottom = Platform.select({ web: 0, default: bottom + 24 });

  return (
    <ScrollView
      testID="scroller"
      style={styles.mainLarge}
      contentInset={{ top: 0, bottom: paddingBottom }}
    >
      <Header siteTitle="Evan Bacon" />

      {children}

      {Platform.OS === 'web' && <Footer />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainLarge: { flex: 1, backgroundColor: '#10141A' },
});
