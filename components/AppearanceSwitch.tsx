import React from 'react';
import { Animated, Switch, View } from 'react-native';

import CustomAppearanceContext from '../context/CustomAppearanceContext';

function AppearanceSwitch() {
  const { isDark, setIsDark } = React.useContext(CustomAppearanceContext);
  const value = React.useMemo(() => new Animated.Value(isDark ? 1 : 0), []);

  React.useEffect(() => {
    Animated.timing(value, {
      duration: 150,
      toValue: isDark ? 1 : 0,
    }).start();
  }, [isDark]);

  const tstyle = {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 4,
  };
  return (
    <View
      style={{ marginLeft: 12, alignItems: 'center', flexDirection: 'row' }}
    >
      <Animated.Text
        style={[
          tstyle,
          {
            opacity: value.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            transform: [
              {
                translateX: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
            ],
          },
        ]}
      >
        ☀️
      </Animated.Text>
      <Switch
        tintColor="#4d4d4d"
        onTintColor="#4d4d4d"
        trackColor={{
          false: '#4d4d4d',
          true: '#4d4d4d',
        }}
        thumbTintColor="white"
        thumbColor="white"
        value={isDark}
        onValueChange={value => {
          setIsDark(value);
        }}
      />
      <Animated.Text
        style={[
          tstyle,
          {
            opacity: value.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [
              {
                translateX: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        🌙
      </Animated.Text>
    </View>
  );
}

export default AppearanceSwitch;
