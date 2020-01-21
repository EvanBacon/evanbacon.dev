import { useRouting } from 'expo-next-react-navigation';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useREM } from 'react-native-web-hooks';
import { NavigationActions } from 'react-navigation';

import Colors from '../constants/Colors';
import Routes from '../constants/Routes';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import AppearanceSwitch from './AppearanceSwitch';
import { B, H4 } from './Elements';
import HeaderPhoto from './HeaderPhoto';

function DrawerItem({ title, url, style, target }) {
  const { navigate } = useRouting();

  return (
    <TouchableHighlight
      underlayColor="#ccc"
      style={style}
      onPress={() => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          Linking.openURL(url);
        } else {
          navigate({ routeName: url || '/' });
        }
      }}
    >
      <B style={{ fontSize: useREM(1), marginBottom: 0, paddingVertical: 16 }}>
        {title}
      </B>
    </TouchableHighlight>
  );
}
function Drawer(props) {
  const navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    props.navigation.dispatch(navigateAction);
  };

  const { isDark } = React.useContext(CustomAppearanceContext);

  const { top, left, right, bottom } = useSafeArea();

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
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingLeft: sidePadding,
            borderBottomColor: isDark
              ? Colors.borderColorLight
              : Colors.borderColorDark,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        >
          <HeaderPhoto />
          <H4>Evan Bacon</H4>
        </View>

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
        <View
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
        </View>
      </View>
    </View>
  );
}

Drawer.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
});

export default Drawer;
