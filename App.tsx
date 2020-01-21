import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React from 'react';
import { Platform } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Drawer from './components/Drawer';
import TabBar from './components/TabBar';
import TabBarIcon from './components/TabBarIcon';
import CustomAppearanceProvider from './context/CustomAppearanceProvider';
import Home from './pages';
import Games from './pages/games';
import Lego from './pages/lego';

const App = createBottomTabNavigator(
  {
    home: {
      screen: Home,
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
      screen: Games,
      navigationOptions: {
        tabBarLabel: 'Games',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name="logo-game-controller-b" />
        ),
      },
    },
    lego: {
      screen: Lego,
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

const DrawerApp = createDrawerNavigator(
  {
    App,
  },
  {
    contentComponent: Drawer,
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator({
    Drawer: { screen: DrawerApp, path: '' },
  })
);

EStyleSheet.build({}); // always call EStyleSheet.build() even if you don't use global variables!

export default () => {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <CustomAppearanceProvider>
          <ActionSheetProvider>
            <AppContainer />
          </ActionSheetProvider>
        </CustomAppearanceProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
};
