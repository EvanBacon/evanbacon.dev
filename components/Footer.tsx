import { Footer } from '@expo/html-elements';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { useSafeArea } from 'react-native-safe-area-context';
import { useREM } from 'react-native-web-hooks';

import Quotes from '../constants/Quotes';
import Quote from './Quote';
import SocialIcon from './SocialIcon';
import UniversalLink from './UniversalLink';

const socials = [
  {
    name: 'twitter',
    url: 'https://twitter.com/baconbrix',
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
  const { bottom, left, right } = useSafeArea();

  const [index, setIndex] = React.useState(hourIndex);
  const quote = Quotes[index % Quotes.length];

  return (
    <Footer style={styles.container}>
      <View
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

        <View style={styles.socialWrapper}>
          {socials.map(social => (
            <UniversalLink
              style={{ marginRight: 8 }}
              target="_blank"
              key={social.name}
              routeName={social.url}
              focusStyle={{ transform: [{ scale: 1.1 }] }}
            >
              <SocialIcon name={social.name} color="white" size={16 * 2.2} />
            </UniversalLink>
          ))}
        </View>
        <View style={styles.linkContainer}>
          <UniversalLink routeName="https://www.expo.io" style={styles.link}>
            Built with Expo
          </UniversalLink>
        </View>
      </View>
    </Footer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4630eb',
    paddingVertical: `1.0875rem`,
    paddingHorizontal: `1.45rem`,
  },
  linkContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  link: { color: 'white', fontWeight: 'bold', fontSize: useREM(1.2) },
  socialWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: useREM(2.2),
  },
});
