import ProjectCard from '@/components/card/Card';
import PageHeader from '@/components/PageHeader';
import { Podcasts } from '@/Data';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
