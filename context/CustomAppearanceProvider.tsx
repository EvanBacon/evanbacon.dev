import * as React from 'react';
import { StatusBar, useColorScheme, View, Platform } from 'react-native';

import AsyncStorage from '../packages/async-storage/AsyncStorage';
import CustomAppearanceContext from './CustomAppearanceContext';

// import AsyncStorage from '@react-native-community/async-storage';

const activeTestsStorageKey = '@Portfolio:CustomAppearanceContext';
const shouldRehydrate = true;

const defaultState = { isDark: false };
async function cacheModules(appearance) {
  await AsyncStorage.setItem(activeTestsStorageKey, JSON.stringify(appearance));
}

async function rehydrateModules() {
  if (!shouldRehydrate || !AsyncStorage) {
    return defaultState;
  }
  try {
    const item = await AsyncStorage.getItem(activeTestsStorageKey);
    const data = JSON.parse(item);
    return data;
  } catch (ignored) {
    return defaultState;
  }
}

export default function ModulesProvider({ children }) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = React.useState(
    Platform.OS === 'web' ? false : colorScheme === 'dark'
  );
  // const [isDark, setIsDark] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const parseModulesAsync = async () => {
      try {
        const { isDark } = await rehydrateModules();
        setIsDark(isDark);
      } catch (ignored) {}
      setLoaded(true);
    };

    parseModulesAsync();
  }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  // if (!isLoaded) {
  //   return <View />;
  // }

  return (
    <CustomAppearanceContext.Provider
      value={{
        isDark,
        setIsDark: isDark => {
          setIsDark(isDark);
          cacheModules({ isDark });
        },
      }}
    >
      {children}
    </CustomAppearanceContext.Provider>
  );
}
