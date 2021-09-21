import { A, H2, H4 } from '@expo/html-elements';
import React from 'react';
import { Image } from 'react-native';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { View } from '../components/View';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

export default function Works({ navigation }) {
  return (
    <Layout maxWidth={960} navigation={navigation}>
      <PageHeader>Works</PageHeader>
      <Hero />
    </Layout>
  );
}

function Hero() {
  const { isDark } = React.useContext(CustomAppearanceContext);
  const text = isDark ? 'white' : 'black';

  return (
    <View style={{ paddingVertical: 150 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <H4 style={{ color: text, marginVertical: 0, fontWeight: 'bold', fontSize: '1.5em' }}>SIRIUS XM</H4>
        <H2 style={{ color: text, marginVertical: '0.2em', fontSize: '3.375em', fontWeight: '600' }}>Radio</H2>
        {/* @ts-ignore */}
        <A style={{ fontSize: '1em', color: '#4630eb' }} target="_blank" href="">Listen Now</A>
      </View>
      <Image source={require('../assets/works/siriusxm/devices.png')} style={{ flex: 1, minHeight: 460, width: '100%' }} />
    </View>
  )
}

