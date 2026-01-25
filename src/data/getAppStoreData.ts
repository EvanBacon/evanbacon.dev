export type AppItem = {
  name: string;
  id: string;
  absoluteRating: number;
  url: string;
  iconUrl: string;
  matches: string[];
  checkedAt?: string;
  // id: string;
  // author: string;
  bundleId: string;
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
  try {
    return require('@/expo-oss-showcase-data.json');
  } catch {
    // Public environments...
    return {};
  }
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
