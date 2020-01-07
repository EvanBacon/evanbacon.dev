import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useREM } from 'react-native-web-hooks';

import SocialIcon from './SocialIcon';
import UniversalLink from './UniversalLink';


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
export default function Footer() {
    return (
        <View style={styles.container}>
            <View style={styles.linkContainer}>
                <UniversalLink routeName="https://www.expo.io" style={styles.link}>Built with Expo</UniversalLink>
            </View>
            <View style={styles.socialWrapper}>
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4630eb',
        paddingVertical: `1.0875rem`,
        paddingHorizontal: `1.45rem`,
    },
    linkContainer: { flex: 1, maxWidth: 720, justifyContent: 'center', alignItems: 'center' },
    link: { color: 'white', fontWeight: 'bold', fontSize: useREM('1.2') },
    socialWrapper: { flexDirection: 'row', justifyContent: 'space-around', marginTop: useREM(2.2) },
})
