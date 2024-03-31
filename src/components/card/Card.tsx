import { Div, Footer, H3, P } from '@expo/html-elements';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';
import isHoverEnabled from 'react-native-web-hooks/build/isHoverEnabled';
import PhotoLibraryIcon from '@/svg/photo-library.svg';
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
      <Div style={baseStyle}>
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
        <Div
          style={{
            zIndex: 5,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}
        >
          {props.children}
        </Div>
      </Div>
    );
  }

  return (
    <Div style={baseStyle}>
      <Image
        source={props.image}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode={resizeMode}
      />

      <Div
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}
      >
        {props.children}
      </Div>
    </Div>
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
  const isDark = false;

  const themeColor = color || (isDark ? 'black' : 'white');

  const ref = React.useRef(null);

  const isHovered = useHover(ref);

  return (
    <article
      ref={ref}
      className="flex flex-1 overflow-hidden duration-500 rounded-xl mb-5 mx-2 md:mx-0"
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

          <div className="flex flex-row shrink pr-2">
            {icon && (
              <Image source={icon} style={styles.icon} resizeMode="cover" />
            )}
            <div className="flex flex-1 flex-col">
              {title && <h2 className="text-white text-base">{title}</h2>}
              {description && !renderDescription && (
                <H3 style={styles.description}>{description}</H3>
              )}
              {renderDescription && renderDescription()}
              {year && <P style={styles.year}>{year}</P>}
            </div>
          </div>

          <Div
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            {actions.map((social, index) => (
              <Div key={social.icon}>
                <Link
                  style={{ marginLeft: index === 0 ? 0 : 24 }}
                  hoverStyle={{ transform: `scale(1.1)` }}
                  target="_blank"
                  href={social.url}
                >
                  <PhotoLibraryIcon fill="white" height={36} width={36} />
                </Link>
              </Div>
            ))}
          </Div>
        </Footer>
      </MediaBackground>
    </article>
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
    transform: `translateY(${-upperFlow})`,
  },
  container: {
    flex: 1,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    // shadowColor: 'black',
    // shadowRadius: 8,
    // shadowOpacity: 0.5,

    // shadowOffset: { height: 4, width: 0 },
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
