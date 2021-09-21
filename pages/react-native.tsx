import React from 'react';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function ReactNative({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>React Native Explained</PageHeader>
    </Layout>
  );
}
