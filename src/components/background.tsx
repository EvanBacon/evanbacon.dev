import { unstable_styles } from '@/styles/background.module.css';
import { View } from 'react-native';

export function Background() {
  return (
    <View style={unstable_styles.main}>
      <View className={unstable_styles.content} />
    </View>
  );
}
