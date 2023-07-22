import data from '@/expo-oss-showcase-data.json';

export type AppItem = {
  id: string;
  author: string;
  name: string;
  bundleId: string;
  rank: number;
  rating: number;
  minimumOsVersion: string;
  releaseDate: string;
  url: string;
  iconUrl: string;
  bannerUrl?: string;
  matches: string[];
};

export type CategoryItem = {
  category: string;
  data: AppItem[];
};

// NOTE(EvanBacon): Expo Router static rendering struggles with unicode characters
const altSafe = (name: string) => name.replace('–', '-').replace('’', "'");

export function getAppStoreData(): Record<string, AppItem[]> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value.map(value => ({
        ...value,
        name: altSafe(value.name),
      })),
    ])
  );
}

export function getFrameworks(app: Partial<AppItem>) {
  return {
    expoSdk: app.matches.find(p => p.match(/(expo*|EXConstants|EXUpdates)/gi)),
    reactNavigation: app.matches.find(p => p.includes('react-navigation')),
  };
}
