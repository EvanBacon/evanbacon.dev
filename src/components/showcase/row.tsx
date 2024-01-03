import { AppItem } from '@/data/getAppStoreData';
import React from 'react';
import { FlatList } from 'react-native';

import { AppButton } from './app-button';

const Row = ({ title, apps }: { title: string; apps: AppItem[] }) => {
  return (
    <FlatList
      horizontal
      style={{ width: '100vw', overflowY: 'visible' } as any}
      initialNumToRender={12}
      contentContainerStyle={{
        overflowY: 'visible',
        paddingHorizontal: 24,
        gap: 12,
        paddingBottom: 12,
      }}
      showsHorizontalScrollIndicator={false}
      data={apps}
      renderItem={({ item, index }) => (
        <div key={index} className="w-[8rem] md:w-[12rem] aspect-square">
          <AppButton app={item} />
        </div>
      )}
    />
  );
};

export default Row;
