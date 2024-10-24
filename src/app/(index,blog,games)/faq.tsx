import About from '@/components/about.mdx';
import { QA } from '@/components/faq-info';
import { MarkdownTheme } from '@/components/MarkdownTheme';
import PageHeader from '@/components/PageHeader';
import classNames from 'classnames';
import Head from 'expo-router/head';

export default function FAQ() {
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
    <>
      <Head>
        <title>Evan Bacon - Frequently Asked Questions (FAQ)</title>
        <script type="application/ld+json" id="faq">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <PageHeader>Frequently Asked Questions</PageHeader>

      <div className={classNames('mt-8 space-y-6')}>
        <ul className="divide-y divide-slate-800/50">
          {QA.map(({ q, a }, i) => (
            <LineItem key={String(i)} question={q} answer={a} />
          ))}
        </ul>
        <br />
        <div>
          <MarkdownTheme>
            <About />
          </MarkdownTheme>
        </div>
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

        <span className="opacity-60 flex">{answer}</span>
      </span>
    </div>
  );
}
