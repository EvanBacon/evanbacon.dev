import { H3 } from '@expo/html-elements';
import Head from 'next/head';
import React from 'react';
import { Text, View } from 'react-native';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const QA = [
    {
        q: 'How old were you when you started making Lego art?',
        a: `I built my first Lego sculpture, a life-sized Lego Batman, when I was 13 years old. As far as I know, I was the youngest artist building life-sized Lego sculptures.`
    },
    {
        q: `What do you do for fun?`,
        a: `Play Enter the Gungeon, hang out with my siblings Collin, Ams, and Kiki, code side-projects with the Avocoder, and make fake FAQs like this one to test random web features like structured JSON SEO.`
    },
    {
        q: `What's your dream job?`,
        a: 'Making it easier for creative-types like myself to create things -- this is my goal with Expo, and why I work on a wide variety of things.'
    },
    {
        q: `Do you have any pets?`,
        a: 'My kitten Gucci Mane',
    },
    {
        q: 'When did you start making mobile apps?',
        a: `My interest in app development started when I was 17 years old. I wanted to make iPhone apps to help people create Lego sculptures (Rubrick).`
    },
    {
        q: `How did you join Expo?`,
        a: `I was a design technologist at Frog Design (youngest ever), and I got to experiment with lots of different ways to make apps and websites. Expo was <b>by far</b> the best way to make an app. A few months of using Expo was all it took for me to quit my job and work on Expo full time!`
    },
    {
        q: `What things do you work on at Expo?`,
        a: `I maintain Expo CLI, Expo for Web, Expo Config Plugins and prebuilding, Create React Native App (v3+), Jest Expo, and the bundlers. I also work on the Expo SDK; mainly Auth Session, and Crypto.`
    },
    {
        q: 'Do you still make Lego art?',
        a: `I've retired from Lego art to focus on making open source software. I will return to Lego art someday, and it'll be awesome.`
    },
    {
        q: `Where did you go to school?`,
        a: `I've never been to school in my entire life. I'm fully home-schooled, all the way through high-school, which is not uncommon in Texas. I decided that college was not the right fit for me, and went right into working as a self-taught Software Engineer.`
    },
    {
        q: `How do you stay motivated to write code?`,
        a: `By constantly challenging myself with new and exciting ideas! I also surround myself with talented individuals, like coworkers, or friends that I met online who share similar interests.`
    },
    {
        q: `How did you learn how to code?`,
        a: `I had tons of ideas for things I wanted to make, and I would just Google tutorials until I knew how to make those things. Eventually I filled in many of the basic gaps in my knowledge, but I still have lots to learn!`
    },
]

export default function FAQ({ navigation }) {
    return (
        <>
            <Head>
                <title>Evan Bacon - Frequently Asked Questions (FAQ)</title>

            </Head>
            <Layout navigation={navigation}>
                <PageHeader>Frequently Asked Questions</PageHeader>
                {
                    QA.map(({ q, a }, i) => <FAQItem key={String(i)} question={q} children={a} />)
                }

            </Layout>
        </>
    );
}




function FAQItem({ question, children }: { question: string, children: any }) {
    const { isDark } = React.useContext(CustomAppearanceContext);
    const text = isDark ? 'white' : 'black'
    // @ts-ignore
    return (
        <IView itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            {/* @ts-ignore */}
            <H3 itemProp="name" style={{ color: text }}>{question}</H3>
            <IView itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                {/* @ts-ignore */}
                <Text itemProp="text" style={{ color: text }}>
                    {children}
                </Text>
            </IView>
        </IView>
    )
}

const IView = View as any;