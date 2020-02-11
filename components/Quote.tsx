import React from 'react';
import { Text, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import * as SVG from 'react-native-svg';
import { useREM } from 'react-native-web-hooks';
import { BlockQuote, Footer } from '@expo/html-elements';

function Laurel({ style }: any) {
  return (
    <SVG.Svg width="62" height="77" viewBox="0 0 62 77" style={style}>
      <SVG.G fillRule="evenodd">
        <SVG.Path d="M58.614,76.106 C58.614,76.106 60.673,75.305 61.13,73.361 C61.4353333,72.0663333 54.0516667,67.618 38.979,60.016 C38.979,60.016 40.778,52.209 31.743,50.494 C27.628,61.244 38.753,60.427 38.753,60.427 L38.572,61.913 C38.572,61.913 27.399,59.298 25.569,67.419 C37.219,72.919 38.167,63.671 38.753,62.273 C39.783,62.045 54.384,70.16 58.614,76.106 Z" />
        <SVG.Path d="M28.314 59.526C28.314 59.526 20.264 54.741 13.792 60.097 14.708 64.1 25.684 68.329 28.314 59.526zM28.833 57.987C28.833 57.987 31.746 48.436 25.455 46.605 20.265 52.308 24.923 57.15 28.833 57.987z" />
        <SVG.Path d="M19.903 52.714C19.903 52.714 26.176 46.443 20.623 40.885 15.664 43.694 16.024 49.554 19.903 52.714zM19.078 54.001C19.078 54.001 12.777 46.488 5.346 49.833 5.346 53.075 12.753 61.407 19.078 54.001zM12.135 45.666C12.135 45.666 9.438 35.891.717 36.413.101 41.656 3.649 49.678 12.135 45.666zM13.543 44.865C13.543 44.865 21.707 40.806 18.461 34.095 12.642 34.355 11.063 40.625 13.543 44.865zM8.742 35.175C8.742 35.175 10.437 24.222 1.179 22.832.254 27.613-.363 36.719 8.742 35.175zM10.296 34.988C10.296 34.988 18.459 34.312 18.771 26.532 11.981 25.607 10.386 27.321 10.296 34.988z" />
        <SVG.Path d="M9.049 24.22C9.049 24.22 14.142 15.116 6.735 10.024 2.723 14.499 1.004 23.126 9.049 24.22zM10.521 24.571C10.521 24.571 20.16 26.688 21.395 19.746 17.536 17.893 13.093 16.454 10.521 24.571z" />
        <SVG.Path d="M13.523 14.347C13.523 14.347 22.165 5.703 15.684.149 9.512 3.234 7.318 10.996 13.523 14.347zM14.604 15.116C14.604 15.116 22.011 19.746 26.641 14.499 26.024 11.566 20.311 6.666 14.604 15.116z" />
      </SVG.G>
    </SVG.Svg>
  );
}

const color = 'white';

export default function Quote({ quote, author, url }) {
  return (
    <View style={styles.container}>
      <Laurel style={styles.startLeaf} />
      <BlockQuote cite={url} style={styles.blockQuote}>
        <Text style={styles.quote}>{quote}</Text>
        <Footer style={styles.footerText}>
          <Text style={styles.author}>{`~ ${author}`}</Text>
        </Footer>
      </BlockQuote>
      <Laurel style={styles.endLeaf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    transitionDuration: '200ms',
  },
  blockQuote: {
    alignItems: 'stretch',
    maxWidth: 720,
    marginHorizontal: useREM(0.5),
    transitionDuration: '200ms',
  },
  quote: {
    color,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    transitionDuration: '200ms',
  },
  footerText: {
    color,
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'right',
    transitionDuration: '200ms',
  },
  startLeaf: { minWidth: 48, fill: color },
  endLeaf: { minWidth: 48, fill: color, transform: [{ scaleX: -1 }] },
  author: {
    fontSize: 24,
    color: 'white',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
