import { useLocalSearchParams } from 'expo-router';

import Article, { type ArticleId } from '@/components/lego/Article';
import Blog from '@/components/lego/Blog';
import { BLOG_CONFIGS, type BlogId } from '@/components/lego/blogConfigs';

const ARTICLE_SLUGS: Record<string, ArticleId> = {
  batman: 'batman',
  'captain-america': 'captainAmerica',
};

const BLOG_SLUGS: Record<string, BlogId> = {
  'master-chief': 'masterChief',
};

export default function LegoSlug() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const articleId = slug ? ARTICLE_SLUGS[slug] : undefined;
  if (articleId) {
    return (
      <Article
        articleId={articleId}
        backHref="/lego"
        buildHref={`/lego/${slug}/build`}
      />
    );
  }

  const blogId = slug ? BLOG_SLUGS[slug] : undefined;
  if (blogId) {
    return <Blog config={BLOG_CONFIGS[blogId]} backHref="/lego" />;
  }

  return null;
}
