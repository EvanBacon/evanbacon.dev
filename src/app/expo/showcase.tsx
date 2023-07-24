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

const A = 'a';
const B = 'b';
const H1 = 'h1';
const Span = 'span';
const Div = 'div';
const P = 'p';
const H2 = 'h2';
const H3 = 'h3';
const Img = 'img';
const BR = 'br';

export default function Showcase() {
  const apps = useMemo(() => {
    return Object.entries(getAppStoreData())
      .sort((a, b) => {
        // Sort by length of data array
        return b[1].length - a[1].length;
      })

      .map(category => {
        // If an app's bundle ID is in the FAVORITES array, ensure it shows in the ranked category
        category[1].forEach(app => {
          if (app.rank === -1 && FAVORITES.includes(app.bundleId)) {
            // Doesn't need to be at the top, usually this is for displaying the brand,
            // however if the app wasn't ranked then it may not be the most refined.
            app.rank = 1000;
          }
        });

        // Split the data into two arrays, one with ranked apps and one with unranked apps
        const ranked = category[1].filter(app => app.rank !== -1);
        const unranked = category[1].filter(app => app.rank === -1);

        // Sort the ranked apps by rank
        return [
          category[0],
          [
            ranked.sort((a, b) => a.rank - b.rank).sort(sortByFramework),
            unranked.sort(sortByFramework),
          ],
        ] as const;
      });
  }, []);

  return (
    <>
      <Div className="relative flex flex-col">
        <Div className="mx-auto">
          <Div className="px-4 py-4">
            <H1 className="text-4xl md:text-5xl lg:text-6xl font-bold my-4">
              Expo Open Source Showcase
            </H1>
            <H3 className="text-2xl mb-2">
              Top ranked iOS Apps using <B>Expo Open Source software</B>
              .
              <BR />
              This includes the{' '}
              <ExpoIcon
                className="inline"
                style={{
                  marginTop: -3,
                }}
                width={'1.5rem'}
              />{' '}
              <A className="underline" href="https://expo.dev" target="_blank">
                Expo SDK
              </A>{' '}
              and{' '}
              <ReactNavigationIcon
                className="inline"
                style={{
                  marginTop: -3,
                }}
                width={'1.5rem'}
                stroke="black"
              />{' '}
              <A
                className="underline"
                href="https://reactnavigation.org/"
                target="_blank"
              >
                React Navigation.
              </A>
            </H3>
          </Div>
          {apps.map(([category, apps]) => (
            <Div key={category} className="flex flex-col gap-y-1">
              <Div className="flex flex-row px-4 gap-y-1 mb-4  items-center">
                <Div className="flex flex-row items-center">
                  <Img
                    src={'/categories/' + category + '.png'}
                    className="pr-2 w-10"
                  />
                  <H2 className="font-bold text-2xl md:text-3xl lg:text-4xl">
                    {ITUNES_GENRE_TO_CATEGORY[category] ?? category}
                  </H2>
                </Div>
                <Span className="flex-1 border-b border-default mx-2 md:mx-3 min-w-[2rem]" />

                <P className="text-gray-500">
                  {apps.map(apps => apps).flat().length} Apps
                </P>
              </Div>
              <Row
                title={ITUNES_GENRE_TO_CATEGORY[category] ?? category}
                apps={apps.flat()}
              />
            </Div>
          ))}
        </Div>
      </Div>
    </>
  );
}
