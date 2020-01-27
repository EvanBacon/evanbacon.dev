import { Video } from 'expo-av';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { useHover, useREM, useLayout } from 'react-native-web-hooks';
import isHoverEnabled from 'react-native-web-hooks/build/isHoverEnabled';

import { BlurView } from 'expo-blur';
import { H2, P } from '../components/Elements';
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

function ProjectCard({
  title,
  icon,
  color,
  preview,
  url,
  year,
  source,
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
  const ICON_SIZE = 72;

  const ref = React.useRef(null);

  const { isHovered } = useHover(ref);

  const footerProps: any = { accessibilityRole: 'footer' };
  const upperFlow = 16;
  const { onLayout, width }: any = useLayout();
  return (
    <View
      onLayout={onLayout}
      ref={ref}
      style={[
        {
          maxWidth: 720,
          flex: 1,
          borderRadius: 12,
          marginBottom: 20,
          overflow: 'hidden',
          shadowColor: 'black',
          shadowRadius: 8,
          shadowOpacity: 0.5,

          shadowOffset: { height: 4, width: 0 },
          backgroundColor: themeColor,
          ...Platform.select({
            web: {
              transitionDuration: '0.4s',
            },
            default: {},
          }),
        },
      ]}
    >
      <MediaBackground
        isHovered={isHovered}
        image={preview}
        video={video}
        resizeMode="cover"
      >
        <View
          {...footerProps}
          style={{
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
            left: 0,
            paddingHorizontal: 16,
            paddingBottom: 12,
            paddingTop: upperFlow + 8,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: themeColor,
              position: 'absolute',
              opacity: 0.4,
              top: upperFlow,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
          <BlurView
            intensity={100}
            style={{
              position: 'absolute',
              top: upperFlow,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
          <View
            style={{ flexDirection: 'row', flexShrink: 1, paddingRight: 8 }}
          >
            <Image
              source={icon}
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                marginRight: 16,
                borderRadius: 8,
                transform: [{ translateY: -upperFlow }],
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              {title && (
                <H2
                  style={{
                    color: 'white',

                    marginBottom: 8,
                    fontSize: useREM(1.51572),
                    lineHeight: useREM(1.51572),
                  }}
                >
                  {title}
                </H2>
              )}
              {description && (
                <P
                  style={{
                    color: 'white',
                    marginBottom: 8,
                  }}
                >
                  {description}
                </P>
              )}
              {year && (
                <P
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    opacity: 0.7,
                    marginBottom: 0,
                  }}
                >
                  {year}
                </P>
              )}
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
        </View>
      </MediaBackground>
    </View>
  );
}

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>Games</PageHeader>
      {Projects.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </Layout>
  );
}
