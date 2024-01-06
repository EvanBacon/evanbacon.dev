import { AppItem } from '@/data/getAppStoreData';
import React from 'react';
import { FlatList } from 'react-native';

import { AppButton } from './app-button';

const Row = ({ apps }: { apps: AppItem[] }) => {
  return (
    <FlatList
      horizontal
      style={{ minWidth: '100%' } as any}
      initialNumToRender={12}
      contentContainerStyle={{
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
