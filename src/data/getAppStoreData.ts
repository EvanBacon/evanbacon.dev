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

export function getAppStoreData(): Record<string, AppItem[]> {
  return data;
}

export function getFrameworks(app: Partial<AppItem>) {
  const expoMatches = app.matches.find(p =>
    p.match(/(expo*|EXConstants|EXUpdates)/gi)
  );
  return {
    expoSdk: expoMatches,
    reactNavigation: app.matches.find(p => expoMatches !== p),
  };
}
