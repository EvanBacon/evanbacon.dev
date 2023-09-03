// import type * as React from "react";
// import type * as CSS from "csstype";
// export type { CSS, React };
import 'csstype';
import 'react';

declare module 'csstype' {
  import * as CSS from 'csstype';
  interface Properties extends CSS.Properties {
    /** `@expo/html-elements` */
    marginHorizontal?: string | number;
    /** `@expo/html-elements` */
    marginVertical?: string | number;
    /** `@expo/html-elements` */
    paddingVertical?: string | number;
    /** `@expo/html-elements` */
    paddingHorizontal?: string | number;
  }
}

declare module 'react' {
  import * as React from 'react';

  interface CSSProperties extends React.CSSProperties {
    /** `@expo/html-elements` */
    marginHorizontal?: string | number;
    /** `@expo/html-elements` */
    marginVertical?: string | number;
    /** `@expo/html-elements` */
    paddingVertical?: string | number;
    /** `@expo/html-elements` */
    paddingHorizontal?: TextStyle['marginHorizontal'];
  }

  interface HTMLAttributes<T> extends Omit<React.HTMLAttributes<T>, 'style'> {
    /** `@expo/html-elements` */
    //   interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    style?: StyleProp<React.CSSProperties>;
  }
}

import { TextStyle } from '@bacons/react-views';
import { StyleProp } from 'react-native';

declare module '*.mdx' {
  function Component(props: any): JSX.Element;
  export default Component;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
