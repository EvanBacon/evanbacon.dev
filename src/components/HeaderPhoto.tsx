import React from 'react';
import { StyleSheet } from 'react-native';

import AspectImage from './AspectImage';

const SIZE = 48;

const HeaderPhoto = () => {
  return (
    <img
      src={'/pfp.png'}
      loading="lazy"
      style={{ animationDuration: '500ms', animationDelay: '0ms' }}
      className="opacity-0 animate-kennyburns aspect-square w-[48px] h-[48px] rounded-full mr-3"
    />
  );
  return (
    <AspectImage
      source={require('../../assets/pfp.jpg')}
      loading="lazy"
      style={styles.image}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    marginRight: 12,
  },
});

export default HeaderPhoto;
