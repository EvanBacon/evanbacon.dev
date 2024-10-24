import { MDXComponents, MDXStyles } from '@bacons/mdx';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
// import {
//   TerminalSquareIcon,
//   FileCode01Icon,
//   LayoutAlt01Icon,
// } from '@expo/styleguide-icons';
import ExpoRouterSvg from '@/svg/expo-router.svg';
import { loadAsync, useFont } from './useFont';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { BlockQuote } from '@expo/html-elements';
import { Title } from '@/components/PostTitle';
import LegoSvg from '@/svg/lego.svg';
import ExpoSvg from '@/svg/expo.svg';
import SiriusXM from '@/svg/sirus-xm.svg';
import ReactNavigation from '@/svg/react-navigation.svg';
import { Link } from 'expo-router';

import { Prism, Highlight, themes } from 'prism-react-renderer';
import cn from 'classnames';
import { resolveAssetUri } from '@/utils/resolveMetroAsset';
import Quote from './Quote';

(typeof global !== 'undefined' ? global : window).Prism = Prism;

require('prismjs/components/prism-shell-session');
require('prismjs/components/prism-json');
require('prismjs/components/prism-json5');
require('prismjs/components/prism-css-extras.min');

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

// From `@expo/styleguide-icons` but without 5.5mb of JS.
function TerminalSquareIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      {...props}
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
  );
}
function FileCode01Icon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      {...props}
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
  );
}

function LayoutAlt01Icon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      {...props}
    >
      <g id="layout-alt-01">
        <path
          id="Icon"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 9H21M9 9L9 21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z"
        ></path>
      </g>
    </svg>
  );
}

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

function Kbd({ children }) {
  const keys = children.split('');
  return (
    <>
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <kbd
            className="px-1  min-w-5 bg-[#10141A] border border-b-2 rounded border-[#3a3f42]"
            style={{
              boxShadow: '0 0.1rem 0 1px #3a3f42',
            }}
          >
            {key}
          </kbd>
          {i < keys.length - 1 ? ' + ' : null}
        </React.Fragment>
      ))}
    </>
  );
}

