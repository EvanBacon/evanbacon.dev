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

export default function UniversalLink({ routeName, style, ...props }: any) {
  // if (Platform.OS !== 'web' && typeof props.children !== 'string') {
  //   throw new Error(
  //     `Adding anything besides text to a <Text /> renders wrong on native. Please check children of link with routeName: ${routeName} `
  //   );
  // }

  const ref = React.useRef(null);
  const { isFocused } = useFocus(ref);
  const { isHovered } = useHover(ref);

  const responsiveStyle = StyleSheet.flatten([
    {
      color: 'white',
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
      ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
    },
    style,
    isHovered && { opacity: 0.6 },
    isFocused && { borderBottomColor: 'white' },
  ]);

  // Handle External links
  if (routeName.startsWith('http://') || routeName.startsWith('https://')) {
    const onPress = React.useCallback(() => {
      if (Platform.OS !== 'web') Linking.openURL(routeName);
    }, [routeName]);

    const isText = typeof props.children === 'string';
    const WrapperView = isText ? Text : TouchableOpacity;
    const safeStyle = StyleSheet.flatten(responsiveStyle);
    if (!isText) {
      delete safeStyle.color;
    }
    return (
      <WrapperView
        {...props}
        ref={ref}
        style={responsiveStyle}
        href={routeName}
        accessibilityRole="link"
        onPress={onPress}
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
