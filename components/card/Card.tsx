import { Article, Footer, H2, H3, P } from '@expo/html-elements';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useDimensions, useHover, useREM } from 'react-native-web-hooks';
import isHoverEnabled from 'react-native-web-hooks/build/isHoverEnabled';

import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import SocialIcon from '../SocialIcon';
import UniversalLink from '../UniversalLink';
import { Project } from '../../Data';

const upperFlow = 16;
const ICON_SIZE = 72;

function isMobileSafari() {
  var userAgent = window.navigator.userAgent;

  return !!(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i));
}

function MediaBackground({ resizeMode, isHovered, ...props }) {
  const baseStyle = {
    flex: 1,
    minHeight: 360,
    maxHeight: 360,
  };

  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!videoRef.current) return;

    if (isHoverEnabled()) {
      if (isHovered) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isHovered]);

  if (props.video) {
    return (
      <View style={baseStyle}>
        <Video
          ref={videoRef}
          source={props.video}
          posterSource={props.image}
          isMuted
          resizeMode={resizeMode}
          shouldPlay={!isHoverEnabled() || isMobileSafari()}
          isLooping
          style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
        />
        <View
          style={{
            zIndex: 5,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}
        >
          {props.children}
        </View>
      </View>
    );
  }

  return (
    <ImageBackground
      source={props.image}
      style={baseStyle}
      resizeMode={resizeMode}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}
      >
        {props.children}
      </View>
    </ImageBackground>
  );
}

export default function ProjectCard({
  title,
  icon,
  color,
  actions,
  image,
  year,
  description,
  video,
  renderDescription,
}: Project & { renderDescription?: () => any }) {
  const {
    window: { width },
  } = useDimensions();

  const isMobile = width < 720;
  const { isDark } = React.useContext(CustomAppearanceContext);

  const themeColor = color || (isDark ? 'black' : 'white');

  const ref = React.useRef(null);

  const isHovered = useHover(ref);

  return (
    <Article
      ref={ref}
      style={[
        styles.container,
        {
          marginHorizontal: isMobile ? 16 : 0,
        },
      ]}
    >
      <MediaBackground
        isHovered={isHovered}
        image={image}
        video={video}
        resizeMode="cover"
      >
        <Footer style={styles.footer}>
          <Underlay color={themeColor} />

          <BlurView intensity={100} style={styles.blur} />

          <View
            style={{ flexDirection: 'row', flexShrink: 1, paddingRight: 8 }}
          >
            {icon && (
              <Image source={icon} style={styles.icon} resizeMode="cover" />
            )}
            <View style={{ flex: 1 }}>
              {title && <H2 style={styles.title}>{title}</H2>}
              {description && !renderDescription && (
                <H3 style={styles.description}>{description}</H3>
              )}
              {renderDescription && renderDescription()}
              {year && <P style={styles.year}>{year}</P>}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            {actions.map((social, index) => (
              <View key={social.icon}>
                <UniversalLink
                  style={{ marginLeft: index === 0 ? 0 : 24 }}
                  focusStyle={{ transform: [{ scale: 1.1 }] }}
                  target="_blank"
                  routeName={social.url}
                >
                  <SocialIcon
                    name={social.icon}
                    color="white"
                    size={16 * 2.2}
                  />
                </UniversalLink>
              </View>
            ))}
          </View>
        </Footer>
      </MediaBackground>
    </Article>
  );
}

function Underlay({ color }) {
  return (
    <View
      style={{
        backgroundColor: color,
        position: 'absolute',
        opacity: 0.4,
        top: upperFlow,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    />
  );
}

const styles = StyleSheet.create({
  blur: {
    zIndex: -1,
    position: 'absolute',
    top: upperFlow,
    bottom: 0,
    left: 0,
    right: 0,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: 16,
    borderRadius: 8,
    transform: [{ translateY: -upperFlow }],
  },
  container: {
    maxWidth: 720,
    flex: 1,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowRadius: 8,
    shadowOpacity: 0.5,

    shadowOffset: { height: 4, width: 0 },
    ...Platform.select({
      web: {
        transitionDuration: '0.4s',
      },
      default: {},
    }),
  },
  title: {
    color: 'white',
    marginVertical: 0,
    fontSize: useREM(1.51572),
  },
  description: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 0,
  },
  year: {
    color: 'white',
    fontWeight: 'bold',
    opacity: 0.7,
    marginVertical: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: upperFlow + 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