function getIconForFile(filename: string) {
  if (/_layout\.[jt]sx?$/.test(filename)) {
    return LayoutAlt01Icon;
  }
  return FileCode01Icon;
}

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

  const FileIcon = isTerminal ? TerminalSquareIcon : getIconForFile(title);

  return (
    <div className={cn('rounded-2xl transition-shadow hover:shadow-xl mt-0')}>
      <div
        data-lang={lang}
        className={cn('rounded-2xl overflow-hidden', 'bg-[#191A20]')}
        style={{
          boxShadow: 'inset 0 0 0 1px #ffffff1a',
        }}
      >
        {title && (
          <span className="flex p-3 gap-2 border-b border-b-[#ffffff1a]">
            <FileIcon className="w-4 text-slate-50" />

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
                'p-4 overflow-auto padding-r-4 m-[1px] mt-0 rounded-b-2xl grid',
                isTerminal && 'bg-black'
              )}
            >
              {tokens.map((line, i) => {
                const isComment =
                  isTerminal &&
                  line.find(
                    line =>
                      line.content === '#' &&
                      line.types.includes('shell-symbol')
                  );
                const isCommand = isTerminal && !isComment;
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
        display: 'block',
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
        display: 'block',
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
        borderRadius: '1rem',
        marginBottom: '1.25em',
        minHeight: 180,
        maxHeight: 480,
      }}
      a={styles.a}
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
        components={{
          Title,
          Kbd,
        }}
        code={BaconCode}
        pre={({ style, children }) => {
          return <pre style={style} children={children} className="mb-5" />;
        }}
        em={({
          firstChild,
          firstOfType,
          prevSibling,
          lastChild,
          parentName,
          ...props
        }) => <em {...props} />}
        p={({ style, children, ...props }) => {
          // NOTE(EvanBacon): Unclear why, but mdxjs is wrapping an image in a paragraph tag.
          const image = React.Children.toArray(children).find(child => {
            return (
              typeof child === 'object' && 'props' in child && child.props.src
            );
          });
          if (image) {
            return <>{children}</>;
          }

          return <Text style={style} children={children} />;
        }}
        br={() => <br />}
        strong={({ style, children }) => {
          const localStyles = { fontWeight: 'bold' };
          const brand = getAnchorBrand(children);
          // Special branding for bold text containing "Pillar Valley".
          if (children.toString().match(/pillar valley/i)) {
            localStyles.color = '#F09458';
          }
          if (brand) {
            localStyles.color = '#fff';
            const Logo = BRAND_TO_LOGO[brand];
            return (
              <div className="p-1 inline bg-[#10141A] border rounded border-[#232731]">
                <Logo className="inline w-5 h-5 mt-[-3px]" fill="white" />{' '}
                <Text children={children} style={[style, localStyles]} />
              </div>
              // <div className="px-1 inline-flex items-center gap-1 min-w-5 bg-[#10141A] border rounded border-[#232731]">
              //   <ExpoRouterSvg className="inline w-5 h-5" fill="white" />
              //   <Text children={children} style={[style, localStyles]} />
              // </div>
            );
          }
          return <Text children={children} style={[style, localStyles]} />;
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
        }) => {
          const parsedChildren = React.Children.toArray(children);
          const isQuote =
            parsedChildren[0]?.props?.children?.[0] === '[!QUOTE]';

          if (isQuote) {
            const nextChildren = parsedChildren[0].props.children.slice(1);
            let quote = nextChildren[0] as string;
            const possibleAuthor = quote?.match(/~(?:\s+)?(.*)/m)?.[1]?.trim();

            if (possibleAuthor) {
              quote = quote.replace(/~(?:\s+)?(.*)/m, '').trim();
            }
            return <Quote quote={quote} author={possibleAuthor} />;
          }

          return (
            <BlockQuote {...props} style={[style]}>
              {children}
            </BlockQuote>
          );
        }}
        a={({ href, children, style, className, ...props }) => {
          const brand =
            children?.props?.parentName === 'html.a' &&
            getAnchorBrand(children.props.children);

          return (
            <Link
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              style={[style, !brand && styles.standardLink]}
              className={className}
              children={children}
            />
          );
        }}
        img={Img}
        li={({
          firstChild,
          lastChild,
          parentName,
          prevSibling,
          firstOfType,
          style,
          ...props
        }) => (
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                userSelect: 'none',
                display: 'block',
                marginTop: 12,
                marginRight: 8,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#f2f5f7',
              }}
            />
            <Text {...props} style={[style, { display: 'block' }]} />
          </li>
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

function Img({ src, style }) {
  const source = typeof src === 'string' ? { uri: src } : src;
  const srcUrl = resolveAssetUri(source);

  if (srcUrl.match(/\.mp4$/)) {
    return (
      <video
        src={srcUrl}
        style={style}
        controls={false}
        autoPlay
        loop
        playsInline
        className="h-auto max-w-full overflow-clip object-contain"
      />
    );
  }
  return (
    <img
      src={srcUrl}
      style={style}
      className="h-auto max-w-full overflow-clip object-contain"
    />
  );
}

const styles = StyleSheet.create({
  a: {
    fontSize: 'unset',
    fontFamily: 'Inter_400Regular',
    color: '#f2f5f7',
  },
  standardLink: {
    textDecorationLine: 'underline',
  },
});

function getAnchorBrand(text: string) {
  if (text.toString().match(/^expo[-\s]?router$/i)) {
    return 'expo-router';
  }
  if (text.toString().match(/^sirius[-\s]?xm$/i)) {
    return 'sirusxm';
  }
  if (text.toString().match(/^lego$/i)) {
    return 'lego';
  }
  if (text.toString().match(/^(react-navigation|react navigation)$/i)) {
    return 'react-navigation';
  }
  if (text.toString().match(/^(expo|expo sdk)$/i)) {
    return 'expo';
  }
  return null;
}

const BRAND_TO_LOGO = {
  'expo-router': ExpoRouterSvg,
  'react-navigation': ReactNavigation,
  sirusxm: SiriusXM,
  expo: ExpoSvg,
  lego: LegoSvg,
};
