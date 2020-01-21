import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { NavigationActions } from 'react-navigation';

import AppearanceSwitch from './AppearanceSwitch';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import Colors from '../constants/Colors';
import HeaderPhoto from './HeaderPhoto';
import { H4 } from './Elements';

function Drawer(props) {
  const navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    props.navigation.dispatch(navigateAction);
  };

  const { isDark } = React.useContext(CustomAppearanceContext);

  const { top, left, right, bottom } = useSafeArea();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.backgroundDark
            : Colors.backgroundLight,
          paddingLeft: left || 24,
          paddingBottom: bottom,
          paddingTop: top,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <HeaderPhoto />
        <H4>Evan Bacon</H4>

        <ScrollView style={{ flex: 1 }}>
          <View>
            <Text style={styles.sectionHeadingStyle}>Section 1</Text>
            <View style={styles.navSectionStyle}>
              <Text
                style={styles.navItemStyle}
                onPress={navigateToScreen('Page1')}
              >
                Page1
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>Section 2</Text>
            <View style={styles.navSectionStyle}>
              <Text
                style={styles.navItemStyle}
                onPress={navigateToScreen('Page2')}
              >
                Page2
              </Text>
              <Text
                style={styles.navItemStyle}
                onPress={navigateToScreen('Page3')}
              >
                Page3
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
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
