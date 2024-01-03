import {
  FAVORITES,
  ITUNES_GENRE_TO_CATEGORY,
} from '@/data/app-store-categories';
import React, { useMemo } from 'react';
import {
  AppItem,
  getAppStoreData,
  getFrameworks,
} from '@/data/getAppStoreData';
import Row from '@/components/showcase/row';
import { ExpoIcon, ReactNavigationIcon } from '@/components/showcase/icons';

function sortByFramework(a: AppItem, b: AppItem) {
  const frameworksA = getFrameworks(a);
  const frameworksB = getFrameworks(b);

  // Sort so Expo SDK apps are first
  if (frameworksA.expoSdk && !frameworksB.expoSdk) {
    return -1;
  }
  if (!frameworksA.expoSdk && frameworksB.expoSdk) {
    return 1;
  }
  return 0;
}

const preferredOrder = [
  'food',
  'finance',
  'sports',
  'shopping',
  'business',
  'entertainment',
  'news',
].reverse();

function uniqueBy<T, K extends keyof T>(array: T[], key: K) {
  const seen = new Set<T[K]>();
  return array.filter(item => {
    if (seen.has(item[key])) {
      return false;
    }
    seen.add(item[key]);
    return true;
  });
}

function getAppData() {
  return Object.entries(getAppStoreData())
    .sort((a, b) => {
      // Sort by length of data array
      return b[1].length - a[1].length;
    })
    .filter(([category, apps]) => {
      // Filter out categories with less than 5 apps
      return category !== 'top' && category !== 'kids';
    })
    .sort((a, b) => {
      // Sort by preferred order
      return preferredOrder.indexOf(b[0]) - preferredOrder.indexOf(a[0]);
    })
    .map(category => {
      // If an app's bundle ID is in the FAVORITES array, ensure it shows in the ranked category
      // category[1].forEach(app => {
      //   if (app.rank === -1 && FAVORITES.includes(app.bundleId)) {
      //     // Doesn't need to be at the top, usually this is for displaying the brand,
      //     // however if the app wasn't ranked then it may not be the most refined.
      //     app.rank = 1000;
      //   }
      // });

      // // Split the data into two arrays, one with ranked apps and one with unranked apps
      // const ranked = category[1].filter(app => app.rank !== -1);
      // const unranked = category[1].filter(app => app.rank === -1);

      // Sort the ranked apps by rank
      return [
        category[0],
        category[1].sort((a, b) => b.absoluteRating - a.absoluteRating),
        // [
        //   [],
        //   // ranked.sort((a, b) => a.rank - b.rank).sort(sortByFramework),
        //   // unranked.sort(sortByFramework),
        // ],
      ] as const;
    });
}

export default function Showcase() {
  const apps = getAppData();

  const totalApps = useMemo(() => {
    const count = uniqueBy(
      apps.map(([category, apps]) => apps).flat(),
      'bundleId'
    ).length;

    return new Intl.NumberFormat('en-US').format(count);
  }, [apps]);

  return (
    <>
      <div className="relative flex flex-col">
        <div className="mx-auto">
          <div className="p-8">
            <h1 className="text-4xl text-slate-50 md:text-5xl lg:text-6xl my-2 md:my-4 font-bold">
              Expo Open Source Study
            </h1>
            <h3 className="text-xl text-slate-50 md:text-2xl mb-2">
              A list of {totalApps} iOS Apps using{' '}
              <b>Expo Open Source software</b> that appeared in the trending
              charts for free iOS apps in the US App Store.
              <br />
              This includes the{' '}
              <ExpoIcon
                fill="white"
                className="inline "
                style={{
                  marginTop: -3,
                }}
                width={'1.5rem'}
              />{' '}
              <a className="underline" href="https://expo.dev" target="_blank">
                Expo SDK
              </a>{' '}
              and{' '}
              <ReactNavigationIcon
                className="inline "
                fill="white"
                style={{
                  marginTop: -3,
                }}
                width={'1.5rem'}
              />{' '}
              <a
                className="underline"
                href="https://reactnavigation.org/"
                target="_blank"
              >
                React Navigation.
              </a>
            </h3>
          </div>
          <ShowcaseData apps={apps} />
        </div>
      </div>
    </>
  );
}

export function TotalApps({
  apps = getAppData(),
}: {
  apps?: (readonly [string, AppItem[]])[];
}) {
  const totalApps = useMemo(() => {
    const count = uniqueBy(
      apps.map(([category, apps]) => apps).flat(),
      'bundleId'
    ).length;

    return new Intl.NumberFormat('en-US').format(count);
  }, [apps]);

  return <span>{totalApps}</span>;
}

export function ShowcaseData({
  apps = getAppData(),
}: {
  apps?: (readonly [string, AppItem[]])[];
}) {
  return (
    <>
      {apps.map(([category, apps]) => (
        <div key={category} className="flex flex-col gap-y-1">
          <div className="flex flex-row px-8 gap-y-1 mb-4 items-center">
            <div className="flex flex-row items-center">
              <h2 className="font-bold text-slate-50 text-2xl md:text-3xl lg:text-4xl">
                {ITUNES_GENRE_TO_CATEGORY[category] ?? category}
              </h2>
              {category !== 'top' && (
                <img
                  src={'/categories/' + category + '.avif'}
                  className="pl-2 w-8"
                />
              )}
            </div>
            <span className="flex-1 border-b border-dotted border-slate-800 mx-2 md:mx-3 min-w-[2rem]" />

            <p className="text-gray-500">{apps.length} Apps</p>
          </div>
          <Row
            title={ITUNES_GENRE_TO_CATEGORY[category] ?? category}
            apps={apps}
          />
        </div>
      ))}
    </>
  );
}
