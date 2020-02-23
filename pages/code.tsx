import { P } from '@expo/html-elements';
import React from 'react';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>Code</PageHeader>
      <P>I don't know how to format this page TBH...</P>
    </Layout>
  );
}
