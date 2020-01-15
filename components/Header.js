import { useActionSheet } from '@expo/react-native-action-sheet';
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, Platform, Animated, Text, View, Switch } from 'react-native';
import { useDimensions, useREM } from 'react-native-web-hooks';
import StyleSheet from 'react-native-extended-stylesheet';

import AspectImage from '../components/AspectImage';
import MenuButton from './MenuButton';
import UniversalLink from './UniversalLink';
import { Appearance } from 'react-native-appearance';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { useSafeArea } from 'react-native-safe-area-context';
import { useRouting } from 'expo-next-react-navigation';

const TABS = [
  // {
  //   title: 'Blog',
  //   url: 'blog'
  // },
  {
    title: 'Home',
    url: ''
  },
  {
    title: 'Games',
    url: 'games'
  },
  {
    title: 'Lego',
    url: 'lego'
  },
  // {
  //   title: 'Watch',
  //   url: 'watch'
  // },
  {
    title: 'About',
    target: '_blank',
    url: 'https://en.wikipedia.org/wiki/Evan_Bacon'
  },
  {
    title: 'Source',
    target: '_blank',
    url: 'https://github.com/EvanBacon/Portfolio'
  },
]

const SIZE = 48;

const Header = ({ siteTitle }) => {
  const [isActive, setActive] = React.useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { navigate } = useRouting()
  function onPressMenu() {

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [...TABS.map(({ title }) => title), 'Cancel'];
    const destructiveButtonIndex = options.length - 1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        setActive(false)

        if (buttonIndex !== cancelButtonIndex) {
          const { url } = TABS[buttonIndex]
          // if (Platform.OS !== 'web' && url === '') {
          //   navigate({ routeName: '/' })
          // } else {
          if (url.startsWith('http://') || url.startsWith('https://')) {
            Linking.openURL(url)
          } else {
            navigate({ routeName: url || '/' })
          }
          // }
          // Linking.openURL(TABS[buttonIndex].url)

        }
        // Do something here depending on the button index selected
      },
    );

    setActive(!isActive)
  }
  const { window: { width } } = useDimensions();
  const isSmall = width < 720;
  const isXSmall = width < 360;
  const accessibilityRole = 'banner';
  const { top } = useSafeArea()
  return (
    <View
      accessibilityRole={accessibilityRole}
      style={[styles.container, { paddingTop: top }]}
    >
      <View
        style={[styles.innerContainer, isSmall && { paddingHorizontal: useREM(1.0875) }]}
      >
        <View style={styles.leftHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isXSmall && (<AspectImage source={{ uri: 'https://avatars.io/twitter/baconbrix' }} loading="lazy" style={styles.image} />)}
            <UniversalLink
              routeName={Platform.select({ web: "", default: "/" })}
              style={[styles.link, { fontWeight: 'bold', fontSize: useREM(2.25) }]}
            >{siteTitle}
            </UniversalLink>
          </View>
        </View>

        {isSmall && <MenuButton onPress={onPressMenu} isActive={isActive} />}

        <View style={[styles.rightHeader, { display: isSmall ? 'none' : 'flex', }]}>

          {TABS.map((info) => (
            <UniversalLink
              key={info.title}
              target={info.target}
              style={[styles.link, {
                fontWeight: 'bold',
                fontSize: useREM(1),
                marginTop: isSmall ? 12 : 0,
                marginLeft: isXSmall ? 0 : 12
              }]}
              routeName={info.url}
            >{info.title}</UniversalLink>
          ))}

          <AppearanceSwitch />
        </View>
      </View>
    </View>
  )
};

function AppearanceSwitch() {
  const { isDark, setIsDark } = React.useContext(CustomAppearanceContext);
  const value = React.useMemo(() => new Animated.Value(isDark ? 1 : 0), []);

  React.useEffect(() => {
    Animated.timing(value).stop();
    Animated.timing(value, {
      duration: 150,
      toValue: isDark ? 1 : 0
    }).start();
  }, [isDark]);

  const tstyle = {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 4,
  };
  return (
    <View style={{ marginLeft: 12, alignItems: 'center', flexDirection: 'row' }}>
      <Animated.Text style={[tstyle, { opacity: value.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{translateX: value.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }]  }]}>☀️</Animated.Text>
      <Switch
        tintColor="#4d4d4d"
        onTintColor="#4d4d4d"
        trackColor={{
          false: '#4d4d4d',
          true: '#4d4d4d'
        }}
        thumbTintColor="white"
        thumbColor="white"
        value={isDark}
        onValueChange={(value) => {
          setIsDark(value);
        }} />
      <Animated.Text style={[tstyle, { opacity: value.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }), transform: [{translateX: value.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>🌙</Animated.Text>

    </View>
  );
}


const styles = StyleSheet.create({
  image: {
    aspectRatio: 1, width: SIZE, height: SIZE, borderRadius: SIZE / 2, marginRight: 12
  },
  container: {
    backgroundColor: `#4630eb`,
    marginBottom: useREM(1.45),
    alignItems: 'center'
  },
  link: Platform.select({
    web: {
      color: 'white',
      cursor: 'pointer',
      // outlineStyle: 'none',
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
      transitionDuration: '200ms',
    },
    default: {
      color: 'white',
    },
  }),
  innerContainer: {
    maxWidth: 720,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: useREM(1.45),
    flex: 1,
    marginHorizontal: 'auto',
  },
  leftHeader: { flexDirection: 'row', zIndex: 1, backgroundColor: `#4630eb`, alignItems: 'center', justifyContent: 'space-between', },
  rightHeader: {
    backgroundColor: `#4630eb`,
    ...Platform.select({
      web: {
        transitionProperty: 'all',
        transitionDuration: '0.5s',
      }, default: {}
    }),

    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',

  }
})


Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}



export default Header