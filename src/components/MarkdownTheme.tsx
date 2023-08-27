import { MDXComponents, MDXStyles } from '@bacons/mdx';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { loadAsync, useFont } from './useFont';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { BlockQuote } from '@expo/html-elements';

import { Prism, Highlight, themes } from 'prism-react-renderer';
import cn from 'classnames';

if (typeof window !== 'undefined') {
  (typeof global !== 'undefined' ? global : window).Prism = Prism;
  require('prismjs/components/prism-shell-session');
  require('prismjs/components/prism-json');
  require('prismjs/components/prism-json5');
  require('prismjs/components/prism-css-extras.min');
}

// src/themes/dracula.ts
const terminalTheme = {
  plain: {
    color: '#F8F8F2',
    backgroundColor: '#000000',
  },
  styles: [
    {
      types: ['comment', 'command'],
      style: {
        color: 'rgb(98, 114, 164)',
      },
    },
  ],
};

const remapLanguages: Record<string, string> = {
  'objective-c': 'objc',
  sh: 'bash',
  shell: 'shell-session',
  rb: 'ruby',
  json: 'json5',
  javascript: 'js',
  typescript: 'ts',
};

const DRACULA_COLORS = {
  purple: 'rgb(189, 147, 249)',
  blue: '#A1E7FA',
  yellow: 'rgb(241, 250, 140)',
  pink: 'rgb(255, 121, 198)',
  green: 'rgb(80, 250, 123)',
};

const draculaPlusJson = {
  ...themes.dracula,
  styles: [
    ...themes.dracula.styles,
    ...[
      {
        types: ['boolean'],
        style: {
          color: DRACULA_COLORS.purple,
        },
      },
    ].map(selectors => ({ ...selectors, languages: ['js', 'json5'] })),

    // JSON theme
    ...[
      {
        types: ['property'],
        style: {
          color: DRACULA_COLORS.blue,
        },
      },
      {
        types: ['string'],
        style: {
          color: DRACULA_COLORS.yellow,
        },
      },
      {
        types: ['boolean', 'number'],
        style: {
          color: DRACULA_COLORS.purple,
        },
      },
      {
        types: ['operator'],
        style: {
          color: DRACULA_COLORS.pink,
        },
      },
    ].map(selectors => ({ ...selectors, languages: ['json', 'json5'] })),

    // CSS theme
    ...[
      {
        types: ['property'],
        style: {
          color: DRACULA_COLORS.blue,
        },
      },
      {
        types: ['class'],
        style: {
          color: DRACULA_COLORS.green,
        },
      },
      {
        types: ['atrule'],
        style: {
          color: DRACULA_COLORS.purple,
        },
      },
      {
        types: [
          'rule',
          'keyword',
          // 'punctuation'
        ],
        style: {
          color: DRACULA_COLORS.pink,
        },
      },
    ].map(selectors => ({ ...selectors, languages: ['css', 'scss'] })),
  ],
};

