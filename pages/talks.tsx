import React from 'react';
import { Image, StyleSheet, Text as RNText, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';

import { H2, H4, P } from '../components/Elements';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Talks } from '../Data';

const cardDark = '#222426';
const cardLight = '#fff';
const titleDark = 'rgb(158, 231, 255)';
const titleLight = 'blue';

const Text = RNText as any;

function TalkCardPresentationRow({
  href,
  date,
  title,
  resources = [],
}: {
  href: string;
  thumbnail?: string;
  date?: string;
  title: string;
  resources?: any[];
}) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  const link = React.useRef(null);
  const { isHovered } = useHover(link);
  const titleColor = isDark ? titleDark : titleLight;

  // Intetionally inverted
  const cardColor = isDark ? cardLight : cardDark;

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
        {date && <Text style={{ color: cardColor, fontSize: 18 }}>{date}</Text>}
      </View>

      {!!resources.length && (
        <View style={{ marginLeft: 24 }}>
          <H4 style={{ opacity: 0.6 }}>RESOURCES</H4>
          {resources.map((resource: any) => (
            <TalkCardPresentationRow
              key={resource.title}
              title={resource.title}
              href={resource.href}
            />
          ))}
          <Divider />
        </View>
      )}
    </View>
  );
}

function TalkCard({ title, image, description, presentedData = [] }) {
  const { isDark } = React.useContext(CustomAppearanceContext);
  const backgroundColor = isDark ? cardDark : cardLight;
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {image && (
        <Image style={styles.image} resizeMode="cover" source={image} />
      )}
      <View style={styles.resContainer}>
        <H2 style={{ fontSize: useREM(1.51572) }}>{title}</H2>
        <P style={{ marginBottom: useREM(1.55) }}>{description}</P>
        <Divider />

        {!!presentedData.length && (
          <>
            <H4 style={styles.presentedTitle}>PRESENTED AT</H4>
            {presentedData.map((presentation: any) => (
              <TalkCardPresentationRow
                key={presentation.title}
                title={presentation.title}
                href={presentation.href}
                date={presentation.date}
                resources={presentation.resources}
              />
            ))}
          </>
        )}
      </View>
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
  return (
    <View
      style={[
        {
          backgroundColor: isDark ? cardLight : cardDark,
        },
        styles.divider,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 720,
    flex: 1,
    marginBottom: 20,
  },
  divider: {
    opacity: 0.1,
    flex: 1,
    minHeight: StyleSheet.hairlineWidth,
    maxHeight: StyleSheet.hairlineWidth,
    marginVertical: 20,
  },
  presentedTitle: {
    opacity: 0.6,
    marginBottom: 24,
  },
  resContainer: {
    flex: 1,
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
