import ProjectCard from '@/components/card/Card';
import PageHeader from '@/components/PageHeader';
import { Lego } from '@/Data';

export default function LegoPage() {
  return (
    <>
      <PageHeader>Lego</PageHeader>
      {Lego.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </>
  );
}
