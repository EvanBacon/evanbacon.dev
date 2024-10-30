'use dom';

import About from '@/components/about.mdx';
import { QA } from '@/components/faq-info';
import { MarkdownTheme } from '@/components/MarkdownTheme';
import classNames from 'classnames';

import '../../global.css';

export default function FAQ() {
  return (
    <div className={classNames('mt-8 space-y-6')}>
      <ul className="divide-y divide-slate-800/50">
        {QA.map(({ q, a }, i) => (
          <LineItem key={String(i)} question={q} answer={a} />
        ))}
      </ul>
      <br />
      <div className="px-4">
        <MarkdownTheme>
          <About />
        </MarkdownTheme>
      </div>
    </div>
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
