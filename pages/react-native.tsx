import React from 'react';
import { StyleSheet } from 'react-native';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>React Native Explained</PageHeader>
    </Layout>
  );
}

const styles = StyleSheet.create({
  aWrapper: { flexDirection: 'row' },
  a: {
    marginVertical: 0,
    color: 'white',
    marginBottom: 4,
  },
});
