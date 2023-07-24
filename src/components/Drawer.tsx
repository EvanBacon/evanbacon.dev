import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useREM } from 'react-native-web-hooks';

import Colors from '@/constants/Colors';
import Routes from '@/constants/Routes';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import AppearanceSwitch from './AppearanceSwitch';
import HeaderPhoto from './HeaderPhoto';

function DrawerItem({ title, url, style }) {
  const navigate = useRouter();

  return (
    <TouchableHighlight
      underlayColor="#ccc"
      style={style}
      onPress={() => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          Linking.openURL(url);
        } else {
          navigate.push(url || '/');
        }
      }}
    >
      <b style={{ fontSize: useREM(1), marginBottom: 0, paddingVertical: 16 }}>
        {title}
      </b>
    </TouchableHighlight>
  );
}
function Drawer() {
  // const navigateToScreen = route => () => {
  //   const navigateAction = NavigationActions.navigate({
  //     routeName: route,
  //   });
  //   props.navigation.dispatch(navigateAction);
  // };

  const { isDark } = React.useContext(CustomAppearanceContext);

  const { top, left, right, bottom } = useSafeAreaInsets();

  const sidePadding = left || 24;
  const drawerItemStyle = { paddingLeft: sidePadding };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.backgroundDark
            : Colors.backgroundLight,
          paddingBottom: bottom,
          paddingTop: top,
        },
      ]}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            paddingLeft: sidePadding,
            borderBottomColor: isDark
              ? Colors.borderColorLight
              : Colors.borderColorDark,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        >
          <HeaderPhoto />
          <h4>Evan Bacon</h4>
        </div>

        <ScrollView style={{ flex: 1 }}>
          {Routes.map(route => (
            <DrawerItem
              key={route.title}
              url={route.url}
              target={route.target}
              style={drawerItemStyle}
              title={route.title}
            />
          ))}
        </ScrollView>
        <div
          style={[
            {
              paddingTop: 16,
              paddingLeft: sidePadding,
              borderTopColor: isDark
                ? Colors.borderColorLight
                : Colors.borderColorDark,
              borderTopWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <AppearanceSwitch />
        </div>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Drawer;
