import { getInitialProps } from '@expo/next-adapter/document';
import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { Meta } from '../Data';

const site = {
  title: 'Evan Bacon',
  author: '@baconbrix',
  description:
    'Learn more about Evan Bacon the Open Source Programmer and Master Lego Artist',
};

export function ensureSlash(inputPath: string, needsSlash: boolean): string {
  const hasSlash = inputPath.startsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(1, inputPath.length);
  } else if (!hasSlash && needsSlash) {
    return `/${inputPath}`;
  } else {
    return inputPath;
  }
}

class CustomDocument extends Document {
  static getInitialProps = async props => {
    const isProduction = process.env.NODE_ENV === 'production';
    const result = await getInitialProps(props);
    return { ...result, isProduction };
  };

  setFirebase() {
    return {
      __html: `
            // Your web app's Firebase configuration
            var firebaseConfig = {
                apiKey: "AIzaSyAEA96N271pKf2pPEnWby0mbmgEw47vUQU",
                authDomain: "bacon-portfolio.firebaseapp.com",
                databaseURL: "https://bacon-portfolio.firebaseio.com",
                projectId: "bacon-portfolio",
                storageBucket: "bacon-portfolio.appspot.com",
                messagingSenderId: "689284550329",
                appId: "1:689284550329:web:1e05b3dc3bbb2776de1568",
                measurementId: "G-L7DZMKPV1F"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
        `,
    };
  }

  render() {
    // @ts-ignore
    const { isProduction, dangerousAsPath } = this.props;
    const themeColor = '#4630eb';

    const currentPath = ensureSlash(dangerousAsPath, false) || 'talks';
    const { image = {}, title = site.title, description = site.description } =
      Meta[currentPath] || Meta.brand;

    const injectMeta = [
      {
        name: `description`,
        content: description,
      },
      // Open Graph
      {
        property: `og:description`,
        content: description,
      },
      {
        property: `og:title`,
        content: title,
      },
      {
        property: 'og:site_name',
        content: 'Evan Bacon',
      },
      {
        property: 'og:url',
        content: `https://www.evanbacon.dev/${currentPath}`,
      },
      {
        property: `og:type`,
        content: `website`,
      },
      // Image
      { property: 'og:image', content: `http://evanbacon.dev/${image.url}` },
      {
        property: 'og:image:secure_url',
        content: `https://evanbacon.dev/${image.url}`,
      },
      { property: 'og:image:type', content: image.type },
      { property: 'og:image:width', content: image.width },
      { property: 'og:image:height', content: image.height },
      { property: 'og:image:alt', content: image.description },
      // Twitter
      { name: `twitter:card`, content: `summary` },
      { name: `twitter:creator`, content: site.author },
      { name: `twitter:title`, content: title },
      { name: `twitter:description`, content: description },
      // Fix viewport by disabling scaling
      {
        key: 'viewport',
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover',
      },
    ];

    return (
      <html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          {isProduction && (
            <>
              <script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js" />
              <script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-analytics.js" />
              <script dangerouslySetInnerHTML={this.setFirebase()} />
            </>
          )}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-TileColor" content={themeColor} />
          <meta name="theme-color" content={themeColor} />
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
          />

          <title>{`${title} | ${site.title}`}</title>

          {injectMeta.map((value, index) => {
            return <meta key={`meta-${index}`} {...value} />;
          })}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default CustomDocument;
