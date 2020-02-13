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
};

export const Images = [
  { url: 'https://avatars.io/twitter/baconbrix', title: 'Twitter' },
  // { url: 'https://avatars.io/gravatar/baconbrix@gmail.com', title: 'Gravatar' },
];

export const Podcasts = [
  {
    url:
      'https://devchat.tv/react-native-radio/react-native-at-expo-feat-evan-bacon/',
    title: 'React Native Radio',
  },
  {
    url: 'https://undefined.fm/radio/react-native-web-with-expos-evan-bacon',
    title: 'Undefined Podcast',
  },
  {
    url: 'https://modernlife.network/interview-with-lego-builder-evan-bacon/',
    title: 'Behind the brick with Evan Bacon (2012)',
  },
];

export const Stories = [
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

export const Projects = [
  {
    url: 'https://crossyroad.netlify.com/',
    source: 'https://github.com/evanbacon/expo-crossy-road',
    preview: require('./assets/projects/crossy-road/preview.jpg'),
    icon: require('./assets/projects/crossy-road/app-icon.png'),
    video: require('./assets/projects/crossy-road/demo.mp4'),

    title: 'Crossy Road',
    description: `The endless arcade hopper you'll never want to put down.`,
    year: 2017,
    color: '#6dceea',
  },
  {
    url: 'https://evanbacon.github.io/Expo-Pillar-Valley/',
    source: 'https://github.com/evanbacon/expo-pillar-valley',
    preview: require('./assets/projects/pillar-valley/preview.png'),
    icon: require('./assets/projects/pillar-valley/app-icon.png'),
    video: require('./assets/projects/pillar-valley/demo.mp4'),
    description: 'Immerse yourself in a suave world of zen.',
    title: 'Pillar Valley',
    year: 2018,
    color: '#E07C4C',
  },
  {
    url: 'https://retrosnake.netlify.com',
    source: 'https://github.com/evanbacon/snake',
    preview: require('./assets/projects/snake/preview.jpeg'),
    icon: require('./assets/projects/snake/app-icon.jpg'),
    video: require('./assets/projects/snake/demo.mp4'),
    title: 'Snake',
    description: 'Slither your way through this retro snake adventure.',
    year: 2019,
    color: '#7ED321',
  },
  {
    url: 'https://cyberspace.netlify.com/',
    source: 'https://github.com/evanbacon/sunset-cyberspace',
    preview: require('./assets/projects/sunset-cyberspace/preview.png'),
    icon: require('./assets/projects/sunset-cyberspace/app-icon.png'),
    video: require('./assets/projects/sunset-cyberspace/demo.mp4'),
    title: 'Sunset Cyberspace',
    description:
      'The story follows a mystic neo-sage Chucky Cheevs who fights off the boring-bots known as Xamaronians.',
    year: 2017,
    color: '#F914E4',
  },
  {
    url: 'https://doodlejump.netlify.com/',
    source: 'https://github.com/evanbacon/expo-doodle-jump',
    preview: require('./assets/projects/doodle-jump/preview.jpeg'),
    icon: require('./assets/projects/doodle-jump/app-icon.png'),
    video: require('./assets/projects/doodle-jump/demo.mp4'),
    title: 'Doodle Jump',
    description: 'Bounce for hours in this cute lil clone.',
    year: 2018,
    color: '#cbc816',
    isDarkColored: true,
  },
  {
    url: 'https://flappybacon.netlify.com/',
    source: 'https://github.com/evanbacon/react-native-flappy-bird',
    preview: require('./assets/projects/flappy-bird/preview.jpeg'),
    icon: require('./assets/projects/flappy-bird/app-icon.png'),
    video: require('./assets/projects/flappy-bird/demo.mp4'),
    title: 'Flappy Bird',
    description: 'Infatuation knows no bounds in this maddening monstrosity.',
    year: 2018,
    color: '#DDD79F',
    isDarkColored: true,
  },
  {
    // url: 'https://github.com/EvanBacon/Expo-Super-Mario-World',
    source: 'https://github.com/EvanBacon/Expo-Super-Mario-World',
    preview: require('./assets/projects/super-mario/preview.jpeg'),
    icon: require('./assets/projects/super-mario/app-icon.png'),
    title: 'Super Mario',
    description: 'Phaser used for ultra fun times.',
    year: 2018,
    color: '#b80300',
  },
  {
    // url: '#',
    source: 'https://github.com/evanbacon/expo-nitro-roll',
    preview: require('./assets/projects/nitro-roll/preview.png'),
    icon: require('./assets/projects/nitro-roll/app-icon.png'),
    title: 'Nitro Roll',
    description:
      'Roll through the nitro-sonic Voidiverse avoiding the Bleaqaulizers!',
    year: 2018,
    color: '#fff',
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

export const Lego = [
  {
    event: 'Brick Fiesta 2011',
    awards: [
      'Best Youth Creation',
      'Best Artistic Creation',
      `People's choice award`,
    ],
    gallery: 'https://photos.app.goo.gl/uw8kZjuFzABwMzYu6',
    preview: require('./assets/lego/batman.jpg'),
    title: 'Batman',
    group: 'DC Comics',
    year: '2011',
    color: '#fde219',
    bricks: '15,000 - 20,000',
    height: `6'2"`,
    weight: '60lb',
  },
  {
    title: 'Thor',
    group: 'Marvel',
    gallery: 'https://photos.app.goo.gl/rUdXMnyGkmXiZij4A',
    preview: require('./assets/lego/thor.jpg'),
    year: '2016',
  },
  {
    title: 'Iron Man',
    group: 'Marvel',
    gallery: 'https://photos.app.goo.gl/TyfRHGfWMhCz4uRq5',
    preview: require('./assets/lego/ironman.jpg'),
    year: '2012',
  },

  {
    title: 'Superman',
    bricks: '18,000',
    group: 'DC Comics',
    gallery: 'https://photos.app.goo.gl/GiQrFAoLhVDfmumS6',
    preview: require('./assets/lego/superman.jpg'),
    year: '2012',
  },
  {
    title: 'Captain Kirk',
    group: 'Star Trek',
    gallery: 'https://photos.app.goo.gl/7zfDKW9Pf9ssiLv56',
    preview: require('./assets/lego/captainkirk.jpg'),
    year: '2013',
  },
  {
    title: 'Darth Vader',
    group: 'Star Wars',
    gallery: 'https://photos.app.goo.gl/ukFadzsRyMgA9p338',
    preview: require('./assets/lego/darthvader.jpg'),
    year: '2016',
  },
  {
    title: 'Sarge',
    group: 'Red Vs. Blue',
    gallery: 'https://photos.app.goo.gl/C3dGAKruSsh1xLEi7',
    preview: require('./assets/lego/sarge.jpg'),
  },
  {
    title: 'Wonder Woman',
    group: 'DC Comics',
    gallery: 'https://photos.app.goo.gl/PjsnkENMKfZjfSTj9',
    preview: require('./assets/lego/wonderwoman.jpg'),
    year: '2015',
  },

  {
    title: 'Captain America',
    group: 'Marvel',
    gallery: 'https://photos.app.goo.gl/ejuBH4RWnPTDUgdf6',
    preview: require('./assets/lego/captainamerica.jpg'),
    year: '2016',
  },
  {
    title: 'Minion',
    group: 'Despicable Me',
    gallery: 'https://photos.app.goo.gl/CttdaRbsHKLcq1Tq9',
    preview: require('./assets/lego/minion.jpg'),
    year: '2013',
  },
];

export const Talks = [
  // TODO: Bacon: Add graphql contributor days
  // Add future events: reactathon 2020, app.js conf 2020, react europe 2020
  {
    title: 'Announcing Expo for Web v1',
    description: `Proudly presenting the first production ready version of Expo in the browser`,
    presentedData: [
      {
        title: 'App.js Conf',
        href: 'https://appjs.co/',
        date: '2020.4.23',
        upcoming: true,
        resources: [],
      },
    ],
  },
  {
    title: 'React Native for React Developers',
    description: `React Native can be pretty intimidating for web developers. See what I've been doing at Expo to close the gap.`,
    presentedData: [
      {
        title: 'React Europe',
        href: 'https://www.react-europe.org/',
        date: '2020.5.15',
        upcoming: true,
        resources: [],
      },
    ],
  },
  {
    title: 'Build it once with Expo for Web',
    description:
      'Latest info on build websites with Expo! Get your tickets now :D',
    presentedData: [
      {
        title: 'Reactathon',
        href: 'https://www.reactathon.com/',
        date: '2020.3.31',
        upcoming: true,
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
        date: '2019.5.21',
        resources: [
          {
            title: 'Video',
            href: 'https://www.youtube.com/watch?v=UcjCuWy81YM',
            thumbnail: 'http://img.youtube.com/vi/UcjCuWy81YM/hqdefault.jpg',
          },
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/HNYBza7dAu6N92nD6',
          },
        ],
      },
      {
        title: 'Reactive Conf',
        href: 'https://reactiveconf.com/',
        date: '2019.10.30',
        resources: [
          {
            title: 'Video',
            href: 'https://www.youtube.com/watch?v=k1FdrhA2sCY',
            thumbnail: 'http://img.youtube.com/vi/k1FdrhA2sCY/hqdefault.jpg',
          },
          {
            title: 'Photos',
            href: 'https://photos.app.goo.gl/QjnahANvA7Vn1V9b7',
          },
        ],
      },
      {
        title: 'React Day Berlin',
        href: 'https://reactday.berlin/',
        date: '2019.12.6',
        resources: [
          {
            title: 'Video',
            href: 'https://www.youtube.com/watch?v=ykBxY01j_rA',
            thumbnail: 'http://img.youtube.com/vi/ykBxY01j_rA/hqdefault.jpg',
          },
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
        date: '2019.4.4',
        resources: [
          {
            title: 'Video',
            href: 'https://www.youtube.com/watch?v=jt7NCutWcUU',
            thumbnail: 'http://img.youtube.com/vi/jt7NCutWcUU/hqdefault.jpg',
          },
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
        date: '2018.9.22',
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
        date: '2018.5.18',
        resources: [
          {
            title: 'Video',
            href: 'https://www.youtube.com/watch?v=oHBGhHlVOI0',
            thumbnail: 'http://img.youtube.com/vi/oHBGhHlVOI0/hqdefault.jpg',
          },
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
