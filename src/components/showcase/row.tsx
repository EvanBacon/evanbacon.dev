import { AppItem } from '@/data/getAppStoreData';
import React from 'react';
import { FlatList, ScrollView } from 'react-native';

import { AppButton } from './app-button';

const Div = 'div';
const Row = ({ title, apps }: { title: string; apps: AppItem[] }) => {
  return (
    <FlatList
      horizontal
      style={{ width: '100vw', overflowY: 'visible' }}
      contentContainerStyle={{
        overflowY: 'visible',
        paddingHorizontal: 12,
        gap: 12,
        paddingBottom: 12,
      }}
      showsHorizontalScrollIndicator={false}
      data={apps}
      renderItem={({ item, index }) => (
        <Div key={index} className="w-[8rem] md:w-[12rem] aspect-square">
          <AppButton app={item} />
        </Div>
      )}
    />
  );
};

export default Row;
