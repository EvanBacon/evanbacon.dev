import React from 'react';
import { Platform, View } from 'react-native';
import { Text } from './useFont';

export function Title({ children, date: dateString }) {
  // Format date
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();

  const dateFormatted = `${month} ${day}, ${year}`;
  return (
    <View style={{ gap: 8, marginBottom: '1.25em' }}>
      {Platform.OS !== 'ios' && (
        <Text
          style={{
            color: '#f2f5f7',
            fontFamily: 'Inter_900Black',
            fontSize: 32,
            marginBottom: 8,
          }}
        >
          {children}
        </Text>
      )}
      <div style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        {/* <div
          style={{
            flex: 1,
            backgroundColor: 'black',
            height: 2,
            borderRadius: 2,
            marginRight: 16,
          }}
        /> */}
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 16,

            backgroundColor: 'rgba(115, 125, 140, 0.17)',
            borderRadius: 8,
            paddingVertical: 4,
            paddingHorizontal: 8,
            color: 'white',
          }}
        >
          {dateFormatted}
        </Text>
      </div>
    </View>
  );
}
