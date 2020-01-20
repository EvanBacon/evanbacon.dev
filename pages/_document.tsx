import { getInitialProps } from '@expo/next-adapter/document';
import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

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
    const { isProduction } = this.props;

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
