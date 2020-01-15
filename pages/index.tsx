import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { useHover, useREM } from 'react-native-web-hooks';

import AspectImage from '../components/AspectImage';
import { H2, H4, P } from '../components/Elements';
import SEO from '../components/SEO';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Talks } from '../Data';

const Text = RNText as any;
function TalkCardPresentationRow({
  href,
  thumbnail,
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

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          ref={link}
          target="_blank"
          accessibilityRole="link"
          href={href}
          style={[
            {
              color: 'blue',
              marginBottom: 10,
              fontSize: 18,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: 'transparent',
            },
            isHovered && { borderBottomColor: 'blue' },
          ]}
        >
          {title}
        </Text>
        {date && (
          <Text style={{ color: isDark ? '#ffffff' : '#222426', fontSize: 18 }}>
            {date}
          </Text>
        )}
      </View>
      {thumbnail && (
        <>
          <H2 style={{ fontSize: useREM(1.51572) }}>Watch Now</H2>

          <AspectImage
            loading="lazy"
            source={{ uri: thumbnail }}
            style={{
              aspectRatio: 0.75,
              width: 100,
            }}
          />
          <Divider />
        </>
      )}

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

function Divider() {
  const { isDark } = React.useContext(CustomAppearanceContext);
  return (
    <View
      style={{
        backgroundColor: isDark ? 'white' : 'black',
        opacity: 0.1,
        flex: 1,
        minHeight: StyleSheet.hairlineWidth,
        maxHeight: StyleSheet.hairlineWidth,
        marginVertical: 20,
      }}
    />
  );
}

function TalkCard({
  title,
  thumbnail,
  description,
  presentedData = [],
  resourcesData = [],
}) {
  const { isDark } = React.useContext(CustomAppearanceContext);
  return (
    <View
      style={{
        maxWidth: 720,
        flex: 1,
        marginBottom: 20,
        padding: 40,
        paddingTop: 0,
        backgroundColor: isDark ? 'black' : 'white',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <H2 style={{ fontSize: useREM(1.51572) }}>{title}</H2>
      </View>

      <P style={{ marginBottom: useREM(1.55) }}>{description}</P>
      <Divider />
      {!!presentedData.length && (
        <H4 style={{ opacity: 0.6, marginBottom: 24 }}>PRESENTED AT</H4>
      )}

      {presentedData.map((presentation: any) => (
        <TalkCardPresentationRow
          key={presentation.title}
          title={presentation.title}
          href={presentation.href}
          date={presentation.date}
          resources={presentation.resources}
        />
      ))}
    </View>
  );
}

export default function() {
  return (
    <>
      <SEO title="Talks" />
      <H2>Talks</H2>
      {Talks.map((talk: any) => (
        <TalkCard key={talk.title} {...talk} />
      ))}
    </>
  );
}
