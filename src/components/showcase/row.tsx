import { AppItem } from '@/data/getAppStoreData';
import React from 'react';
import { ScrollView } from 'react-native';

import { AppButton } from './app-button';

const Div = 'div';
const Row = ({ title, apps }: { title: string; apps: AppItem[] }) => {
  return (
    <ScrollView
      horizontal
      style={{ width: '100vw', overflowY: 'visible' }}
      contentContainerStyle={{
        overflowY: 'visible',
        paddingHorizontal: 12,
        gap: 12,
        paddingBottom: 12,
      }}
      showsHorizontalScrollIndicator={false}
    >
      {apps.map((item, id) => (
        <Div key={id} className="w-[12rem]">
          <AppButton key={id} app={item} />
        </Div>
      ))}
    </ScrollView>
  );
};

export default Row;
