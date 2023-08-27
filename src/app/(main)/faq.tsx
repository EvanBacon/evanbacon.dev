import PageHeader from '@/components/PageHeader';
import Head from 'expo-router/head';
import React from 'react';

const QA = [
  {
    q: 'Who is Evan Bacon?',
    a: `Bacon is a software developer and artist from Austin, Texas. He is best known for his work on Expo, the universal React framework, and his life-sized Lego sculptures.`,
  },
  {
    q: 'Is Evan Bacon related to Kevin Bacon?',
    a: `Kevin Bacon is Evan Bacon's 10th cousin 1x removed. They share a common ancestor, William Miller Bacon.`,
  },
  {
    q: `How did Evan Bacon join Expo?`,
    a: `During his time at Frog Design, Evan Bacon used Expo to develop and prototype apps for clients. In his spare time, he built video games with Expo and shared them on Twitter, eventually leading to being discovered by Charlie Cheever and the Expo team.`,
  },
  {
    q: `What does Evan Bacon work on at Expo?`,
    a: `Evan Bacon is the engineering manager of developer tools at 650 Industries (AKA Expo). He manages a team of developers who maintain Expo CLI, web support, Expo Router, Metro bundler, and other Node.js tools.`,
  },
  {
    q: `Where did Evan Bacon go to school?`,
    a: `Evan Bacon was home-schooled and never attended college. He's a self-taught software developer and artist.`,
  },
  {
    q: 'How old was Evan Bacon when he built his first Lego sculpture?',
    a: `Bacon completed his first life-sized Lego sculpture, a life-sized Lego Batman, when he was 13 years old.`,
  },
  {
    q: 'Does Evan Bacon still make Lego art?',
    a: `Evan Bacon unofficially retired from Lego art in 2015 to pursue software development full-time.`,
  },
];

export default function FAQ() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QA.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Evan Bacon - Frequently Asked Questions (FAQ)</title>
        <script type="application/ld+json" id="faq">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <PageHeader>Frequently Asked Questions</PageHeader>
      <div className="mt-8 space-y-6">
        <ul className="divide-y divide-slate-800/50">
          {QA.map(({ q, a }, i) => (
            <LineItem key={String(i)} question={q} answer={a} />
          ))}
        </ul>
      </div>
    </>
  );
}

function LineItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="text-default text-slate-50 rounded-lg flex flex-row items-center hover:bg-slate-200/5 p-4 transition-colors ease-in-out">
      <span className="inline">
        <b>
          {question}
          {'  '}
        </b>

        <span className="opacity-60 hidden md:flex">{answer}</span>
      </span>
    </div>
  );
}
