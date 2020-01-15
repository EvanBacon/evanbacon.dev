import React from 'react';
import { ImageBackground, View } from 'react-native';
import { useREM } from 'react-native-web-hooks';

import { H2, P } from '../components/Elements';
import SEO from '../components/SEO';
import SocialIcon from '../components/SocialIcon';
import UniversalLink from '../components/UniversalLink';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Lego } from '../Data';

function ProjectCard({
  title,
  icon,
  color,
  gallery,
  preview,
  url,
  source,
  thumbnail,
  description,
  presentedData = [],
  resourcesData = [],
}) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  const socials = [
    gallery && {
      icon: 'photo',
      name: 'Photo Gallery',
      url: gallery,
    },
  ].filter(Boolean);

  const themeColor = color || (isDark ? 'black' : 'white');
  return (
    <View
      style={{
        maxWidth: 720,
        flex: 1,
        marginBottom: 20,
        backgroundColor: themeColor,
      }}
    >
      <ImageBackground
        source={preview}
        style={[
          {
            flex: 1,
            paddingHorizontal: 8,
            minHeight: 256,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        resizeMode="cover"
      />
      <View style={{ flex: 1, padding: 40 }}>
        {title && (
          <H2
            style={{
              textAlign: 'center',
              marginBottom: 0,
              fontSize: useREM(1.51572),
            }}
          >
            {title}
          </H2>
        )}
        {description && <P>{description}</P>}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: useREM(2.2),
          }}
        >
          {socials.map(social => (
            <UniversalLink
              style={{ marginRight: 8 }}
              target="_blank"
              key={social.name}
              routeName={social.url}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <SocialIcon
                  name={social.icon}
                  color={isDark ? 'white' : 'black'}
                  size={16 * 2.2}
                />
                <P style={{ marginTop: useREM(1.55) }}>{social.name}</P>
              </View>
            </UniversalLink>
          ))}
        </View>
      </View>
    </View>
  );
}

const IndexPage = () => {
  return (
    <>
      <SEO title="Lego" />
      <H2>Lego</H2>
      {Lego.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </>
  );
};

export default IndexPage;
