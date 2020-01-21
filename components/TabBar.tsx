import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBar } from 'react-navigation-tabs';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomTabBar: {
    backgroundColor: 'transparent',
  },
});

export default function TabBar(props) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  return (
    <BlurView
      tint={isDark ? 'dark' : 'light'}
      intensity={95}
      style={styles.blurView}
    >
      <BottomTabBar {...props} style={styles.bottomTabBar} />
    </BlurView>
  );
}
