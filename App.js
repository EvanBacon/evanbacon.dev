import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import getApp from './pages/_app';
import Home from './pages/index';
import Projects from './pages/projects';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

export default createAppContainer(createSwitchNavigator({
  '/': {
    screen: () => getApp({ Component: () => <Home />, pageProps: {} }),
    path: ''
  },
  projects: () => getApp({ Component: () => <Projects />, pageProps: {} })
}, { initialRouteName: 'projects' }));

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
