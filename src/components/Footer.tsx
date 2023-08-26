import ExpoIcon from '../../assets/expo.svg';
import GitHubIcon from '../../assets/github.svg';
import InstagramIcon from '../../assets/instagram.svg';
import XIcon from '../../assets/x.svg';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useREM } from 'react-native-web-hooks';

import Colors from '@/constants/Colors';
import Quotes from '@/constants/Quotes';
import Quote from './Quote';
import SocialIcon from './SocialIcon';
import { Div, Footer, H5 } from '@expo/html-elements';

const ICON_SIZE = 24;

const socials = [
  {
    name: 'x',
    url: 'https://x.com/baconbrix',
    // name: 'twitter',
    // url: 'https://twitter.com/baconbrix',
  },
  // {
  //   name: 'youtube-play',
  //   url: 'https://www.youtube.com/baconbrix',
  // },
  {
    name: 'github',
    url: 'https://github.com/evanbacon',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/baconbrix/',
  },
  // {
  //   name: 'medium',
  //   url: 'http://medium.com/@baconbrix',
  // },
  // {
  //   name: 'twitch',
  //   url: 'https://www.twitch.tv/baconbrix',
  // },
  // {
  //   name: 'linkedin',
  //   url: 'https://www.linkedin.com/in/evanbacon',
  // },
  // dev icon not supported in current version of FontAwesome (@expo/vector-icons)
  // {
  //     name: 'dev',
  //     url: 'https://dev.to/evanbacon'
  // },
];

export default function CustomFooter() {
  return (
    <footer className="border-t-2 border-t-slate-800 mt-2 py-6">
      <nav className="flex container mx-auto px-6 md:px-0 max-w-3xl">
        <ul>
          {[
            [
              <>
                <XIcon
                  className="inline mt-[-3px] mr-2"
                  width={18}
                  height={18}
                  fill="white"
                />
                Follow on Twitter
              </>,
              'https://x.com/baconbrix',
            ],
            [
              <>
                <GitHubIcon
                  className="inline mt-[-3px] mr-2"
                  width={18}
                  height={18}
                  fill="white"
                />
                View code on GitHub
              </>,

              'https://github.com/evanbacon',
            ],
            // [
            //   <span className="inline">
            //     Ephemeral content on Instagram{' '}
            //     <InstagramIcon
            //       className="inline"
            //       width={18}
            //       height={18}
            //       fill="white"
            //     />
            //   </span>,
            //   'https://instagram.com/baconbrix',
            // ],
            [
              <>
                <ExpoIcon
                  className="inline mt-[-3px] mr-2"
                  width={18}
                  height={18}
                  fill="white"
                />
                Powered by Expo
              </>,
              'https://www.expo.dev',
            ],
          ].map(([title, href], index) => (
            <li key={index} className="leading-loose h-10">
              <a
                target="_blank"
                href={href}
                className="text-slate-200 transition-opacity hover:opacity-70"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.theme,
    paddingVertical: `1.0875rem`,
    paddingHorizontal: `1.45rem`,
  },
  linkContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  link: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    transitionProperty: 'all',
    transitionDuration: '250ms',
  },
  linkFocus: {
    color: 'white',
    borderBottomColor: 'transparent',
    transform: [{ translateY: -4 }],
  },
  socialWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: useREM(2.2),
  },
  footerText: {
    marginVertical: 0,
    marginLeft: 8,
    color: 'white',
    fontSize: useREM(1.5),
  },
});
