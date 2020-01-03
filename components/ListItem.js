import React from 'react';
import { createElement, StyleSheet, Text } from 'react-native';
import { material } from 'react-native-typography';
import { useREM } from 'react-native-web-hooks';

import useDarkMode from '../hooks/useDarkMode';


const ListItem: any = React.forwardRef((props, ref) => createElement('li', { ...props, ref }));

export default ListItem;

export const UnorderedList: any = React.forwardRef((props, ref) => createElement('ul', { ...props, ref }));

const Header = (level) => (props) => <Text aria-level={`${level}`} accessibilityRole="header" {...props} />
const Header2 = Header(2);

const getTextStyle = (name) => {
  const isDark = useDarkMode()
  return material[`${name}${isDark ? 'White' : ''}`]
}
export const H2 = ({style, ...props}) => {
  return <Header2 style={[getTextStyle('display2'), styles.header, style]} {...props}/>
}

// font-weight: bold;
// margin-bottom: 24px;
// font-size: 2.25rem;


// export const H2 = ({ style, ...props }) => <Text style={[styles.h2, { fontSize: useREM(2.25) }, style]} accessibilityRole="header" {...props} />
export const H4 = ({ style, ...props }) => <Text style={[styles.h4, getTextStyle('title'), style]} accessibilityRole="header" {...props} />
export const P = ({ style, ...props }) => {
  return <Text style={[styles.paragraph, getTextStyle('body1'), style]} {...props} />
}
export const B = ({ style, ...props }) => <Text style={[styles.paragraph, getTextStyle('body1'), {fontWeight: 'bold'}, style]} {...props} />



const styles = StyleSheet.create({
    header: {
      fontWeight: 'bold',
      marginBottom: 24,
    },
    h2: {

    },
    h4: {
      marginVertical: 10
    },
    li: {
      fontSize: 16
    },
    paragraph: {
      fontSize: 16,
      marginBottom: 24,
    }
  })
  