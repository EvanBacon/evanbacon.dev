import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useREM, useHover } from 'react-native-web-hooks';

import AspectImage from '../components/AspectImage';
import Layout from '../components/layout';
import ListItem, { H2, H4, P } from '../components/ListItem';
import SEO from '../components/seo';
import useDarkMode from '../hooks/useDarkMode';
import { Talks } from '../Data';

const IMAGES = [
    { uri: 'https://avatars.io/twitter/baconbrix', title: 'Twitter' },
    { uri: 'https://avatars.io/gravatar/baconbrix@gmail.com', title: 'Gravatar' },
]

function TalkCardPresentationRow({ href, thumbnail, date, title, resources = [] }) {
    const isDarkMode = useDarkMode()
    
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
                {date && <Text style={{ color: isDarkMode ? '#ffffff' : '#222426', fontSize: 18 }}>{date}</Text>}
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
    const isDarkMode = useDarkMode()
    return <View style={{ backgroundColor: isDarkMode ? 'white' : 'black', opacity: 0.1, flex: 1, minHeight: StyleSheet.hairlineWidth, maxHeight: StyleSheet.hairlineWidth, marginVertical: 20 }} />
}

function TalkCard({ title, thumbnail, description, presentedData = [], resourcesData = [] }) {
    const isDarkMode = useDarkMode()
    return (
        <View style={{ maxWidth: 720, flex: 1, marginBottom: 20, padding: 40, paddingTop: 0, backgroundColor: isDarkMode ? 'black' : 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <H2 style={{ fontSize: useREM(1.51572) }}>{title}</H2>
            </View>

            <P style={{ marginBottom: useREM(1.55) }}>{description}</P>
            <Divider />
            {!!presentedData.length && <H4 style={{ opacity: 0.6, marginBottom: 24 }}>PRESENTED AT</H4>}

            {presentedData.map(presentation => <TalkCardPresentationRow title={presentation.title} href={presentation.href} date={presentation.date} resources={presentation.resources} />)}
        </View>
    )
}


const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Talks" />
            <H2>Talks</H2>
            {Talks.map(talk => <TalkCard {...talk} />)}
        </Layout>
    )
}

const styles = StyleSheet.create({


})

export default IndexPage
