'use dom';

import Intro from '@/components/front/intro.mdx';
import { MarkdownTheme } from '@/components/MarkdownTheme';
import PageHeader from '@/components/PageHeader';

import '../../global.css';
import { IS_DOM } from 'expo/dom';
import classNames from 'classnames';

export default function HomeRoute({
  paddingBottom,
}: {
  paddingBottom: number;
  dom?: import('expo/dom').DOMProps;
}) {
  return (
    <div
      className={classNames(
        'flex flex-1 flex-col gap-4 overflow-x-hidden',
        IS_DOM && 'px-2'
      )}
      style={{ paddingBottom }}
    >
      {!IS_DOM && <PageHeader>Hello world</PageHeader>}
      <div className="mt-8 space-y-6 mx-2 md:mx-0">
        <MarkdownTheme>
          <Intro />
        </MarkdownTheme>
      </div>
    </div>
  );
}
