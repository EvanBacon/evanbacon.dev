import Switch from 'expo-dark-mode-switch';
import React from 'react';
import { View } from 'react-native';

import CustomAppearanceContext from '../context/CustomAppearanceContext';

function AppearanceSwitch(props) {
  const { isDark, setIsDark } = React.useContext(CustomAppearanceContext);

  return (
    <View {...props}>
      <Switch value={isDark} onChange={value => setIsDark(value)} />
    </View>
  );
}

export default AppearanceSwitch;
