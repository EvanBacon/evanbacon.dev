import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Home from './pages';
import getApp from './pages/_app';
import Games from './pages/games';
import Lego from './pages/lego';

export default createAppContainer(createSwitchNavigator({
  '/': {
    screen: () => getApp({ Component: () => <Home />, pageProps: {} }),
    path: ''
  },
  games: () => getApp({ Component: () => <Games />, pageProps: {} }),
  lego: () => getApp({ Component: () => <Lego />, pageProps: {} }),
}));
