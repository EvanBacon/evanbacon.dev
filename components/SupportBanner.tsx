import { A, B } from '@expo/html-elements';
import React from 'react';
import { View } from 'react-native';

export default function SupportBanner() {
  return (
    <View
      style={{
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <B
        style={{
          paddingVertical: 16,
          paddingHorizontal: 8,
          fontSize: 16,
          color: 'white',
          textAlign: 'center',
        }}
      >
        Black Lives Matter.{' '}
        <A
          href="https://support.eji.org/give/153413/#!/donation/checkout"
          style={{
            color: '#A3A1F7',
            textDecorationStyle: 'solid',
            textDecorationLine: 'underline',
          }}
        >
          Support the Equal Justice Initiative.
        </A>
      </B>
    </View>
  );
}
