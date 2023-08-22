import ProjectCard from '@/components/card/Card';
import PageHeader from '@/components/PageHeader';
import { Project } from '@/Data';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const Podcasts: Project[] = [
  {
    title: "Evan's World",
    image: require('assets/podcast/evans-world.jpg'),
    year: '2020',
    color: '#F8E71C',
    authors: ['lydiahallie', 'baconbrix'],
    actions: [
      {
        url: 'https://podcasts.apple.com/us/podcast/evans-world/id1502259756',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'React Podcast',
    image: require('assets/podcast/react-podcast.jpg'),
    year: '2020',
    color: '#FFE000',
    authors: ['chantastic'],
    actions: [
      {
        url:
          'https://www.stitcher.com/podcast/react-training/the-react-podcast/e/67313854',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'Undefined Podcast',
    image: require('assets/podcast/undefined-podcast.jpg'),
    year: '2019',
    color: '#539EF9',
    authors: ['jaredpalmer', 'ken_wheeler'],
    actions: [
      {
        url:
          'https://undefined.fm/radio/react-native-web-with-expos-evan-bacon',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'React Native Radio',
    image: require('assets/podcast/react-native-radio-podcast.jpg'),
    year: '2018',
    color: '#F5A623',
    authors: ['dabit3', 'spencer_carli', 'peterpme'],
    actions: [
      {
        url:
          'https://devchat.tv/react-native-radio/react-native-at-expo-feat-evan-bacon/',
        icon: 'microphone',
      },
    ],
  },
  {
    title: 'Beyond the brick with Evan Bacon',
    image: require('assets/podcast/behind-the-brick.jpg'),
    year: '2012',
    color: '#FFC100',
    authors: ['John_Hanlon', 'BeyondtheBrick'],
    actions: [
      {
        url:
          'https://modernlife.network/interview-with-lego-builder-evan-bacon/',
        icon: 'microphone',
      },
    ],
  },
];

export default function Media() {
  return (
    <>
      <PageHeader>Podcasts</PageHeader>
      {Podcasts.map(({ authors, ...project }) => (
        <ProjectCard
          key={project.title}
          {...project}
          renderDescription={() => (
            <View style={styles.aWrapper}>
              {authors.map((author, index) => (
                <Link
                  key={author}
                  href={`https://twitter.com/${author}`}
                  style={styles.a}
                >
                  {`@${author}${index !== authors.length - 1 ? ' | ' : ''}`}
                </Link>
              ))}
            </View>
          )}
        />
      ))}
    </>
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
