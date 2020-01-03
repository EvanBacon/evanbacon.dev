import { Link } from 'expo-next-react-navigation';
import React from 'react';
import { Linking, Text } from 'react-native';


export default function UniversalLink({ routeName, ...props }) {

    
    // Handle External links
    if (routeName.startsWith('http://') || routeName.startsWith('https://')) {
    function onPress() {
        Linking.openURL(routeName);
    }
    return (<Text {...props} href={routeName} accessibilityRole="link" onPress={onPress} />)
  }

  return <Link routeName={routeName} {...props}/>
}
