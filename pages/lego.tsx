import React from 'react';

import ProjectCard from '../components/card/Card';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { Lego } from '../Data';

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>Lego</PageHeader>
      {Lego.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </Layout>
  );
}
