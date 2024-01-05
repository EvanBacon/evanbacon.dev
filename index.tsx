import { LogBox } from 'react-native';

import './global.css';

if (__DEV__) {
  LogBox.ignoreLogs(['"transform" style array value is deprecated.']);
} else {
  LogBox.ignoreAllLogs();
}

import 'expo-router/entry';
