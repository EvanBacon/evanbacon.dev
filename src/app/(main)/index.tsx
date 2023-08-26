import Intro from '@/components/front/intro.mdx';
import { MarkdownTheme } from '@/components/MarkdownTheme';
import PageHeader from '@/components/PageHeader';

export default function App() {
  return (
    <>
      <PageHeader>Hello world</PageHeader>

      <div className="mt-8 space-y-6 mx-2 md:mx-0">
        <MarkdownTheme>
          <Intro />
        </MarkdownTheme>
      </div>
    </>
  );
}
