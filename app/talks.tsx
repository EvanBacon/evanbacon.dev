import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { useREM } from 'react-native-web-hooks';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Colors from '../constants/Colors';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Talks } from '../Data';

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
  const { isDark } = React.useContext(CustomAppearanceContext);

  const link = React.useRef(null);
  const titleColor = isDark ? titleDark : titleLight;

  // inverted
  const textSyle = isDark ? { color: cardLight } : { color: cardDark };
  return (
    <div>
      <div style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
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
          <div style={{ flexDirection: 'row' }}>
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
          </div>
        )}
      </div>

      {!!resources.length && (
        <div style={{ marginLeft: 24 }}>
          <h4 style={[{ opacity: 0.6 }, textSyle]}>RESOURCES</h4>
          {resources.map((resource: any, index: number) => (
            <TalkCardPresentationRow
              key={resource.title}
              isLast={index === resources.length - 1}
              title={resource.title}
              href={resource.href}
            />
          ))}
          {!isLast && <Divider />}
        </div>
      )}
    </div>
  );
}

function TalkCard({ title, image, description, presentedData = [] }) {
  const { isDark } = React.useContext(CustomAppearanceContext);
  const backgroundColor = isDark ? cardDark : cardLight;
  const textColor = isDark ? 'white' : 'black';
  return (
    <div style={[styles.container, { backgroundColor }]}>
      {image && (
        <Image
          testID="talk-img"
          style={{
            flex: 1,
            minHeight: 360,
            maxWidth: 720,
            width: '100%',
          }}
          resizeMode="cover"
          source={image}
        />
      )}
      <article style={[styles.resContainer]}>
        <h2
          style={{
            color: textColor,
            marginBottom: 0,
            fontSize: useREM(1.51572),
          }}
        >
          {title}
        </h2>
        <p style={{ color: textColor, marginBottom: 0 }}>{description}</p>
        <Divider />

        {!!presentedData.length && (
          <>
            <h4 style={[styles.presentedTitle, { color: textColor }]}>
              PRESENTED AT
            </h4>
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
      </article>
    </div>
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
  return <hr style={[{ opacity: isDark ? 0.4 : 0.8 }, styles.divider]} />;
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 720,
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
    maxWidth: 720,
  },
  presTitle: {
    color: 'blue',
    marginBottom: 10,
    fontSize: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
});
