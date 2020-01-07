import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLayout, useREM } from 'react-native-web-hooks';

import CustomAppearanceContext from '../context/CustomAppearanceContext';
import Header from './header';
import SocialIcon from './SocialIcon';
import UniversalLink from './UniversalLink';

const MAX_WIDTH = 720;

export default function Layout({ children }) {

    const { isDark } = React.useContext(CustomAppearanceContext);

    const { onLayout, width } = useLayout();

    const mainStyle = width > MAX_WIDTH + 40 ? styles.mainLarge : styles.mainSmall

    return (
        <View onLayout={onLayout} style={[StyleSheet.absoluteFill, { overflow: 'scroll', backgroundColor: isDark ? '#02010a' : 'rgb(250, 250, 250)' }]}>
            <Header siteTitle={"Evan Bacon"} />

            <View style={mainStyle}>
                <View accessibilityRole="summary">{children}</View>
            </View>

            {/* footer */}
            <Footer />

        </View>

    )
}



const styles = StyleSheet.create({
    mainLarge: {
        marginHorizontal: `auto`,
        width: MAX_WIDTH,
        paddingBottom: useREM(1.0875),
        paddingTop: 0,
    },
    mainSmall: {
        paddingHorizontal: useREM(1.45),
        paddingBottom: useREM(1.0875),
        paddingTop: 0,
    }
})


function Footer() {

    const socials = [
        {
            name: 'twitter',
            url: 'https://twitter.com/baconbrix'
        },
        {
            name: 'github',
            url: 'https://github.com/evanbacon'
        },
        {
            name: 'instagram',
            url: 'https://www.instagram.com/baconbrix/'
        },
        {
            name: 'medium',
            url: 'http://medium.com/@baconbrix'
        },
        {
            name: 'twitch',
            url: 'https://www.twitch.tv/baconbrix'
        },
        {
            name: 'linkedin',
            url: 'https://www.linkedin.com/in/evanbacon'
        },
        // dev icon not supported in current version of FontAwesome (@expo/vector-icons)
        // {
        //     name: 'dev',
        //     url: 'https://dev.to/evanbacon'
        // },
    ]
    return (
        <View style={{
            backgroundColor: '#4630eb',
            paddingVertical: `1.0875rem`,
            paddingHorizontal: `1.45rem`,
        }}>
            <View style={{ flex: 1, maxWidth: 960, justifyContent: 'center', alignItems: 'center' }}>
                <UniversalLink routeName="https://www.expo.io" style={{ color: 'white', fontWeight: 'bold', fontSize: useREM('1.2') }}>Built with Expo</UniversalLink>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: useREM(2.2) }}>
                {
                    socials.map((social) => (<UniversalLink
                        style={{ marginRight: 8 }}
                        target="_blank"
                        key={social.name}
                        routeName={social.url}>
                        <SocialIcon name={social.name} color={'white'} size={useREM(2.2)} />
                    </UniversalLink>))
                }
            </View>
        </View>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}
