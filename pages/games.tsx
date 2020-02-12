import { Video } from 'expo-av';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import {
  useHover,
  useREM,
  useLayout,
  useDimensions,
} from 'react-native-web-hooks';
import isHoverEnabled from 'react-native-web-hooks/build/isHoverEnabled';

import { BlurView } from 'expo-blur';
import { H2, P, Footer, Article } from '@expo/html-elements';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SocialIcon from '../components/SocialIcon';
import UniversalLink from '../components/UniversalLink';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Projects } from '../Data';

function MediaBackground({ resizeMode, isHovered, ...props }) {
  const baseStyle = {
    flex: 1,
    minHeight: 360,
    maxHeight: 360,
  };

  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (isHoverEnabled() && videoRef.current) {
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
          shouldPlay={!isHoverEnabled()}
          isLooping
          style={StyleSheet.absoluteFill}
        />
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

const upperFlow = 16;
const ICON_SIZE = 72;

function ProjectCard({
  title,
  icon,
  color,
  preview,
  url,
  year,
  source,
  isMobile,
  group,
  isDarkColored,
  description,
  video,
}) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  const socials = [
    {
      name: 'play',
      url,
    },
    {
      name: 'code',
      url: source,
    },
  ];

  const themeColor = color || (isDark ? 'black' : 'white');

  const ref = React.useRef(null);

  const { isHovered } = useHover(ref);

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
        image={preview}
        video={video}
        resizeMode="cover"
      >
        <Footer style={styles.footer}>
          <Underlay color={themeColor} />
          <BlurView intensity={100} style={styles.blur} />
          <View
            style={{ flexDirection: 'row', flexShrink: 1, paddingRight: 8 }}
          >
            <Image source={icon} style={styles.icon} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              {title && <H2 style={styles.title}>{title}</H2>}
              {description && <P style={styles.description}>{description}</P>}
              {year && <P style={styles.year}>{year}</P>}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            {socials.map((social, index) => (
              <View key={social.name}>
                <UniversalLink
                  style={{ marginLeft: index === 0 ? 0 : 24 }}
                  focusStyle={{ transform: [{ scale: 1.1 }] }}
                  target="_blank"
                  routeName={social.url}
                >
                  <SocialIcon
                    name={social.name}
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

export default function ({ navigation }) {
  const {
    window: { width },
  } = useDimensions();

  const isMobile = width < 720;

  return (
    <Layout navigation={navigation}>
      <PageHeader>Games</PageHeader>
      {Projects.map((project: any) => (
        <ProjectCard key={project.title} isMobile={isMobile} {...project} />
      ))}
    </Layout>
  );
}

const styles = StyleSheet.create({
  blur: {
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
    marginBottom: 8,
    marginTop: 0,
    fontSize: useREM(1.51572),
    lineHeight: useREM(1.51572),
  },
  description: {
    color: 'white',
    marginTop: 0,
    marginBottom: 8,
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
