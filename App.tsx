import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Platform } from 'react-native';
import Home from './pages';
import getApp from './pages/_app';
import Games from './pages/games';
import Lego from './pages/lego';
import TabBar from './components/TabBar';
import TabBarIcon from './components/TabBarIcon';

const App = createBottomTabNavigator(
  {
    home: {
      screen: () => getApp({ Component: () => <Home />, pageProps: {} }),
      path: '',
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-home` : 'md-home'}
          />
        ),
      },
    },
    games: {
      screen: () => getApp({ Component: () => <Games />, pageProps: {} }),
      navigationOptions: {
        tabBarLabel: 'Games',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name="logo-game-controller-b" />
        ),
      },
    },
    lego: {
      screen: () => getApp({ Component: () => <Lego />, pageProps: {} }),
      navigationOptions: {
        tabBarLabel: 'Lego',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-build` : 'md-build'}
          />
        ),
      },
    },
  },
  {
    tabBarComponent: TabBar,
    // initialRouteName: 'lego',
  }
);

export default createAppContainer(
  createSwitchNavigator({
    App: { screen: App, path: '' },
  })
);
