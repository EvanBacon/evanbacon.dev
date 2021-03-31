import { ImageSourcePropType } from 'react-native';

export type ProjectAction = {
  icon: string;
  url: string;
};

export type Project = {
  image: ImageSourcePropType;
  icon?: ImageSourcePropType;
  video?: ImageSourcePropType;
  isDarkColored?: boolean;
  title: string;
  description?: string;
  year?: number | string;
  color?: string;
  authors?: string[];
  actions: ProjectAction[];
};

export type LegoProject = Project & {
  event?: string;
  awards?: string[];
  bricks?: string;
  height?: string;
  weight?: string;
};

export const OpenGraphImages = {
  brand: {
    url: 'og/brand.jpg',
    type: 'image/jpeg',
    width: 1280,
    height: 720,
    description:
      'Evan Bacon as a child holding a Batman t-shirt his mom got him for Christmas',
  },
  game: {
    url: 'og/games.jpg',
    type: 'image/jpeg',
    width: 1280,
    height: 720,
    description:
      'Shirtless Evan Bacon holding a Super Smash Bros. themed Nintendo Switch lovingly against his face',
  },
  lego: {
    url: 'og/lego.jpg',
    type: 'image/jpeg',
    width: 1280,
    height: 720,
    description:
      'Modest Evan Bacon standing humbly amongst his Marvel Lego creations at Salt Lake City Comic Con',
  },
  talks: {
    url: 'og/talks.jpg',
    type: 'image/jpeg',
    width: 1280,
    height: 720,
    description:
      'Sleepy Evan Bacon sleeping before giving his App.js Conference Talk in 2019',
  },
  code: {
    url: 'og/code.jpg',
    type: 'image/jpeg',
    width: 1280,
    height: 720,
    description: 'Focused Evan Bacon writing code with an intense stare',
  },
  media: {
    url: 'og/media.jpg',
    type: 'image/jpeg',
    width: 1280,
    height: 720,
    description: 'Happy Evan Bacon interviewed at Comic Con',
  },
};

export const Meta = {
  brand: {
    title: 'Brand',
    description: 'Branding resources for events representing Evan Bacon!',
    urlPath: 'brand',
    image: OpenGraphImages.brand,
  },
  games: {
    title: 'Games',
    description:
      'Super fun free video games programmed by Evan Bacon that you can try now in the browser or on the App Store!',
    urlPath: 'games',
    image: OpenGraphImages.game,
  },
  lego: {
    title: 'Lego',
    description:
      "Extremely awesome Lego sculptures by World's Youngest Lego Master Builder Evan Bacon!",
    urlPath: 'lego',
    image: OpenGraphImages.lego,
  },
  talks: {
    title: 'Talks',
    description: `Live talks and presentations given by Evan Bacon about exciting new software he's building!`,
    urlPath: 'talks',
    image: OpenGraphImages.talks,
  },
  code: {
    title: 'Code',
    description: `Cool things programmed by Evan Bacon ... probably while tired!`,
    urlPath: 'code',
    image: OpenGraphImages.code,
  },
  media: {
    title: 'Media',
    description: `Evan Bacon in the media`,
    urlPath: 'media',
    image: OpenGraphImages.media,
  },
};

export const Images = [
  { url: 'https://avatars.io/twitter/baconbrix', title: 'Twitter' },
  // { url: 'https://avatars.io/gravatar/baconbrix@gmail.com', title: 'Gravatar' },
];

