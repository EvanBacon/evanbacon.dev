import { useActionSheet } from '@expo/react-native-action-sheet';
import { useRouting } from 'expo-next-react-navigation';
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, Platform, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions, useREM } from 'react-native-web-hooks';

import { useRouter } from 'next/router';
import AspectImage from '../components/AspectImage';
import AppearanceSwitch from './AppearanceSwitch';
import MenuButton from './MenuButton';
import UniversalLink from './UniversalLink';

const TABS = [
  // {
  //   title: 'Blog',
  //   url: 'blog'
  // },
  {
    title: 'Home',
    url: '',
  },
  {
    title: 'Games',
    url: 'games',
  },
  {
    title: 'Lego',
    url: 'lego',
  },
  // {
  //   title: 'Watch',
  //   url: 'watch'
  // },
  {
    title: 'About',
    target: '_blank',
    url: 'https://en.wikipedia.org/wiki/Evan_Bacon',
  },
  {
    title: 'Source',
    target: '_blank',
    url: 'https://github.com/EvanBacon/Portfolio',
  },
];

const SIZE = 48;

const Header = ({ siteTitle }) => {
  const [isActive, setActive] = React.useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { navigate } = useRouting();
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
        setActive(false);

        if (buttonIndex !== cancelButtonIndex) {
          const { url } = TABS[buttonIndex];
          // if (Platform.OS !== 'web' && url === '') {
          //   navigate({ routeName: '/' })
          // } else {
          if (url.startsWith('http://') || url.startsWith('https://')) {
            Linking.openURL(url);
          } else {
            navigate({ routeName: url || '/' });
          }
          // }
          // Linking.openURL(TABS[buttonIndex].url)
        }
        // Do something here depending on the button index selected
      }
    );

    setActive(!isActive);
  }
  const {
    window: { width },
  } = useDimensions();
  const isSmall = width < 720;
  const isXSmall = width < 360;
  const accessibilityRole: any = 'banner';
  const { top } = useSafeArea();

  return (
    <View
      accessibilityRole={accessibilityRole}
      style={[styles.container, { paddingTop: top }]}
    >
      <View
        style={[
          styles.innerContainer,
          isSmall && { paddingHorizontal: useREM(1.0875) },
        ]}
      >
        <View style={styles.leftHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isXSmall && (
              <AspectImage
                source={{ uri: 'https://avatars.io/twitter/baconbrix' }}
                loading="lazy"
                style={styles.image}
              />
            )}
            <UniversalLink
              routeName={Platform.select({ web: '', default: '/' })}
              style={[
                styles.link,
                { fontWeight: 'bold', fontSize: useREM(2.25) },
              ]}
            >
              {siteTitle}
            </UniversalLink>
          </View>
        </View>

        {isSmall && <MenuButton onPress={onPressMenu} isActive={isActive} />}

        <View
          style={[styles.rightHeader, { display: isSmall ? 'none' : 'flex' }]}
        >
          {TABS.map(info => (
            <HeaderLink
              title={info.title}
              key={info.title}
              target={info.target}
              style={{
                marginTop: isSmall ? 12 : 0,
                marginLeft: isXSmall ? 0 : 12,
              }}
              routeName={info.url}
            />
          ))}

          <AppearanceSwitch />
        </View>
      </View>
    </View>
  );
};

function HeaderLink({ title, target, style, routeName }) {
  const router = useRouter();

  const isActive = router.pathname === `/${routeName}`;

  return (
    <UniversalLink
      target={target}
      style={[
        styles.link,
        styles.headerLink,
        style,
        isActive && { borderBottomColor: 'white' },
      ]}
      routeName={routeName}
    >
      {title}
    </UniversalLink>
  );
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    marginRight: 12,
  },
  container: {
    backgroundColor: `#4630eb`,
    marginBottom: useREM(1.45),
    alignItems: 'center',
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
  headerLink: {
    fontWeight: 'bold',
    fontSize: useREM(1),
  },
  innerContainer: {
    maxWidth: 720,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: useREM(1.45),
    flex: 1,
    marginHorizontal: 'auto',
  },
  leftHeader: {
    flexDirection: 'row',
    zIndex: 1,
    backgroundColor: `#4630eb`,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightHeader: {
    backgroundColor: `#4630eb`,
    ...Platform.select({
      web: {
        transitionProperty: 'all',
        transitionDuration: '0.5s',
      },
      default: {},
    }),

    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
});

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
