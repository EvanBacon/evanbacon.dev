'use dom';

import PageHeader from '@/components/PageHeader';
import { Project } from '@/Data';
import cn from 'classnames';
import { ResizeMode, Video } from 'expo-av';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import '../../global.css';
import { IS_DOM } from 'expo/dom';
import { StyleNoSelect } from './no-select';

export default function GamesRoute({
  openExternalUrl,
  paddingBottom,
}: {
  paddingBottom: number;
  openExternalUrl: (url: string) => void;
  dom?: import('expo/dom').DOMProps;
}) {
  return (
    <div
      className="flex flex-1 flex-col gap-4 overflow-x-hidden"
      style={{
        paddingBottom,
      }}
    >
      <StyleNoSelect />
      <PageHeader>Games</PageHeader>

      <br />

      <div className="gap-2 grid grid-cols-1 md:grid-cols-2 grid-rows-4 px-2">
        {Projects.map((project, index) => {
          return (
            <GridItem
              openExternalUrl={openExternalUrl}
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

function GridItem({
  buttonTitle,
  year,
  ratio,
  title,
  subtitle,
  video,
  image,
  href,
  openExternalUrl,
}: {
  openExternalUrl: (url: string) => void;
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
      onPress={e => {
        if (IS_DOM) {
          e.preventDefault();
          openExternalUrl(href);
        }
      }}
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
    icon: { uri: '/projects/crossy-road/app-icon.png' },
    video: require('../../public/projects/crossy-road/demo.webm'),
    title: 'Crossy Platform',
    description: `The endless arcade hopper you'll never want to put down.`,
    year: 2017,
    color: '#6dceea',
    actions: [
      {
        url: 'https://crossyroad.netlify.app',
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
    icon: { uri: '/projects/pillar-valley/app-icon.png' },
    video: require('../../public/projects/pillar-valley/demo.webm'),
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
    icon: { uri: '/projects/snake/app-icon.jpg' },
    video: require('../../public/projects/snake/demo.webm'),
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
    icon: { uri: '/projects/doodle-jump/app-icon.png' },
    video: require('../../public/projects/doodle-jump/demo.webm'),
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
    icon: { uri: '/projects/flappy-bird/app-icon.png' },
    video: require('../../public/projects/flappy-bird/demo.webm'),
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
    icon: { uri: '/projects/sunset-cyberspace/app-icon.png' },
    video: require('../../public/projects/sunset-cyberspace/demo.webm'),
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
