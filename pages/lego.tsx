import { Article, Footer, H2, P } from '@expo/html-elements';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useDimensions, useREM } from 'react-native-web-hooks';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SocialIcon from '../components/SocialIcon';
import UniversalLink from '../components/UniversalLink';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Lego } from '../Data';

function ProjectCard({ title, group, color, gallery, preview }) {
  const { isDark } = React.useContext(CustomAppearanceContext);

  const socials = [
    gallery && {
      icon: 'photo',
      name: 'Photos',
      url: gallery,
    },
  ].filter(Boolean);

  const themeColor = color || (isDark ? 'black' : 'white');

  const {
    window: { width },
  } = useDimensions();
  const isSmall = width < 720;

  return (
    <Article
      style={[
        styles.container,
        {
          marginHorizontal: isSmall ? 16 : 0,
          backgroundColor: themeColor,
        },
      ]}
    >
      <ImageBackground
        source={preview}
        style={[
          {
            flex: 1,

            paddingHorizontal: 8,
            minHeight: 360,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
        ]}
        resizeMode="cover"
      >
        <Footer
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <BlurView
            tint="dark"
            intensity={100}
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View>
              {title && (
                <H2
                  style={{
                    color: 'white',
                    marginVertical: 0,
                    fontSize: useREM(1.51572),
                    lineHeight: useREM(1.51572),
                  }}
                >
                  {title}
                </H2>
              )}
              {group && (
                <P
                  style={{
                    marginTop: 4,
                    marginVertical: 0,
                    color: 'white',
                    marginBottom: 0,
                  }}
                >
                  {group}
                </P>
              )}
            </View>

            {socials.map(social => (
              <UniversalLink
                focusStyle={{ transform: [{ scale: 1.1 }] }}
                target="_blank"
                key={social.name}
                routeName={social.url}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: 'white',
                  }}
                >
                  <SocialIcon name={social.icon} color="black" size={16} />
                  <P
                    style={{
                      marginLeft: 6,
                      fontSize: useREM(1),
                      marginTop: 0,
                      marginBottom: 0,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {social.name.toUpperCase()}
                  </P>
                </View>
              </UniversalLink>
            ))}
          </BlurView>
        </Footer>
      </ImageBackground>
    </Article>
  );
}

export default function ({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <PageHeader>Lego</PageHeader>
      {Lego.map((project: any) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 720,
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    shadowColor: 'black',
    shadowRadius: 8,
    shadowOpacity: 0.5,
    shadowOffset: { height: 4, width: 0 },
    marginBottom: 36,
  },
});
