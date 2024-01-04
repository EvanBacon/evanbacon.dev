import data from '@/expo-oss-showcase-data.json';

export type AppItem = {
  name: string;
  absoluteRating: number;
  url: string;
  iconUrl: string;
  matches: string[];
  checkedAt?: string;
  // id: string;
  // author: string;
  // bundleId: string;
  // rank: number;
  // rating: number;
  // releaseDate: string;
  // bannerUrl?: string;
};

export type CategoryItem = {
  category: string;
  data: AppItem[];
};

// NOTE(EvanBacon): Expo Router static rendering struggles with unicode characters
const altSafe = (name: string) => name.replace('–', '-').replace('’', "'");

export function getAppStoreData(): Record<string, AppItem[]> {
  return data;
}

function uniqeBy<T>(arr: T[], key: keyof T) {
  return arr.filter((v, i, a) => a.findIndex(t => t[key] === v[key]) === i);
}

export function getFrameworks(app: Partial<AppItem>) {
  return {
    expoSdk: app.matches.find(p => p.match(/(expo*|EXConstants|EXUpdates)/gi)),
    reactNavigation: app.matches.find(p => p.includes('react-navigation')),
  };
}
