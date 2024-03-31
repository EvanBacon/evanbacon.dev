import { ImageSourcePropType } from 'react-native';
import { OpenGraphImages } from '@/constants/og';

export type ProjectAction = {
  icon?: 'photo';
  url: string;
};

export type Project = {
  image: ImageSourcePropType;
  icon?: ImageSourcePropType;
  video?: ImageSourcePropType;
  ratio?: string;
  isDarkColored?: boolean;
  title: string;
  description?: string;
  year?: number | string;
  color?: string;
  authors?: string[];
  actions: ProjectAction[];
};

export const Meta = {
  'expo/showcase': {
    title: 'Expo OSS Showcase',
    description: 'Top iOS apps using Expo open source software in production',
    urlPath: 'expo/showcase',
    image: OpenGraphImages.showcase,
  },
  brand: {
    title: 'Brand',
    description: 'Branding resources for events representing Evan Bacon!',
    urlPath: 'brand',
    image: OpenGraphImages.brand,
  },
  blog: {
    title: 'Blog',
    description: 'Writing and releases by Evan Bacon',
    urlPath: 'blog',
    image: OpenGraphImages.talks,
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Questions and answers about Evan Bacon',
    urlPath: 'faq',
    image: OpenGraphImages.talks,
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
  home: {
    title: 'Evan Bacon',
    description: `Artist and Software Developer. Currently reimagining mobile software with Expo.`,
    urlPath: '',
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
    title: 'Expo Router v2',
    image: require('assets/talks/appjs-2023.jpg'),
    description: `Announcing Expo Router v2. Static Rendering, automatically typed routes, async bundle splitting, CSS for web, and more!`,
    presentedData: [
      {
        title: 'App.js Conf',
        href: 'https://appjs.co/',
        date: 'May 11th, 2023',
        resources: [ytvid('608r8etX_cg')],
      },
    ],
  },
  {
    title: 'Expo Router',
    image: require('assets/talks/modernfrontends.jpg'),
    description: `File-based routing for native apps with Expo Router.`,
    presentedData: [
      {
        title: 'Twitter',
        href: 'https://twitter.com/Baconbrix',
        date: 'Nov 19th, 2022',
        resources: [
          {
            title: 'Tweet',
            href: `https://twitter.com/Baconbrix/status/1593961233165811712?s=20`,
            thumbnail: `https://twitter.com/Baconbrix/status/1593961233165811712?s=20`,
          },
        ],
      },
    ],
  },
  {
    title: 'React Native Panel (Error Stack Traces)',
    image: require('assets/talks/react-native-bangalore.png'),
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
    image: require('assets/talks/expo-html.webp'),
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
    image: require('assets/talks/expo-for-web.jpg'),
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
    image: require('assets/talks/debut-expo-web.jpg'),
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
    image: require('assets/talks/expo-ar.jpg'),
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
    image: require('assets/talks/expo-gaming.jpg'),
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
