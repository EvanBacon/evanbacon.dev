import { useActionSheet } from '@expo/react-native-action-sheet';
import { Link } from 'expo-next-react-navigation';
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, StyleSheet, Platform, Text, View } from 'react-native';
import * as SVG from 'react-native-svg';
import { useHover, useDimensions, useREM, useActive } from 'react-native-web-hooks';

import AspectImage from '../components/AspectImage';

import UniversalLink from './UniversalLink';


const TABS = [
  // {
  //   title: 'Blog',
  //   url: 'blog'
  // },
  {
    title: 'Home',
    url: ''
  },
  // {
  //   title: 'Projects',
  //   url: 'projects'
  // },
  // {
  //   title: 'Watch',
  //   url: 'watch'
  // },
  {
    title: 'Brand',
    url: 'brand'
  },
  {
    title: 'Source',
    url: 'https://github.com/EvanBacon/Portfolio'
  },
]

const SIZE = 48;

function MenuButton({ onPress, isActive }) {

  const transitionStyle = {
    transitionProperty: 'all',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'cubic-bezier(.645, .045, .355, 1)',
  }
  const stylePath = {
    fill: 'none',
    stroke: '#ffffff',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: 24,
    strokeDashoffset: -38,
    ...transitionStyle,
  }
  const styleA = [stylePath, {
    strokeDasharray: [24, 126.64183044433594],
  }, isActive && { strokeDasharray: [22.627416998, 126.64183044433594], strokeDashoffset: -94.1149185097 }]

  const styleB = [stylePath, {
    strokeDasharray: [24, 70],
  }, isActive && { strokeDasharray: [0, 70], strokeDashoffset: -50 }]

  return (
    <Text style={[{ backgroundColor: 'transparent', width: 50, height: 50, transform: [{ scale: 1.2 }] }, transitionStyle]} onPress={() => {
      onPress()
    }}>
      <SVG.Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <SVG.Circle style={{ fill: 'transparent' }} cx={50} cy={50} r={32} />
        <SVG.Path style={styleA} d="M0 40h62c13 0 6 28-4 18L35 35" />
        <SVG.Path style={styleB} d="M0 50h70" />
        <SVG.Path style={styleA} d="M0 60h62c13 0 6-28-4-18L35 65" />
      </SVG.Svg>
    </Text>

  )
}

const StyledLink = React.forwardRef(({ children, style, ...props }, ref) => {

  const { isHovered } = useHover(ref);
  const { isActive } = useActive(ref);

  const responsiveStyle = StyleSheet.flatten([style, isHovered && { opacity: 0.6 }, isActive && { color: 'black' } ])
  return <UniversalLink {...props} style={{ textDecoration: 'none'}}><Text ref={ref} style={responsiveStyle}>{children}</Text></UniversalLink>
}); 

const Header = ({ siteTitle }) => {
  const [isActive, setActive] = React.useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

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
          Linking.openURL(TABS[buttonIndex].url)
          
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

  return (
    <View
      accessibilityRole={accessibilityRole}
      style={styles.container}
    >
      <View
        style={[styles.innerContainer, isSmall && { paddingHorizontal: useREM(1.0875) }]}
      >
        <View style={styles.leftHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isXSmall && <AspectImage source={{ uri: 'https://avatars.io/twitter/baconbrix' }} loading="lazy" style={styles.image} />}
            <Text accessibilityRole="header" style={{ position: 'sticky', fontWeight: 'bold', fontSize: useREM(2.25) }}>
              <UniversalLink
                routeName=""
                style={{ textDecoration: 'none' }}
              ><Text style={styles.link}>
                  {siteTitle}
                </Text>
              </UniversalLink>
            </Text>
          </View>
        </View>

        {isSmall && <MenuButton onPress={onPressMenu} isActive={isActive} />}

        <View style={[styles.rightHeader, { display: isSmall ? 'none' : 'flex', }]}>

          {TABS.map((info) => (
            <Text key={info.title} style={{ fontWeight: 'bold', fontSize: useREM(1), marginTop: isSmall ? 12 : 0, marginLeft: isXSmall ? 0 : 12 }}>
              <StyledLink
                routeName={info.url}
                style={styles.link}
              >{info.title}</StyledLink>
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
};

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
    transitionProperty: 'all',
    transitionDuration: '0.5s',
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