export const Podcasts: Project[] = [
  {
    title: "Evan's World",
    image: require('./assets/podcast/evans-world.jpg'),
    year: '2020',
    color: '#F8E71C',
    authors: ['lydiahallie', 'baconbrix'],
    actions: [
      {
        url: 'https://podcasts.apple.com/us/podcast/evans-world/id1502259756',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'React Podcast',
    image: require('./assets/podcast/react-podcast.jpg'),
    year: '2020',
    color: '#FFE000',
    authors: ['chantastic'],
    actions: [
      {
        url:
          'https://www.stitcher.com/podcast/react-training/the-react-podcast/e/67313854',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'Undefined Podcast',
    image: require('./assets/podcast/undefined-podcast.jpg'),
    year: '2019',
    color: '#539EF9',
    authors: ['jaredpalmer', 'ken_wheeler'],
    actions: [
      {
        url:
          'https://undefined.fm/radio/react-native-web-with-expos-evan-bacon',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'React Native Radio',
    image: require('./assets/podcast/react-native-radio-podcast.jpg'),
    year: '2018',
    color: '#F5A623',
    authors: ['dabit3', 'spencer_carli', 'peterpme'],
    actions: [
      {
        url:
          'https://devchat.tv/react-native-radio/react-native-at-expo-feat-evan-bacon/',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'Beyond the brick with Evan Bacon',
    image: require('./assets/podcast/behind-the-brick.jpg'),
    year: '2012',
    color: '#FFC100',
    authors: ['John_Hanlon', 'BeyondtheBrick'],
    actions: [
      {
        url:
          'https://modernlife.network/interview-with-lego-builder-evan-bacon/',
        icon: 'microphone',
      },
    ],
  },
];

export const News = [
  {
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Evan_Bacon',
  },
  {
    url:
      'http://www.mtv.com/news/2623063/13-year-old-wins-awards-for-life-size-lego-batman/',
    title: 'MTV at age 13',
  },
  {
    url: 'http://www.mtv.com/news/2626251/life-size-lego-iron-man/',
    title: 'MTV at age 14',
  },
  {
    url: 'https://www.huffpost.com/entry/evan-bacon-15-year-old-bu_n_2876505',
    title: 'Huffington Post at age 15',
  },
  {
    url: 'https://madewithreactnative.com/pillar-valley/',
    title: 'Blog: How I started programming',
  },
];

export const Videos = [
  {
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Evan_Bacon',
  },

  {
    url:
      'http://www.mtv.com/news/2623063/13-year-old-wins-awards-for-life-size-lego-batman/',
    title: 'MTV at age 13',
  },
  {
    url: 'http://www.mtv.com/news/2626251/life-size-lego-iron-man/',
    title: 'MTV at age 14',
  },
  {
    url: 'https://www.huffpost.com/entry/evan-bacon-15-year-old-bu_n_2876505',
    title: 'Huffington Post at age 15',
  },
  {
    url: 'https://madewithreactnative.com/pillar-valley/',
    title: 'Blog: How I started programming',
  },
];

export const Work = [
  {
    title: 'Sirius XM 360L',
    company: 'Frog Design',
    website: 'https://www.siriusxm.com/',
    stack: ['Java', 'Android SDK'],
    description:
      'I worked for ~2 years redesigning the radio for everyone. I worked on the project as a Design Technologist 2. My stack consisted of mostly of Java and the Android SDK, we also needed to use Objective-C, and Node.',
    video: 'https://www.youtube.com/watch?v=mi389M2gixA',
    links: [
      'https://www.siriusxm.ca/newsroom/siriusxm-with-360l-experience-available-in-all-new-cadillac-xt6/',
      'https://www.prnewswire.com/news-releases/general-motors-offers-siriusxm-with-360l-on-nearly-1-million-vehicles-300976098.html',
    ],
  },
  {
    title: 'Vixxo App',
    website: 'https://www.vixxo.com/',
    stack: ['Xamarin'],
  },
  {
    title: 'FIS Global Dashboard',
    website: 'https://www.fisglobal.com/',
    stack: ['Angular'],
  },
  {
    title: 'Howard Stern Video App',
    website:
      'https://www.siriusxm.com/streaming?hpid=HP_NEW_ListenOnlineOntheApp',
  },
  {
    title: 'New Matter MOD-t 3D Printer Studio',
    website: 'http://www.newmatter.co/',
  },
];

export const Projects: Project[] = [
  {
    image: require('./assets/projects/crossy-road/preview.jpg'),
    icon: require('./assets/projects/crossy-road/app-icon.png'),
    video: require('./assets/projects/crossy-road/demo.mp4'),
    title: 'Crossy Road',
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
    image: require('./assets/projects/pillar-valley/preview.png'),
    icon: require('./assets/projects/pillar-valley/app-icon.png'),
    video: require('./assets/projects/pillar-valley/demo.mp4'),
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
    image: require('./assets/projects/snake/preview.jpeg'),
    icon: require('./assets/projects/snake/app-icon.jpg'),
    video: require('./assets/projects/snake/demo.mp4'),
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
    image: require('./assets/projects/sunset-cyberspace/preview.png'),
    icon: require('./assets/projects/sunset-cyberspace/app-icon.png'),
    video: require('./assets/projects/sunset-cyberspace/demo.mp4'),
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
  {
    image: require('./assets/projects/doodle-jump/preview.jpeg'),
    icon: require('./assets/projects/doodle-jump/app-icon.png'),
    video: require('./assets/projects/doodle-jump/demo.mp4'),
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
    image: require('./assets/projects/flappy-bird/preview.jpeg'),
    icon: require('./assets/projects/flappy-bird/app-icon.png'),
    video: require('./assets/projects/flappy-bird/demo.mp4'),
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
    image: require('./assets/projects/super-mario/preview.jpeg'),
    icon: require('./assets/projects/super-mario/app-icon.png'),
    title: 'Super Mario',
    description: 'Phaser used for ultra fun times.',
    year: 2018,
    color: '#b80300',
    actions: [
      {
        icon: 'code',
        url: 'https://github.com/EvanBacon/Expo-Super-Mario-World',
      },
    ],
  },
  {
    image: require('./assets/projects/nitro-roll/preview.png'),
    icon: require('./assets/projects/nitro-roll/app-icon.png'),
    title: 'Nitro Roll',
    description:
      'Roll through the nitro-sonic Voidiverse avoiding the Bleaqaulizers!',
    year: 2018,
    color: '#fff',
    actions: [
      {
        icon: 'code',
        url: 'https://github.com/evanbacon/expo-nitro-roll',
      },
    ],
  },
];

export const Social = [
  {
    title: 'codepen',
    url: 'https://codepen.io/EvanBacon',
  },
  {
    title: 'instagram',
    url: 'https://www.instagram.com/baconbrix/',
  },
  {
    title: 'twitch',
    url: 'https://www.twitch.tv/baconbrix',
  },
  {
    title: 'twitter',
    url: 'https://twitter.com/baconbrix',
  },
  {
    title: 'github',
    url: 'https://github.com/evanbacon',
  },
  {
    title: 'medium',
    url: 'https://medium.com/@Baconbrix',
  },
  {
    title: 'dev.to',
    url: 'https://dev.to/evanbacon',
  },
  {
    title: 'youtube',
    url: 'https://www.youtube.com/c/exposition',
  },
];

export const Workshops = [
  {
    event: 'React Europe',
    title: 'Game Development with Expo',
    type: 'Workshop',
    year: 2018,
  },
  {
    event: 'React Europe',
    title: 'Web Development with Expo',
    type: 'Workshop',
    year: 2019,
  },
  {
    event: 'React Europe',
    title: 'Gestures with React Native',
    type: 'Workshop',
    year: 2019,
  },
  {
    event: 'App.js Conf',
    title: 'Intro to Expo for Web',
    type: 'Workshop',
    year: 2020,
  },
];

export const Lego: LegoProject[] = [
  {
    title: 'Batman',
    description: 'DC Comics',
    image: require('./assets/lego/batman.jpg'),
    color: '#fde219',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/uw8kZjuFzABwMzYu6',
      },
    ],
    event: 'Brick Fiesta 2011',
    awards: [
      'Best Youth Creation',
      'Best Artistic Creation',
      `People's choice award`,
    ],
    year: '2011',
    bricks: '15,000 - 20,000',
    height: `6'2"`,
    weight: '60lb',
  },
  {
    title: 'Thor',
    description: 'Marvel',
    image: require('./assets/lego/thor.jpg'),
    color: '#A68950',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/rUdXMnyGkmXiZij4A',
      },
    ],
    year: '2016',
  },
  {
    title: 'Iron Man',
    description: 'Marvel',
    image: require('./assets/lego/ironman.jpg'),
    color: '#782E2A',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/TyfRHGfWMhCz4uRq5',
      },
    ],
    year: '2012',
  },

  {
    title: 'Superman',
    bricks: '18,000',
    description: 'DC Comics',
    color: '#4277E1',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/GiQrFAoLhVDfmumS6',
      },
    ],
    image: require('./assets/lego/superman.jpg'),
    year: '2012',
  },
  {
    title: 'Captain Kirk',
    description: 'Star Trek',
    color: '#DCC743',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/7zfDKW9Pf9ssiLv56',
      },
    ],
    image: require('./assets/lego/captainkirk.jpg'),
    year: '2013',
  },
  {
    title: 'Darth Vader',
    description: 'Star Wars',
    color: '#E43C39',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/ukFadzsRyMgA9p338',
      },
    ],
    image: require('./assets/lego/darthvader.jpg'),
    year: '2016',
  },
  {
    title: 'Sarge',
    description: 'Red Vs. Blue',
    color: '#C65728',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/C3dGAKruSsh1xLEi7',
      },
    ],
    image: require('./assets/lego/sarge.jpg'),
    year: '2016',
  },
  {
    title: 'Wonder Woman',
    description: 'DC Comics',
    color: '#316FDF',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/PjsnkENMKfZjfSTj9',
      },
    ],
    image: require('./assets/lego/wonderwoman.jpg'),
    year: '2015',
  },

  {
    title: 'Captain America',
    description: 'Marvel',
    color: '#70ACEC',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/ejuBH4RWnPTDUgdf6',
      },
    ],
    image: require('./assets/lego/captainamerica.jpg'),
    year: '2016',
  },
  {
    title: 'Minion',
    description: 'Despicable Me',
    color: '#F5F858',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/CttdaRbsHKLcq1Tq9',
      },
    ],
    image: require('./assets/lego/minion.jpg'),
    year: '2013',
  },
];

