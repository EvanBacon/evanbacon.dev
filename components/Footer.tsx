import ExpoIcon from '@/assets/expo.svg';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useREM } from 'react-native-web-hooks';

import Colors from '../constants/Colors';
import Quotes from '../constants/Quotes';
import Quote from './Quote';
import SocialIcon from './SocialIcon';

const ICON_SIZE = 24;

const socials = [
  {
    name: 'twitter',
    url: 'https://twitter.com/baconbrix',
  },
  {
    name: 'youtube-play',
    url: 'https://www.youtube.com/baconbrix',
  },
  {
    name: 'github',
    url: 'https://github.com/evanbacon',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/baconbrix/',
  },
  {
    name: 'medium',
    url: 'http://medium.com/@baconbrix',
  },
  {
    name: 'twitch',
    url: 'https://www.twitch.tv/baconbrix',
  },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/evanbacon',
  },
  // dev icon not supported in current version of FontAwesome (@expo/vector-icons)
  // {
  //     name: 'dev',
  //     url: 'https://dev.to/evanbacon'
  // },
];

const hourIndex = new Date().getHours();

export default function CustomFooter() {
  const { bottom, left, right } = useSafeAreaInsets();

  const [index, setIndex] = React.useState(hourIndex);
  const quote = Quotes[index % Quotes.length];

  return (
    <footer style={styles.container}>
      <div
        style={{
          flex: 1,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        }}
      >
        <TouchableOpacity
          style={{ alignItems: 'center', marginVertical: 8 }}
          onPress={() => setIndex(index + 1)}
        >
          <Quote
            quote={quote}
            author="Evan Bacon 🥓"
            url="https://github.com/evanbacon"
          />
        </TouchableOpacity>

        <div style={styles.socialWrapper}>
          {socials.map(social => (
            <Link
              style={{ marginRight: 8 }}
              target="_blank"
              key={social.name}
              href={social.url}
              hoverStyle={{ transform: [{ scale: 1.1 }] }}
            >
              <SocialIcon name={social.name} color="white" size={16 * 2.2} />
            </Link>
          ))}
        </div>
        <div style={styles.linkContainer}>
          <Link
            target="_blank"
            href="https://www.expo.io"
            style={styles.link}
            hoverStyle={styles.linkFocus}
          >
            <ExpoIcon width={ICON_SIZE} height={ICON_SIZE} fill="white" />
            <h5 style={styles.footerText}>Built with Expo</h5>
          </Link>
        </div>
      </div>
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
