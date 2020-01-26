import React from 'react';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>Brand</PageHeader>
    </Layout>
  );
}
