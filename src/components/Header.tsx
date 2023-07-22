import AppearanceSwitch from '@/components/AppearanceSwitch';
import HeaderPhoto from '@/components/HeaderPhoto';
import MenuButton from '@/components/MenuButton';
import Colors from '@/constants/Colors';
import CustomAppearanceContext from '@/context/CustomAppearanceContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Link, useNavigation, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useREM } from 'react-native-web-hooks';

const TABS = [
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
  {
    title: 'Listen',
    url: 'media',
  },
  // {
  //   title: 'About',
  //   target: '_blank',
  //   url: 'https://en.wikipedia.org/wiki/Evan_Bacon',
  // },
  {
    title: 'Source',
    target: '_blank',
    url: 'https://github.com/EvanBacon/Portfolio',
  },
];

const CustomHeader = ({ siteTitle }) => {
  const navigation = useNavigation();
  const [isActive, setActive] = React.useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const { isDark } = React.useContext(CustomAppearanceContext);

  function onPressMenu() {
    if (Platform.OS !== 'web') {
      navigation.openDrawer();
      return;
    }
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [...TABS.map(({ title }) => title), 'Cancel'];
    const destructiveButtonIndex = options.length - 1;
    const cancelButtonIndex = options.length - 1;

    const backgroundColor = isDark
      ? Colors.backgroundDark
      : Colors.backgroundLight;
    const color = !isDark ? Colors.backgroundDark : Colors.backgroundLight;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        containerStyle: {
          backgroundColor,
        },
        textStyle: {
          color,
        },
      },
      buttonIndex => {
        setActive(false);

        if (buttonIndex !== cancelButtonIndex) {
          const { url } = TABS[buttonIndex];
          if (url.startsWith('http://') || url.startsWith('https://')) {
            Linking.openURL(url);
          } else {
            router.push(url || '/');
          }
        }
      }
    );

    setActive(!isActive);
  }
  const width = 1248;

  const isSmall = width < 720;
  const isXSmall = width < 520;

  return (
    <header className="bg-black items-stretch mb-2 px-6 py-4">
      <nav className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center justify-between z-10">
          <div className="flex flex-row items-center">
            <div className="hidden md:flex flex-1">
              <HeaderPhoto />
            </div>
            <Link
              href="/"
              style={[
                styles.link,
                { fontWeight: 'bold', fontSize: useREM(2.25) },
              ]}
            >
              {siteTitle}
            </Link>
          </div>
        </div>

        <div className="flex md:hidden flex flex-row items-center justify-evenly wrap">
          <AppearanceSwitch />
          <MenuButton onPress={onPressMenu} isActive={isActive} />
        </div>

        <div className="hidden md:flex flex-row items-center justify-evenly">
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

          <AppearanceSwitch style={{ marginLeft: 12 }} />
        </div>
      </nav>
    </header>
  );
};

function HeaderLink({ title, target, style, routeName }) {
  const pathname = usePathname();

  // TODO: CHECK
  const isActive = pathname ? pathname === `/${routeName}` : false;

  return (
    <Link
      target={target}
      style={[
        styles.link,
        styles.headerLink,
        style,
        isActive && { borderBottomColor: 'white' },
      ]}
      href={routeName}
    >
      {title}
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.theme,
    alignItems: 'stretch',
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
    justifyContent: 'space-between',
    paddingVertical: useREM(1.45),
    flex: 1,
  },
  innerContainerLarge: {
    width: '100%',
    marginHorizontal: 'auto',
  },
  leftHeader: {
    flexDirection: 'row',
    zIndex: 1,
    backgroundColor: Colors.theme,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightHeader: {
    backgroundColor: Colors.theme,
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

export default CustomHeader;
