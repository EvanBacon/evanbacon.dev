import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from './pages';
import getApp from './pages/_app';
import Games from './pages/games';
import Lego from './pages/lego';
import TabBar from './components/TabBar';

const App = createBottomTabNavigator(
  {
    home: {
      screen: () => getApp({ Component: () => <Home />, pageProps: {} }),
      path: '',
    },
    games: () => getApp({ Component: () => <Games />, pageProps: {} }),
    lego: () => getApp({ Component: () => <Lego />, pageProps: {} }),
  },
  {
    tabBarComponent: TabBar,
    initialRouteName: 'lego',
  }
);

export default createAppContainer(
  createSwitchNavigator({
    App: { screen: App, path: '' },
  })
);
