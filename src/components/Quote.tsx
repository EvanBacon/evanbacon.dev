import { StyleSheet } from 'react-native';
import { useREM } from 'react-native-web-hooks';

import Laurel from '../../assets/laurel.svg';

const color = 'white';

export default function Quote({
  quote,
  author,
  url,
}: {
  quote?: any;
  author?: string;
  url?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center flex-row py-4">
      <Laurel style={styles.startLeaf} />
      <blockquote cite={url} className="items-stretch flex  mx-2 flex-col">
        <span className="text-white text-xl font-bold text-center font-serif">
          {quote}
        </span>
        {author && (
          <p className="text-white opacity-60 text-md italic text-center mt-2">{`— ${author} —`}</p>
        )}
      </blockquote>
      <Laurel style={styles.endLeaf} />
    </div>
  );
}

const styles = StyleSheet.create({
  startLeaf: { minWidth: 48, fill: color },
  endLeaf: { minWidth: 48, fill: color, transform: [{ scaleX: -1 }] },
});
