import { Link } from 'expo-next-react-navigation';
import React from 'react';
import { Linking, Text, Platform } from 'react-native';
import { useHover, useDimensions, useREM, useActive, useFocus } from 'react-native-web-hooks';
import StyleSheet from 'react-native-extended-stylesheet';

export default function UniversalLink({ routeName, style, ...props }) {

  const ref = React.useRef(null)
  const { isFocused } = useFocus(ref);
  const { isHovered } = useHover(ref);

  const responsiveStyle = StyleSheet.flatten([
    style,
    { color: 'white', borderBottomWidth: 1, borderBottomColor: 'transparent', outlineStyle: 'none' },
    isHovered && { opacity: 0.6 },
    isFocused && { borderBottomColor: 'white' },
  ])

  // Handle External links
  if (routeName.startsWith('http://') || routeName.startsWith('https://')) {
    function onPress() {
      if (Platform.OS !== 'web')
        Linking.openURL(routeName);
    }
    return (<Text {...props} ref={ref} style={responsiveStyle} href={routeName} accessibilityRole="link" onPress={onPress} />)
  }

  return <Link ref={ref} routeName={routeName} {...props} style={responsiveStyle} />
}
