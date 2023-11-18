import HeaderPhoto from '@/components/HeaderPhoto';
import Colors from '@/constants/Colors';
import { Link, usePathname } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useREM } from 'react-native-web-hooks';

const TABS = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Blog',
    url: '/blog',
  },
  {
    title: 'Games',
    url: '/games',
  },
  // {
  //   title: 'Lego',
  //   url: 'lego',
  // },
  // {
  //   title: 'Listen',
  //   url: 'media',
  // },
  // {
  //   title: 'About',
  //   target: '_blank',
  //   url: 'https://en.wikipedia.org/wiki/Evan_Bacon',
  // },
  // {
  //   title: 'Source',
  //   target: '_blank',
  //   url: 'https://github.com/EvanBacon/Portfolio',
  // },
];

const CustomHeader = ({ siteTitle }) => {
  const width = 1248;

  const isSmall = width < 720;
  const isXSmall = width < 520;

  return (
    <header className="bg-black mb-2 py-4">
      <nav className="flex flex-row justify-between items-center container mx-auto px-6 md:px-0 max-w-3xl">
        <div className="flex flex-row items-center justify-between z-10">
          <div className="flex flex-row items-center">
            <Link href="/">
              <HeaderPhoto />
            </Link>

            <div className="hidden md:flex flex-1">
              <Link
                href="/"
                className="text-2xl md:text-3xl font-bold text-white border-b border-b-transparent duration-200"
              >
                {siteTitle}
              </Link>
            </div>
          </div>
        </div>

        <div className=" flex-row items-center justify-evenly">
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
        </div>
      </nav>
    </header>
  );
};

function HeaderLink({ title, target, style, routeName }) {
  const pathname = usePathname();

  // TODO: CHECK
  const isActive = pathname ? pathname === `${routeName}` : false;

  return (
    <span className="hover:opacity-80 transition-opacity">
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
    </span>
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
