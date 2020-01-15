import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { useREM } from 'react-native-web-hooks';

import { H2, P } from '../components/Elements';
import SEO from '../components/SEO';
import SocialIcon from '../components/SocialIcon';
import UniversalLink from '../components/UniversalLink';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Lego } from '../Data';


function ProjectCard({ title, icon, color, gallery, preview, url, source, thumbnail, description, presentedData = [], resourcesData = [] }) {
    const { isDark } = React.useContext(CustomAppearanceContext);

    const socials = [
        gallery && {
            icon: 'photo',
            name: 'Photo Gallery',
            url: gallery,
        },
    ].filter(Boolean)

    const themeColor = color || (isDark ? 'black' : 'white');
    const ICON_SIZE = 96;
    return (
        <View style={{ maxWidth: 720, flex: 1, marginBottom: 20, backgroundColor: themeColor }}>

            <ImageBackground
                source={preview}
                style={[
                    {
                        flex: 1,
                        paddingHorizontal: 8,
                        minHeight: 256, justifyContent: 'center', alignItems: 'center'
                    }
                ]}
                resizeMode="cover"
            >
                {false && <LinearGradient style={StyleSheet.absoluteFill} colors={['rgba(0,0,0,0.5)', themeColor]} />}
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {false && <Image source={icon} style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: 8 }} resizeMode="cover" />}
                    {title && <H2 style={{ textAlign: 'center', marginBottom: 0, fontSize: useREM(1.51572) }}>{title}</H2>}
                    {description && <P>{description}</P>}
                </View>
            </ImageBackground>
            <View style={{ flex: 1, paddingHorizontal: 40, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: useREM(2.2) }}>
                    {
                        socials.map((social) => (<View key={social.name}><UniversalLink
                            style={{ marginRight: 8 }}
                            target="_blank"

                            routeName={social.url}>
                            <SocialIcon name={social.icon} color={isDark ? 'white' : 'black'} size={16 * (2.2)} />
                        </UniversalLink><P style={{ marginTop: useREM(1.55) }}>{social.name}</P></View>))
                    }
                </View>
            </View>
        </View>
    )
}

const IndexPage = () => {
    return (
        <>
            <SEO title="Lego" />
            <H2>Lego</H2>
            {Lego.map((project: any) => <ProjectCard key={project.title} {...project} />)}
        </>
    )
}

export default IndexPage
