import PageHeader from '@/components/PageHeader';
import { Project } from '@/Data';
import cn from 'classnames';
import { ResizeMode, Video } from 'expo-av';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import '../../global.css';
import { IS_DOM } from 'expo/dom';
import { StyleNoSelect } from './no-select';
import classNames from 'classnames';
import { H3, P, Span } from '@expo/html-elements';

export default function GamesRoute() {
  const paddingBottom = useBottomTabOverflow();
  const ref = useRef(null);
  useScrollToTop(ref, -150);

  if (process.env.EXPO_OS === 'web') {
    return (
      <div
        className={classNames(
          'flex flex-1 flex-col gap-4 overflow-x-hidden',
          IS_DOM && 'px-4'
        )}
        style={{
          paddingBottom,
        }}
      >
        <StyleNoSelect />
        <PageHeader>Games</PageHeader>

        <br />

        <div className="gap-2 grid grid-cols-1 md:grid-cols-2 grid-rows-4">
          {Projects.map((project, index) => {
            return (
              <GridItem
                href={project.actions[0].url}
                video={project.video}
                key={project.title}
                title={project.title}
                subtitle={project.description}
                year={project.year}
                ratio={project.ratio ?? 'row-span-1 col-span-1'}
                buttonTitle={project.button}
              />
            );
          })}
        </div>
        <br />
      </div>
    );
  }

  return (
    <ScrollView
      ref={ref}
      scrollToOverflowEnabled
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
      style={{
        flex: 1,
      }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      contentContainerStyle={{
        paddingBottom: paddingBottom + 16,
        gap: 16,
        padding: 16,
      }}
    >
      <PageHeader>Games</PageHeader>

      {Projects.map((project, index) => {
        return (
          <GridItemNative
            href={project.actions[0].url}
            video={project.video}
            key={project.title}
            title={project.title}
            subtitle={project.description}
            year={project.year}
            ratio={project.ratio ?? 'row-span-1 col-span-1'}
            buttonTitle={project.button}
          />
        );
      })}
    </ScrollView>
  );
}

import * as WebBrowser from 'expo-web-browser';
import { TouchableImpact } from './ui/TouchableImpact';
import { useScrollRef, useScrollToTop } from '@/hooks/useTabToTop';
import { useRef } from 'react';
import { useBottomTabOverflow } from './ui/TabBarBackground';

function GridItemNative({
  buttonTitle,
  year,
  ratio,
  title,
  subtitle,
  video,

  href,
}: {
  title: string;
  buttonTitle?: string;
  ratio?: string;
  subtitle?: string;
  year?: number | string;
  video?: any;

  href: string;
}) {
  return (
    <TouchableImpact
      onPress={() => {
        WebBrowser.openBrowserAsync(href, {
          toolbarColor: 'black',
          controlsColor: 'white',
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        });
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: buttonTitle ? 8 : 8,
          justifyContent: 'center',
          borderRadius: 24,
          backgroundColor: '#191A20',
          borderWidth: 1,
          borderColor: '#2e2e2e',
          gap: 8,
        }}
      >
        <View
          style={{
            aspectRatio: '16 / 9',
            borderRadius: 16,
            overflow: 'hidden',
            flex: 1,
            width: '100%',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              overflow: 'hidden',
            }}
          >
            {video && (
              <Video
                source={video}
                isMuted
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                videoStyle={{
                  width: '100%',
                  height: '100%',
                }}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderRadius: 8,
                    width: '100%',
                    height: '100%',
                  },
                ]}
              />
            )}
          </View>

          <View
            style={{
              position: 'absolute',
              top: '33.3333%',
              left: 0,
              bottom: 0,
              right: 0,
              [process.env.EXPO_OS === 'web'
                ? 'backgroundImage'
                : `experimental_backgroundImage`]: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
              borderRadius: 16,
            }}
          />
          {/* Text Container */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                gap: 2,
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <H3
                style={{
                  fontSize: 24,
                  lineHeight: 32,
                  marginBottom: 0,
                  fontWeight: 'bold',
                  color: '#e5e5e5',
                }}
              >
                {title}
              </H3>
              {subtitle && (
                <Span
                  style={{
                    color: '#e5e5e5',
                  }}
                >
                  {subtitle}
                </Span>
              )}
            </View>
            {year && (
              <Span
                style={{
                  color: '#e5e5e5',
                  opacity: 0.8,
                }}
                //   className="text-slate-50 opacity-80"
              >
                {year}
              </Span>
            )}
          </View>
        </View>
        {buttonTitle && (
          <View
            style={{
              padding: 2,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              flex: 1,
              backgroundColor: '#21222B',
            }}
          >
            <P
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#f8fafc',
              }}
            >
              {buttonTitle}
            </P>
          </View>
        )}
      </View>
    </TouchableImpact>
  );
}

