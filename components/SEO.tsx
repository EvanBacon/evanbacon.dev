import React from 'react';
import Helmet from 'react-helmet';

function SEO({ description = '', image, lang = 'en', meta = [], title }: any) {
  const site = {
    siteMetadata: {
      title: 'Evan Bacon',
      author: 'baconbrix',
      description:
        'Learn more about Evan Bacon the Open Source Programmer and Master Lego Artist',
    },
  };
  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        { name: 'og:image', content: image.url },
        { name: 'og:image:secure_url', content: image.url },
        { name: 'og:image:type', content: image.type },
        { name: 'og:image:width', content: image.width },
        { name: 'og:image:height', content: image.height },
        { name: 'og:image:alt', content: image.description },

        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: 'og:site_name',
          content: 'Evan Bacon',
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          key: 'viewport',
          name: 'viewport',
          content:
            'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover',
        },
      ].concat(meta)}
    />
  );
}

export default SEO;