function BaconCode(props: {
  children: string;
  // language-ts
  className: string;
  // "app.config.ts"
  metastring: string;
  // "html.pre"
  parentName: string;
}) {
  let lang = props.className?.slice(9).toLowerCase() ?? 'txt';
  const isTerminal = ['terminal', 'term'].includes(lang.toLowerCase());

  if (isTerminal) {
    lang = 'shell-session';
  }

  if (lang in remapLanguages) {
    lang = remapLanguages[lang];
  }

  let title = !props.metastring
    ? ''
    : props.metastring.match(/title="(.*)"/)?.[1] ?? props.metastring;

  if (isTerminal && !title) {
    title = 'Terminal';
  }

  return (
    <div className={cn('rounded-lg transition-shadow hover:shadow-xl')}>
      <div
        data-lang={lang}
        className={cn('rounded-lg overflow-hidden', 'bg-[#191A20]')}
        style={{
          boxShadow: 'inset 0 0 0 1px #ffffff1a',
        }}
      >
        {title && (
          <span className="flex p-3 gap-2 border-b border-b-[#ffffff1a]">
            {isTerminal ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 text-slate-50"
                role="img"
              >
                <g id="terminal-square">
                  <path
                    id="Icon"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                  ></path>
                </g>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 text-slate-50"
                role="img"
              >
                <g id="file-code-01">
                  <path
                    id="Icon"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M14 17.5L16.5 15L14 12.5M10 12.5L7.5 15L10 17.5M20 9.98822V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V6.8C4 5.11984 4 4.27976 4.32698 3.63803C4.6146 3.07354 5.07354 2.6146 5.63803 2.32698C6.27976 2 7.11984 2 8.8 2H12.0118C12.7455 2 13.1124 2 13.4577 2.08289C13.7638 2.15638 14.0564 2.27759 14.3249 2.44208C14.6276 2.6276 14.887 2.88703 15.4059 3.40589L18.5941 6.59411C19.113 7.11297 19.3724 7.3724 19.5579 7.67515C19.7224 7.94356 19.8436 8.2362 19.9171 8.5423C20 8.88757 20 9.25445 20 9.98822Z"
                  ></path>
                </g>
              </svg>
            )}

            <h3
              className="text-slate-50"
              style={{
                fontWeight: 'bold',
                fontFamily: useFont('Inter_400Regular'),
              }}
            >
              {title}
            </h3>
          </span>
        )}

        <Highlight
          theme={isTerminal ? terminalTheme : draculaPlusJson}
          code={props.children.trim()}
          language={lang}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={style}
              className={cn(
                'p-4 overflow-auto padding-r-4 m-[1px] mt-0 rounded-b-lg grid',
                isTerminal && 'bg-black'
              )}
            >
              {tokens.map((line, i) => {
                const isCommand = isTerminal && line.length === 1;
                const isComment = isTerminal && !isCommand;
                return (
                  <div key={i} {...getLineProps({ line })} className="inline">
                    {/* Line Number */}
                    {/* <span className="w-8 inline-block select-none opacity-50">
                  {i + 1}
                </span> */}
                    {isCommand && (
                      <span className="token output text-[#69C2CF] select-none">
                        𝝠{' '}
                      </span>
                    )}
                    {line.map((token, key) => {
                      const { className, ...props } = getTokenProps({ token });
                      return (
                        <span
                          key={key}
                          {...props}
                          className={cn(className, isComment && 'select-none')}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export function MarkdownTheme({ children }: { children: React.ReactNode }) {
  // installLanguages(Prism);

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
        fontSize: 'unset',
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
        backgroundColor: '#191A20',
        // backgroundColor: '#182635',
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
        fontSize: 'unset',
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
        code={BaconCode}
        em={({
          firstChild,
          firstOfType,
          prevSibling,
          lastChild,
          parentName,
          ...props
        }) => <em {...props} />}
        p={({
          firstChild,
          firstOfType,
          prevSibling,
          lastChild,
          parentName,
          ...props
        }) => <p {...props} />}
        br={() => <br />}
        strong={({
          firstChild,
          firstOfType,
          lastChild,
          parentName,
          prevSibling,
          ...props
        }) => {
          // Special branding for bold text containing "Pillar Valley".
          if (props.children.toString().match(/pillar valley/i)) {
            props.style = {
              ...props.style,
              color: '#F09458',
            };
          }
          return <b {...props} />;
        }}
        blockquote={({
          firstChild,
          lastChild,
          parentName,
          style,
          firstOfType,
          children,
          prevSibling,
          ...props
        }) => (
          <BlockQuote {...props} style={[style]}>
            {/* <div
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
            </div> */}
            {children}
          </BlockQuote>
        )}
        li={({
          firstChild,
          lastChild,
          parentName,
          prevSibling,
          firstOfType,
          style,
          ...props
        }) => (
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
              <Text {...props} style={[style, { display: 'block' }]} />
            </View>
          </View>
        )}
        // ul={({ style, ...props }) => (
        //   <ul {...props} style={[{ marginBottom: '1rem' }, style]} />
        // )}
        hr={({ parentName, lastChild, firstOfType, style }) => (
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