function ytvid(
  id: string
): { title: 'Video'; href: string; thumbnail: string } {
  return {
    title: 'Video',
    href: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `http://img.youtube.com/vi/${id}/hqdefault.jpg`,
  };
}

export const Talks = [
  // TODO: Bacon: Add graphql contributor days
  // Add future events: reactathon 2020, app.js conf 2020, react europe 2020
  // {
  //   title: 'Announcing Expo for Web v1',
  //   description: `Proudly presenting the first production ready version of Expo in the browser`,
  //   presentedData: [
  //     {
  //       title: 'App.js Conf',
  //       href: 'https://appjs.co/',
  //       date: 'April 4th, 2020',
  //       upcoming: true,
  //       resources: [],
  //     },
  //   ],
  // },
  {
    title: 'React Native Panel (Error Stack Traces)',
    image: { uri: 'http://img.youtube.com/vi/_HKzhe8f47Y/hqdefault.jpg' },
    description: `I give a brief overview of Error improvements in Expo SDK 41`,
    presentedData: [
      {
        title: 'React Day Bangalore',
        href: 'https://reactday.in/',
        date: 'May 20th, 2021',
        resources: [ytvid('_HKzhe8f47Y')],
      },
    ],
  },
  {
    title: 'React Native for React Developers',
    image: { uri: 'http://img.youtube.com/vi/uyZslq7Jsno/hqdefault.jpg' },
    description: `React Native can be pretty intimidating for web developers. See what I've been doing at Expo to close the gap.`,
    presentedData: [
      {
        title: 'React Europe',
        href: 'https://www.react-europe.org/',
        date: 'May 14th, 2020',
        resources: [ytvid('uyZslq7Jsno')],
      },
    ],
  },
  {
    title: 'Build it once with Expo for Web',
    description:
      'Latest info on building websites with Expo. (Cancelled due to covid related restrictions)',
    presentedData: [
      {
        title: 'Reactathon',
        href: 'https://www.reactathon.com/',
        date: 'March 31st, 2020',
        upcoming: false,
        resources: [],
      },
    ],
  },
  {
    title: 'Expo for Web',
    image: require('./assets/talks/expo-for-web.jpg'),
    description:
      'Using Expo you can build an app that runs natively for iOS, Android, and in the web browser. You’ll see how Expo and React Native for web enable you to use cutting-edge browser functionality to create websites, progressive web apps, and Electron apps that emulate the functionality of your native app as closely as possible. You’ll also learn what you can do with it, why you would use it, and how it works with other popular web development tools.',
    presentedData: [
      {
        title: 'React Europe',
        href: 'https://2019.react-europe.org/',
        date: 'May 21st, 2019',
        resources: [
          ytvid('UcjCuWy81YM'),
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/HNYBza7dAu6N92nD6',
          },
        ],
      },
      {
        title: 'Reactive Conf',
        href: 'https://reactiveconf.com/',
        date: 'October 30th, 2019',
        resources: [
          ytvid('k1FdrhA2sCY'),
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/QjnahANvA7Vn1V9b7',
          },
        ],
      },
      {
        title: 'React Day Berlin',
        href: 'https://reactday.berlin/',
        date: 'December 6th, 2019',
        resources: [
          ytvid('ykBxY01j_rA'),
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/T8rjmu6JxNr31bNw7',
          },
        ],
      },
    ],
  },
  {
    title: 'Announcing Expo for web',
    image: require('./assets/talks/debut-expo-web.jpg'),
    description:
      'Expo is on a mission to create the best possible end-to-end developer experiences for building and deploying apps on multiple platforms. Today we are very excited to announce experimental web support for the Expo CLI and SDK!',
    presentedData: [
      {
        title: 'App.js Conf',
        href: 'https://appjs.co/2019/',
        date: 'April 4th, 2019',
        resources: [
          ytvid('jt7NCutWcUU'),
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/Hwqd6gLVgx6UBFQWA',
          },
        ],
      },
    ],
  },
  {
    title: 'AR in React Native',
    image: require('./assets/talks/expo-ar.jpg'),
    description:
      "Creating augmented reality apps with Expo is exciting and easy! We'll discuss how it's possible, what you can do with it, and why React Native + AR is an exciting new approach.",
    presentedData: [
      {
        title: 'Chicago JS Camp',
        href: 'https://chicagojs.org/',
        date: 'September 9th, 2018',
        resources: [
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/w6HXTP4ho43sutss9',
          },
        ],
      },
    ],
  },
  {
    title: 'Using lit APIs to make dope games with Expo',
    image: require('./assets/talks/expo-gaming.jpg'),
    description:
      'In this expo symposium (exposium) 🎙 we shall cordially discuss the usage of recreational cyber-gaming frameworks and their place in the native development environment.📱👾',
    presentedData: [
      {
        title: 'React Europe',
        href: 'https://2018.react-europe.org/#schedule-item-1454',
        date: 'May 18th, 2018',
        resources: [
          ytvid('oHBGhHlVOI0'),
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/93R1rqyu3rL6YjkaA',
          },
          // {
          //     // Slides
          //     // Demos
          //     // Source Code
          //     // Shout-outs
          // }
        ],
      },
    ],
  },
];
