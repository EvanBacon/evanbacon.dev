import PageHeader from '@/components/PageHeader';
import Colors from '@/constants/Colors';
import { Talks } from '@/Data';
import { Article, H2, H4, HR, P } from '@expo/html-elements';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useREM } from 'react-native-web-hooks';

const cardDark = '#222426';
const cardLight = '#fff';
const titleDark = 'rgb(158, 231, 255)';
const titleLight = 'blue';

function TalkCardPresentationRow({
  href,
  isLast,
  date,
  upcoming,
  title,
  resources = [],
}: {
  href: string;
  isLast: boolean;
  thumbnail?: string;
  date?: string;
  upcoming?: boolean;
  title: string;
  resources?: any[];
}) {
  const isDark = false;

  const link = React.useRef(null);
  const titleColor = isDark ? titleDark : titleLight;

  // inverted
  const textSyle = isDark ? { color: cardLight } : { color: cardDark };
  return (
    <View>
      <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
        <Link
          ref={link}
          target="_blank"
          href={href}
          hoverStyle={{
            borderBottomColor: titleColor,
          }}
          style={[
            styles.presTitle,
            {
              color: titleColor,
              borderBottomColor: 'transparent',
            },
          ]}
        >
          {title}
        </Link>
        {date && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={[{ fontSize: 18 }, textSyle]}>{date}</Text>
            {upcoming && (
              <Text
                style={{
                  padding: 4,
                  marginTop: -4,
                  marginLeft: 8,
                  borderRadius: 4,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginBottom: 8,
                  backgroundColor: Colors.tabIconSelected,
                  color: 'white',
                }}
              >
                Upcoming!
              </Text>
            )}
          </View>
        )}
      </View>

      {!!resources.length && (
        <View style={{ marginLeft: 24 }}>
          <H4 style={[{ opacity: 0.6 }, textSyle]}>RESOURCES</H4>
          {resources.map((resource: any, index: number) => (
            <TalkCardPresentationRow
              key={resource.title}
              isLast={index === resources.length - 1}
              title={resource.title}
              href={resource.href}
            />
          ))}
          {!isLast && <Divider />}
        </View>
      )}
    </View>
  );
}

function TalkCard({ title, image, description, presentedData = [] }) {
  const isDark = false;
  const backgroundColor = isDark ? cardDark : cardLight;
  const textColor = isDark ? 'white' : 'black';
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {image && (
        <Image
          testID="talk-img"
          style={{
            flex: 1,
            minHeight: 360,

            width: '100%',
          }}
          resizeMode="cover"
          source={image}
        />
      )}
      <Article style={styles.resContainer}>
        <H2
          style={{
            color: textColor,
            marginBottom: 0,
            fontSize: useREM(1.51572),
          }}
        >
          {title}
        </H2>
        <P style={{ color: textColor, marginBottom: 0 }}>{description}</P>
        <Divider />

        {!!presentedData.length && (
          <>
            <H4 style={[styles.presentedTitle, { color: textColor }]}>
              PRESENTED AT
            </H4>
            {presentedData.map((presentation: any, index: number) => (
              <TalkCardPresentationRow
                isLast={index === presentedData.length - 1}
                key={presentation.title}
                title={presentation.title}
                upcoming={presentation.upcoming}
                href={presentation.href}
                date={presentation.date}
                resources={presentation.resources}
              />
            ))}
          </>
        )}
      </Article>
    </View>
  );
}

export default function TalksScreen() {
  return (
    <>
      <PageHeader>Talks</PageHeader>
      {Talks.map((talk: any) => (
        <TalkCard key={talk.title} {...talk} />
      ))}
    </>
  );
}

function Divider() {
  const isDark = false;
  return <HR style={[{ opacity: isDark ? 0.4 : 0.8 }, styles.divider]} />;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  divider: {
    maxHeight: 0,
    marginHorizontal: 0,
    marginVertical: 20,
  },
  presentedTitle: {
    opacity: 0.6,
    marginBottom: 24,
    marginTop: 0,
  },
  resContainer: {
    flex: 1,
    paddingTop: 0,
    padding: 40,
  },
  image: {
    flex: 1,
    minHeight: 360,
  },
  presTitle: {
    color: 'blue',
    marginBottom: 10,
    fontSize: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
});
