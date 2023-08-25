import { MDXComponents, MDXStyles } from '@bacons/mdx';
import { UL } from '@bacons/mdx/build/list/List';
import React from 'react';
import { Image, View } from 'react-native';

import { loadAsync, useFont } from './useFont';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { BlockQuote } from '@expo/html-elements';

export function MarkdownTheme({ children }: { children: React.ReactNode }) {
  loadAsync({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
    Inter_900Black,
    SourceCodePro_400Regular,
  });

  return (
    <MDXStyles
      h1={{
        fontFamily: useFont('Inter_900Black'),
        fontSize: 32,
        color: '#f2f5f7',
      }}
      h2={{
        fontFamily: useFont('Inter_900Black'),
        marginTop: '0.25em',
        // marginTop: '1em',
        fontSize: '1.5em',
        marginBottom: '0.5em',
        lineHeight: '1.3333333',
        // color: '#f2f5f7',
        color: '#B695F3',
      }}
      h3={{
        fontFamily: useFont('Inter_900Black'),
        marginTop: '0.25em',
        // marginTop: '1em',
        fontSize: '1.25em',
        marginBottom: '0.5em',
        lineHeight: '1.3333333',
        // color: '#f2f5f7',
        color: '#B695F3',
      }}
      strong={{
        color: '#B695F3',
      }}
      code={{
        fontFamily: 'SourceCodePro_400Regular',
        borderRadius: 2,
        color: '#ffffff',
        backgroundColor: 'rgba(115, 125, 140, 0.17)',
        padding: 20,
        fontSize: 16,
        marginTop: 0,
      }}
      inlineCode={{
        fontFamily: 'SourceCodePro_400Regular',
        borderRadius: 2,
        fontSize: 15,
        color: '#ffffff',
        backgroundColor: 'rgba(115, 125, 140, 0.17)',
        paddingVertical: 2,
        paddingHorizontal: 4,
      }}
      p={{
        fontFamily: useFont('Inter_400Regular'),
        lineHeight: '1.75',
        fontSize: '1rem',
        marginTop: 0,
        marginBottom: '1.25em',
        color: '#f2f5f7',
      }}
      blockquote={{
        fontFamily: useFont('Inter_400Regular'),
        borderLeftWidth: 2,
        fontSize: 21,
        backgroundColor: '#182635',
        borderLeftColor: '#f2f5f7',
        padding: 23,
        paddingBottom: 8,
      }}
      ul={{
        marginBottom: '1.25em',
      }}
      ol={{
        marginBottom: '1.25em',
      }}
      img={{
        width: '100%',
        resizeMode: 'contain',
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: 180,
        maxHeight: 360,
      }}
      a={{
        fontFamily: useFont('Inter_400Regular'),
        textDecorationLine: 'underline',
        color: '#f2f5f7',
      }}
      li={{
        fontFamily: useFont('Inter_400Regular'),
        fontSize: 16,
        lineHeight: 30,
        color: '#f2f5f7',
      }}
      hr={{
        paddingBottom: 10,
        marginBottom: 14,
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 24,
      }}
    >
      <MDXComponents
        strong={({ ...props }) => <b {...props} />}
        blockquote={({ style, children, ...props }) => (
          <BlockQuote {...props} style={[style]}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'translateX(-50%) translateY(-50%)',
                padding: 4,
                borderRadius: 9999,
                backgroundColor: '#10141A',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="#f2f5f7"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21.6664 6.67319C19.8396 5.02559 17.4782 4.27661 15.0128 4.55796L15.0105 4.55823C11.0775 5.02532 7.941 8.22887 7.54886 12.1752C7.24603 15.0458 8.36328 17.8451 10.5543 19.6622C11.1657 20.1981 11.4917 20.8925 11.4917 21.6194V24.7615C11.4917 26.2694 12.7106 27.5 14.21 27.5H17.7953C19.2947 27.5 20.5136 26.2694 20.5136 24.7615V21.4243C20.5867 20.812 20.9006 20.1742 21.3775 19.7615C23.362 18.0925 24.5 15.6658 24.5 13.0966C24.5 10.6362 23.4678 8.29515 21.6664 6.67319ZM15.2667 6.69546C17.1231 6.47978 18.8863 7.04097 20.2428 8.26908C21.585 9.48256 22.3622 11.2458 22.3622 13.0883C22.3622 15.0198 21.5039 16.8532 20.0035 18.1106L19.9995 18.114C19.2208 18.7807 18.6947 19.7261 18.4748 20.6883H17.0757V16.9431C18.398 16.491 19.3431 15.219 19.3431 13.7433C19.3431 11.8804 17.8473 10.3665 16.0027 10.3665C14.1571 10.3665 12.6623 11.8897 12.6623 13.7433C12.6623 15.2273 13.608 16.4925 14.9297 16.9433V20.6966H13.5515C13.3445 19.6675 12.7874 18.7398 11.966 18.0214L11.9526 18.0078L11.9324 17.9912C10.298 16.6501 9.45341 14.5623 9.68934 12.3963L9.68988 12.3908C9.97813 9.4406 12.3251 7.04115 15.2667 6.69546ZM14.8082 13.7516C14.8082 13.0766 15.3516 12.5354 16.0027 12.5354C16.6537 12.5354 17.1971 13.0766 17.1971 13.7516C17.1971 14.4266 16.6537 14.9677 16.0027 14.9677C15.3516 14.9677 14.8082 14.4266 14.8082 13.7516ZM13.6377 24.7615V22.8573H18.3676V24.7615C18.3676 25.0833 18.1075 25.3393 17.7953 25.3393H14.21C13.8978 25.3393 13.6377 25.0833 13.6377 24.7615Z" />
              </svg>
            </div>
            {children}
          </BlockQuote>
        )}
        li={({ style, ...props }) => (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View
              style={{
                display: 'block',
                marginTop: 12,
                marginRight: 8,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#f2f5f7',
              }}
            />
            <View style={{ flex: 1, display: 'block' }}>
              <View {...props} style={[style, { display: 'block' }]} />
            </View>
          </View>
        )}
        // ul={({ style, ...props }) => (
        //   <ul {...props} style={[{ marginBottom: '1rem' }, style]} />
        // )}
        hr={({ style }) => (
          <View style={style}>
            {['', '', ''].map((v, i) => (
              <View
                key={String(i)}
                style={{
                  marginRight: i !== 2 ? 20 : 0,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: '#f2f5f7',
                }}
              />
            ))}
          </View>
        )}
      >
        {children}
      </MDXComponents>
    </MDXStyles>
  );
}

function AutoHeightImage(props) {
  const [imgSize, setImageSize] = React.useState({});
  const [imageHeight, setImageHeight] = React.useState(100);

  React.useEffect(() => {
    Image.getSize(props.source.uri, (w, h) => {
      setImageSize({ width: w, height: h });
    });
  }, [props.source]);

  const [layoutWidth, setLayoutWidth] = React.useState(0);

  React.useEffect(() => {
    if (layoutWidth === 0) return;

    const ratio = imgSize.width / imgSize.height;
    const newHeight = layoutWidth / ratio;
    if (isNaN(newHeight)) return;
    setImageHeight(newHeight);
  }, [imgSize, layoutWidth]);

  return (
    <Image
      style={[props.style, { height: imageHeight }]}
      onLayout={e => {
        if (layoutWidth === e.nativeEvent.layout.width) return;
        setLayoutWidth(e.nativeEvent.layout.width);
      }}
      source={props.source}
    />
  );
}
