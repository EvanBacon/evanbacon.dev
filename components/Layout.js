import PropTypes from 'prop-types';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import Header from './header';
import { useREM } from 'react-native-web-hooks';

import useDarkMode from '../hooks/useDarkMode';

const Anchor = (props) => {
    return <Text accessibilityRole="link" {...props} />
}

export default function Layout({ children }) {

    const isDark = useDarkMode();

    return (
       
        <View style={[StyleSheet.absoluteFill, { overflow: 'scroll', backgroundColor: isDark ? '#02010a' : 'rgb(250, 250, 250)'}]}>
            <Header siteTitle={"Evan Bacon"} />

            <View
                style={{
                    marginHorizontal: `auto`,
                    maxWidth: 960,
                    paddingBottom: `1.0875rem`,
                    paddingHorizontal: `1.45rem`,
                    paddingTop: 0,
                }}
            >
                <View accessibilityRole="summary">{children}</View>
            </View>

            {/* footer */}
            <View style={{
                backgroundColor: '#4630eb', 
                paddingVertical: `1.0875rem`,
                paddingHorizontal: `1.45rem`,
            }}>
                <View style={{ flex: 1, maxWidth: 960, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: useREM('1.2')}}>
                        <Anchor href="https://www.expo.io">Built with Expo</Anchor>
                    </Text>
                </View>
            </View>

        </View>
        
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}
