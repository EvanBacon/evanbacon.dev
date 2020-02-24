import { Link as EXLink } from 'expo-next-react-navigation';
import React from 'react';
import {
  Linking,
  Platform,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { useFocus, useHover } from 'react-native-web-hooks';

const Text = RNText as any;
const Link = EXLink as any;

export default function UniversalLink({
  routeName,
  style,
  hoverStyle = { opacity: 0.6 },
  focusStyle = { borderBottomColor: 'white' },
  ...props
}: any) {
  const ref = React.useRef(null);
  const isFocused = useFocus(ref);
  const isHovered = useHover(ref);

  const responsiveStyle = StyleSheet.flatten([
    {
      color: 'white',
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
      ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
    },
    style,
    isHovered && hoverStyle,
    isFocused && focusStyle,
  ]);

  // Handle External links
  if (routeName.startsWith('http://') || routeName.startsWith('https://')) {
    const isText = Platform.OS === 'web' || typeof props.children === 'string';
    const onPress = React.useCallback(() => {
      Linking.openURL(routeName);
    }, [routeName, isText]);

    const WrapperView = isText ? Text : TouchableOpacity;
    const safeStyle = StyleSheet.flatten(responsiveStyle);
    if (!isText) {
      delete safeStyle.color;
    }

    if (Platform.OS !== 'web') props.onPress = onPress;
    return (
      <WrapperView
        {...props}
        ref={ref}
        style={responsiveStyle}
        href={routeName}
        accessibilityRole="link"
      />
    );
  }

  let outputRouteName = routeName;

  if (Platform.OS !== 'web' && routeName === '') outputRouteName = '/';

  return (
    <Link
      ref={ref}
      routeName={outputRouteName}
      {...props}
      style={responsiveStyle}
    />
  );
}
