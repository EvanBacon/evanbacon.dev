import { getInitialProps } from '@expo/next-adapter/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class CustomDocument extends Document {
  static getInitialProps = async props => {
    const isProduction = process.env.NODE_ENV === 'production';
    const result = await getInitialProps(props);

    console.log(props)
    if (props.pathname === '/faq') {
      result.htmlProps = {
        itemScope: true,
        itemType: "https://schema.org/FAQPage"
      }
    }

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
    const { isProduction } = this.props;
    return (
      <Html>

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
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32.png"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4630eb" />

          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-640x1136.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-1242x2688.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-828x1792.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-1125x2436.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-1242x2208.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-750x1334.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-2048x2732.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-1668x2388.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-1668x2224.png"
          ></link>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/pwa/apple-touch-startup-image/apple-touch-startup-image-1536x2048.png"
          ></link>

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/pwa/apple-touch-icon/apple-touch-icon-180.png"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
