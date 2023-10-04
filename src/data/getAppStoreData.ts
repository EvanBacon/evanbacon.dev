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
  // const mapped = data.reduce((acc, app) => {
  //   if (!acc[app.category]) {
  //     acc[app.category] = [];
  //   }
  //   acc[app.category].push(app);
  //   return acc;
  // }, {}) as Record<string, AppItem[]>;

  // return Object.fromEntries(
  //   Object.entries(mapped).map(([key, value]) => [
  //     key,
  //     uniqeBy(value, 'bundleId').map(value => ({
  //       ...value,
  //       name: altSafe(value.name),
  //     })),
  //   ])
  // );

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

function uniqeBy<T>(arr: T[], key: keyof T) {
  return arr.filter((v, i, a) => a.findIndex(t => t[key] === v[key]) === i);
}

export function getFrameworks(app: Partial<AppItem>) {
  return {
    expoSdk: app.matches.find(p => p.match(/(expo*|EXConstants|EXUpdates)/gi)),
    reactNavigation: app.matches.find(p => p.includes('react-navigation')),
  };
}
