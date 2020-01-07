import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';

import AspectImage from '../components/AspectImage';
import { H2, H4, P } from '../components/Elements';
import Layout from '../components/layout';
import SEO from '../components/seo';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Talks, Projects } from '../Data';
import UniversalLink from '../components/UniversalLink';
import SocialIcon from '../components/SocialIcon';

function TalkCardPresentationRow({ href, thumbnail, date, title, resources = [] }) {
    const { isDark } = React.useContext(CustomAppearanceContext);

    const link = React.useRef(null);
    const { isHovered } = useHover(link);

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                    ref={link}
                    target="_blank"
                    accessibilityRole="link"
                    href={href}
                    style={[{ color: 'blue', marginBottom: 10, fontSize: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'transparent' }, isHovered && { borderBottomColor: 'blue' }]}>{title}</Text>
                {date && <Text style={{ color: isDark ? '#ffffff' : '#222426', fontSize: 18 }}>{date}</Text>}
            </View>
            {thumbnail && <React.Fragment>
                <H2 style={{ fontSize: useREM(1.51572) }}>Watch Now</H2>

                <AspectImage loading="lazy" source={{ uri: thumbnail }} style={{
                    aspectRatio: 0.75
                    , width: 100
                }} />
                <Divider />
            </React.Fragment>}

            {!!resources.length && <View style={{ marginLeft: 24 }}>
                <H4 style={{ opacity: 0.6 }}>RESOURCES</H4>
                {resources.map((resource, index) => <TalkCardPresentationRow key={resource.title} title={resource.title} href={resource.href} />)}
                <Divider />
            </View>}
        </View>
    )
}

function Divider() {
    const { isDark } = React.useContext(CustomAppearanceContext);
    return <View style={{ backgroundColor: isDark ? 'white' : 'black', opacity: 0.1, flex: 1, minHeight: StyleSheet.hairlineWidth, maxHeight: StyleSheet.hairlineWidth, marginVertical: 20 }} />
}

function ProjectCard({ title, icon, color, preview, url, source, thumbnail, description, presentedData = [], resourcesData = [] }) {
    const { isDark } = React.useContext(CustomAppearanceContext);

    const socials = [
        {
            name: 'play',
            url,
        },
        {
            name: 'code',
            url: source
        }
    ]

    const ICON_SIZE = 96;
    return (
        <View style={{ maxWidth: 720, flex: 1, marginBottom: 20, backgroundColor: color || (isDark ? 'black' : 'white') }}>
            <View style={{ flex: 1, minHeight: 256, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={preview} style={[StyleSheet.absoluteFill, { opacity: 0.6 }]} resizeMode="cover" />
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={icon} style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: 8 }} resizeMode="cover" />
                    {title && <H2 style={{ textAlign: 'center', marginBottom: 0, fontSize: useREM(1.51572) }}>{title}</H2>}
                    {description && <P>{description}</P>}
                </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 40, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: useREM(2.2) }}>
                    {
                        socials.map((social) => (<View><UniversalLink
                            style={{ marginRight: 8 }}
                            target="_blank"
                            key={social.name}
                            routeName={social.url}>
                            <SocialIcon name={social.name} color={isDark ? 'white' : 'black'} size={useREM(2.2)} />
                        </UniversalLink><P style={{ marginTop: useREM(1.55) }}>{social.name}</P></View>))
                    }
                </View>
            </View>
        </View>
    )
}


const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Projects" />
            <H2>Projects</H2>
            <View style={{ flex: 1 }}>
                {Projects.map(project => <ProjectCard key={project.title} {...project} />)}
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({


})

export default IndexPage
