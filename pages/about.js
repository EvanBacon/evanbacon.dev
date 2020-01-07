import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';

// import AspectImage from '../components/AspectImage';
import { H2, H4, P } from '../components/Elements';
import Layout from '../components/Layout';
// import SEO from '../components/seo';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Images } from '../Data';

const IndexPage = () => {
    const { isDark } = React.useContext(CustomAppearanceContext);

    return (
        <View>
            <H2>About</H2>

        </View>
    )
}


export default IndexPage
