import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';

import AspectImage from '../components/AspectImage';
import { H2, H4, P } from '../components/Elements';
import Layout from '../components/layout';
import SEO from '../components/seo';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Images } from '../Data';

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

function TalkCard({ title, thumbnail, description, presentedData = [], resourcesData = [] }) {
    const { isDark } = React.useContext(CustomAppearanceContext);
    return (
        <View style={{ maxWidth: 720, flex: 1, marginBottom: 20, padding: 40, backgroundColor: isDark ? 'black' : 'white' }}>
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
    const { isDark } = React.useContext(CustomAppearanceContext);

    return (
        <Layout>
            <SEO title="Brand" />
            <AspectImage source={require('../assets/shoes.jpeg')} resizeMode="cover" style={{ flex: 1, aspectRatio: 9 / 16 }} />
            <H2>About</H2>
            <View style={{ maxWidth: 720, flex: 1, marginBottom: 20, padding: 40, backgroundColor: isDark ? 'black' : 'white' }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <H2 style={{ fontSize: useREM(1.51572) }}>Photo</H2>
                </View>


                {Images.map(({ title, url }) => <View style={{ marginBottom: useREM(1.55) }}><AspectImage style={{ maxWidth: 240, marginBottom: 24 }} key={title} source={{ uri: url }} /><P>{title}</P></View>)}


                <Divider />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <H2 style={{ fontSize: useREM(1.51572) }}>Bio</H2>
                </View>

                <P style={{ marginBottom: useREM(1.55) }}>Bacon is a full-time open source developer working on Expo to make hyper-performant universal apps that run everywhere, and are used by incredible companies like Flexport, Pizza Hut, and Brex. He's built over 100 NPM packages, was the all-time youngest designer at the prestigious design firm Frog Design, and is a world renowned, award-winning Lego Master Builder. Besides programming Expo non-stop, Bacon enjoys making YouTube videos about Expo,  tweeting about Expo, and drinking Soylent while thinking about Expo.</P>
                <Divider />
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({


})

export default IndexPage
