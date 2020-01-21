import React from 'react';
import StyleSheet from 'react-native-extended-stylesheet';

import AspectImage from './AspectImage';

const SIZE = 48;

const HeaderPhoto = () => {
  return (
    <AspectImage
      source={{ uri: 'https://avatars.io/twitter/baconbrix' }}
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
