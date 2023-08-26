import React from 'react';

import ProjectCard from '@/components/card/Card';
import PageHeader from '@/components/PageHeader';
import { Projects } from '@/Data';

export default function Games() {
  return (
    <>
      <PageHeader>Games</PageHeader>
      <br />
      {Projects.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </>
  );
}
