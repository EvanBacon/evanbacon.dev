import Laurel from '../../assets/laurel.svg';
import { StyleSheet } from 'react-native';
import { useREM } from 'react-native-web-hooks';
import { BlockQuote, Div, Footer, P, Span } from '@expo/html-elements';

const color = 'white';

export default function Quote({ quote, author, url }) {
  return (
    <Div style={styles.container}>
      <Laurel style={styles.startLeaf} />
      <BlockQuote cite={url} style={styles.blockQuote}>
        <Span style={styles.quote}>{quote}</Span>
        <Footer>
          <P style={styles.footerText}>{`~ ${author}`}</P>
        </Footer>
      </BlockQuote>
      <Laurel style={styles.endLeaf} />
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    transitionDuration: '200ms',
    flex: 1,
  },
  blockQuote: {
    alignItems: 'stretch',
    flex: 1,
    maxWidth: 720,
    marginHorizontal: useREM(0.5),
    transitionDuration: '200ms',
  },
  quote: {
    color,
    fontSize: 24,
    flexWrap: 'wrap',
    fontWeight: 'bold',
    textAlign: 'left',
    transitionDuration: '200ms',
  },
  footerText: {
    color,
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'right',
    fontWeight: 'bold',
    transitionDuration: '200ms',
    flex: 1,
    marginBottom: 0,
    marginTop: 15,
  },
  startLeaf: { minWidth: 48, fill: color },
  endLeaf: { minWidth: 48, fill: color, transform: [{ scaleX: -1 }] },
});
