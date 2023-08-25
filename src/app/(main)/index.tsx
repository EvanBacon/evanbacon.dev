import Intro from '@/components/front/intro.mdx';
import { MarkdownTheme } from '@/components/MarkdownTheme';

export default function App() {
  return (
    <>
      <div className="mt-8 space-y-6">
        <MarkdownTheme>
          <Intro />
        </MarkdownTheme>
      </div>
    </>
  );
}
