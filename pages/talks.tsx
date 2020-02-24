import { Article, H2, H4, HR, P } from '@expo/html-elements';
import React from 'react';
import { Image, StyleSheet, Text as RNText, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Colors from '../constants/Colors';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Talks } from '../Data';

const cardDark = '#222426';
const cardLight = '#fff';
const titleDark = 'rgb(158, 231, 255)';
const titleLight = 'blue';

const Text = RNText as any;

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
  const { isDark } = React.useContext(CustomAppearanceContext);

  const link = React.useRef(null);
  const isHovered = useHover(link);
  const titleColor = isDark ? titleDark : titleLight;

  // Intetionally inverted
  const textSyle = isDark ? { color: cardLight } : { color: cardDark };
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          ref={link}
          target="_blank"
          accessibilityRole="link"
          href={href}
          style={[
            styles.presTitle,
            {
              color: titleColor,
              borderBottomColor: isHovered ? titleColor : 'transparent',
            },
          ]}
        >
          {title}
        </Text>
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
  const { isDark } = React.useContext(CustomAppearanceContext);
  const backgroundColor = isDark ? cardDark : cardLight;
  const textColor = isDark ? 'white' : 'black';
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {image && (
        <Image style={styles.image} resizeMode="cover" source={image} />
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

export default function({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>Talks</PageHeader>
      {Talks.map((talk: any) => (
        <TalkCard key={talk.title} {...talk} />
      ))}
    </Layout>
  );
}

function Divider() {
  const { isDark } = React.useContext(CustomAppearanceContext);
  return <HR style={[{ opacity: isDark ? 0.4 : 0.8 }, styles.divider]} />;
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 720,
    flex: 1,
    marginBottom: 20,
  },
  divider: {
    flex: 1,
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
