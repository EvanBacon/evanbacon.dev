import React from 'react';

import ProjectCard from '@/components/card/Card';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Projects } from '@/Data';

export default function Games() {
  return (
    <Layout>
      <PageHeader>Games</PageHeader>
      {Projects.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </Layout>
  );
}
