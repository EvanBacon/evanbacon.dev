import { QA } from '@/components/faq-info';
import FAQ from '@/components/faq-route';
import PageHeader from '@/components/PageHeader';
import Head from 'expo-router/head';

function FAQHead() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@name': 'Evan Bacon frequently asked questions',

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
    <Head>
      <title>Evan Bacon - Frequently Asked Questions (FAQ)</title>
      <script type="application/ld+json" id="faq">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}

export default function FAQRoute() {
  return (
    <>
      <FAQHead />

      <PageHeader>Frequently Asked Questions</PageHeader>

      <FAQ
        dom={{
          contentInsetAdjustmentBehavior: 'automatic',
          automaticallyAdjustsScrollIndicatorInsets: true,
          mediaPlaybackRequiresUserAction: false,
          allowsInlineMediaPlayback: true,
        }}
      />
    </>
  );
}