function GridItem({
  buttonTitle,
  year,
  ratio,
  title,
  subtitle,
  video,
  image,
  href,
}: {
  title: string;
  buttonTitle?: string;
  ratio?: string;
  subtitle?: string;
  year?: number;
  video?: any;
  image?: any;
  href: string;
}) {
  return (
    <Link
      // @ts-expect-error
      href={href}
      target="_blank"
      className={cn(ratio, 'flex')}
    >
      <div
        className={cn(
          'group flex-1 rounded-2xl overflow-hidden gap-2 bg-[#191A20] border border-[#2e2e2e] flex flex-col',
          buttonTitle && 'p-2'
        )}
        style={{ borderRadius: '1.5rem' }}
      >
        <div
          className={cn(
            'relative flex-1',
            'aspect-video',
            'transition-all canhover:grayscale group-hover:grayscale-0 overflow-hidden rounded-2xl'
          )}
        >
          <div
            className={cn(
              'absolute top-0 left-0 bottom-0 right-0 overflow-hidden',
              'transition-transform group-hover:scale-105'
            )}
          >
            {video && (
              <Video
                source={video}
                posterSource={image}
                isMuted
                resizeMode={ResizeMode.COVER}
                shouldPlay
                // shouldPlay={!isHoverEnabled() || isMobileSafari()}
                isLooping
                videoStyle={{
                  width: '100%',
                  height: '100%',
                }}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    // zIndex: -1,
                    borderRadius: '1rem',
                    width: '100%',
                    height: '100%',
                  },
                ]}
              />
            )}
          </div>

          <div className="absolute top-1/3 left-0 bottom-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl" />
          {/* Text Container */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-row justify-between items-center">
            <div className="">
              <h3 className="text-2xl font-bold text-slate-50">{title}</h3>
              {subtitle && <p className="text-slate-50">{subtitle}</p>}
            </div>
            {year && <p className="text-slate-50 opacity-80">{year}</p>}
          </div>
        </div>
        {buttonTitle && (
          <div className="flex p-2 items-center justify-center rounded-2xl bg-[#21222B] transition-colors group-hover:bg-[#282A35]">
            <p className="text-lg font-bold text-slate-50">{buttonTitle}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

const Projects: (Project & { button?: string })[] = [
  {
    button: 'Play now',
    ratio: 'md:col-span-2 md:row-span-2',
    image: {
      uri: '/projects/crossy-road/preview.jpg',
    },
    video: require('../../public/projects/crossy-road/demo.mp4'),
    title: 'Crossy Platform',
    description: `The endless arcade hopper you'll never want to put down.`,
    year: 2017,
    color: '#6dceea',
    actions: [
      {
        url: 'https://crossyroad.expo.app',
      },
      {
        url: 'https://github.com/evanbacon/expo-crossy-road',
      },
    ],
  },
  {
    button: 'Traverse Pillars',
    ratio: 'md:row-span-3',
    image: { uri: '/projects/pillar-valley/preview.png' },
    video: require('../../public/projects/pillar-valley/demo.mp4'),
    description: 'Immerse yourself in a suave world of zen.',
    title: 'Pillar Valley',
    year: 2018,
    color: '#E07C4C',
    actions: [
      {
        url: 'https://pillarvalley.netlify.app',
      },
      {
        url: 'https://github.com/evanbacon/expo-pillar-valley',
      },
    ],
  },
  {
    image: { uri: '/projects/snake/preview.jpeg' },
    video: require('../../public/projects/snake/demo.mp4'),
    title: 'Snake',
    description: 'Slither your way through this retro snake adventure.',
    year: 2019,
    color: '#7ED321',
    actions: [
      {
        url: 'https://retrosnake.netlify.app',
      },
      {
        url: 'https://github.com/evanbacon/snake',
      },
    ],
  },
  {
    // ratio: 'row-span-4',
    image: { uri: '/projects/doodle-jump/preview.jpeg' },
    video: require('../../public/projects/doodle-jump/demo.mp4'),
    title: 'Doodle Jump',
    description: 'Bounce for hours in this cute lil clone.',
    year: 2018,
    color: '#cbc816',
    isDarkColored: true,
    actions: [
      {
        url: 'https://doodlejump.netlify.app/',
      },
      {
        url: 'https://github.com/evanbacon/expo-doodle-jump',
      },
    ],
  },

  {
    image: { uri: '/projects/flappy-bird/preview.jpeg' },
    video: require('../../public/projects/flappy-bird/demo.mp4'),
    title: 'Flappy Bird',
    description: 'Infatuation knows no bounds in this maddening monstrosity.',
    year: 2018,
    color: '#DDD79F',
    isDarkColored: true,
    actions: [
      {
        url: 'https://flappybacon.netlify.app/',
      },
      {
        url: 'https://github.com/evanbacon/react-native-flappy-bird',
      },
    ],
  },

  {
    ratio: 'md:col-span-2 md:row-span-1',
    button: 'Play now',
    image: { uri: '/projects/sunset-cyberspace/preview.png' },
    video: require('../../public/projects/sunset-cyberspace/demo.mp4'),
    // ratio: 'row-span-2 col-span-1',
    title: 'Sunset Cyberspace',
    description: 'A mystic sage Chucky Cheevs fights off the Xamaronians.',
    year: 2017,
    color: '#F914E4',
    actions: [
      {
        url: 'https://cyberspace.netlify.app/',
      },
      {
        url: 'https://github.com/evanbacon/sunset-cyberspace',
      },
    ],
  },
];
