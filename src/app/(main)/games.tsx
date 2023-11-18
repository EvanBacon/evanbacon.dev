import PageHeader from '@/components/PageHeader';
import { Project } from '@/Data';
import cn from 'classnames';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function Games() {
  return (
    <>
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
    </>
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
    <Link href={href} className={cn(ratio, 'flex')}>
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
          {/* <img
            className="absolute top-0 left-0 bottom-0 right-0 object-cover rounded-2xl w-full h-full"
            src={resolveAssetUri(
              require('assets/projects/crossy-road/preview.jpg')
            )}
          /> */}
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
    image: require('assets/projects/crossy-road/preview.jpg'),
    icon: require('assets/projects/crossy-road/app-icon.png'),
    video: require('assets/projects/crossy-road/demo.mp4'),
    title: 'Crossy Platform',
    description: `The endless arcade hopper you'll never want to put down.`,
    year: 2017,
    color: '#6dceea',
    actions: [
      {
        icon: 'play',
        url: 'https://crossyroad.netlify.com/',
      },
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/expo-crossy-road',
      },
    ],
  },
  {
    button: 'Traverse Pillars',
    ratio: 'md:row-span-3',
    image: require('assets/projects/pillar-valley/preview.png'),
    icon: require('assets/projects/pillar-valley/app-icon.png'),
    video: require('assets/projects/pillar-valley/demo.mp4'),
    description: 'Immerse yourself in a suave world of zen.',
    title: 'Pillar Valley',
    year: 2018,
    color: '#E07C4C',
    actions: [
      {
        icon: 'play',
        url: 'https://pillarvalley.netlify.app',
      },
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/expo-pillar-valley',
      },
    ],
  },
  {
    image: require('assets/projects/snake/preview.jpeg'),
    icon: require('assets/projects/snake/app-icon.jpg'),
    video: require('assets/projects/snake/demo.mp4'),
    title: 'Snake',
    description: 'Slither your way through this retro snake adventure.',
    year: 2019,
    color: '#7ED321',
    actions: [
      {
        icon: 'play',
        url: 'https://retrosnake.netlify.com',
      },
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/snake',
      },
    ],
  },
  {
    // ratio: 'row-span-4',
    image: require('assets/projects/doodle-jump/preview.jpeg'),
    icon: require('assets/projects/doodle-jump/app-icon.png'),
    video: require('assets/projects/doodle-jump/demo.mp4'),
    title: 'Doodle Jump',
    description: 'Bounce for hours in this cute lil clone.',
    year: 2018,
    color: '#cbc816',
    isDarkColored: true,
    actions: [
      {
        icon: 'play',
        url: 'https://doodlejump.netlify.com/',
      },
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/expo-doodle-jump',
      },
    ],
  },

  {
    image: require('assets/projects/flappy-bird/preview.jpeg'),
    icon: require('assets/projects/flappy-bird/app-icon.png'),
    video: require('assets/projects/flappy-bird/demo.mp4'),
    title: 'Flappy Bird',
    description: 'Infatuation knows no bounds in this maddening monstrosity.',
    year: 2018,
    color: '#DDD79F',
    isDarkColored: true,
    actions: [
      {
        icon: 'play',
        url: 'https://flappybacon.netlify.com/',
      },
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/react-native-flappy-bird',
      },
    ],
  },

  {
    ratio: 'md:col-span-2 md:row-span-1',
    button: 'Play now',
    image: require('assets/projects/sunset-cyberspace/preview.png'),
    icon: require('assets/projects/sunset-cyberspace/app-icon.png'),
    video: require('assets/projects/sunset-cyberspace/demo.mp4'),
    // ratio: 'row-span-2 col-span-1',
    title: 'Sunset Cyberspace',
    description: 'A mystic sage Chucky Cheevs fights off the Xamaronians.',
    year: 2017,
    color: '#F914E4',
    actions: [
      {
        icon: 'play',
        url: 'https://cyberspace.netlify.com/',
      },
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/sunset-cyberspace',
      },
    ],
  },

  // {
  //   image: require('assets/projects/super-mario/preview.jpeg'),
  //   icon: require('assets/projects/super-mario/app-icon.png'),
  //   title: 'Super Mario',
  //   description: 'Phaser used for ultra fun times.',
  //   year: 2018,
  //   color: '#b80300',
  //   actions: [
  //     {
  //       icon: 'code',
  //       url: 'https://github.com/EvanBacon/Expo-Super-Mario-World',
  //     },
  //   ],
  // },
  // {
  //   image: require('assets/projects/nitro-roll/preview.png'),
  //   icon: require('assets/projects/nitro-roll/app-icon.png'),
  //   title: 'Nitro Roll',
  //   description:
  //     'Roll through the nitro-sonic Voidiverse avoiding the Bleaqaulizers!',
  //   year: 2018,
  //   color: '#fff',
  //   actions: [
  //     {
  //       icon: 'code',
  //       url: 'https://github.com/evanbacon/expo-nitro-roll',
  //     },
  //   ],
  // },
];
