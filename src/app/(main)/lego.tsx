import ProjectCard from '@/components/card/Card';
import PageHeader from '@/components/PageHeader';
import { Project } from '@/Data';

type LegoProject = Project & {
  event?: string;
  awards?: string[];
  bricks?: string;
  height?: string;
  weight?: string;
};

const Lego: LegoProject[] = [
  {
    title: 'Batman',
    description: 'DC Comics',
    image: require('assets/lego/batman.avif'),
    color: '#fde219',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/uw8kZjuFzABwMzYu6',
      },
    ],
    event: 'Brick Fiesta 2011',
    awards: [
      'Best Youth Creation',
      'Best Artistic Creation',
      `People's choice award`,
    ],
    year: '2011',
    bricks: '15,000 - 20,000',
    height: `6'2"`,
    weight: '60lb',
  },
  {
    title: 'Thor',
    description: 'Marvel',
    image: require('assets/lego/thor.avif'),
    color: '#A68950',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/rUdXMnyGkmXiZij4A',
      },
    ],
    year: '2016',
  },
  {
    title: 'Iron Man',
    description: 'Marvel',
    image: require('assets/lego/ironman.avif'),
    color: '#782E2A',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/TyfRHGfWMhCz4uRq5',
      },
    ],
    year: '2012',
  },

  {
    title: 'Superman',
    bricks: '18,000',
    description: 'DC Comics',
    color: '#4277E1',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/GiQrFAoLhVDfmumS6',
      },
    ],
    image: require('assets/lego/superman.avif'),
    year: '2012',
  },
  {
    title: 'Captain Kirk',
    description: 'Star Trek',
    color: '#DCC743',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/7zfDKW9Pf9ssiLv56',
      },
    ],
    image: require('assets/lego/captainkirk.avif'),
    year: '2013',
  },
  {
    title: 'Darth Vader',
    description: 'Star Wars',
    color: '#E43C39',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/ukFadzsRyMgA9p338',
      },
    ],
    image: require('assets/lego/darthvader.avif'),
    year: '2016',
  },
  {
    title: 'Sarge',
    description: 'Red Vs. Blue',
    color: '#C65728',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/C3dGAKruSsh1xLEi7',
      },
    ],
    image: require('assets/lego/sarge.avif'),
    year: '2016',
  },
  {
    title: 'Wonder Woman',
    description: 'DC Comics',
    color: '#316FDF',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/PjsnkENMKfZjfSTj9',
      },
    ],
    image: require('assets/lego/wonderwoman.avif'),
    year: '2015',
  },

  {
    title: 'Captain America',
    description: 'Marvel',
    color: '#70ACEC',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/ejuBH4RWnPTDUgdf6',
      },
    ],
    image: require('assets/lego/captainamerica.avif'),
    year: '2016',
  },
  {
    title: 'Minion',
    description: 'Despicable Me',
    color: '#F5F858',
    actions: [
      {
        icon: 'photo',
        url: 'https://photos.app.goo.gl/CttdaRbsHKLcq1Tq9',
      },
    ],
    image: require('assets/lego/minion.avif'),
    year: '2013',
  },
];

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
