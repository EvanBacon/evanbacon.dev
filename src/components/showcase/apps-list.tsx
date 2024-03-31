import Row from '@/components/showcase/row';
import { ITUNES_GENRE_TO_CATEGORY_SHORT } from '@/data/app-store-categories';
import { AppItem, getAppStoreData } from '@/data/getAppStoreData';
import React, { useMemo } from 'react';

const preferredOrder = [
  'top',
  'finance',
  'food',
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
    .sort((a, b) => {
      // Sort by preferred order
      return preferredOrder.indexOf(b[0]) - preferredOrder.indexOf(a[0]);
    })
    .filter(([category, apps]) => {
      // Filter out categories with no apps
      return apps.length > 1;
    })
    .map(category => {
      // Sort the ranked apps by rank
      return [
        category[0],
        category[1].sort(
          (a, b) =>
            //   b.absoluteRating - a.absoluteRating
            b.absoluteRating * b.matches.length -
            a.absoluteRating * a.matches.length
        ),
      ] as const;
    });
}

export function TotalApps({
  apps = getAppData(),
}: {
  apps?: (readonly [string, AppItem[]])[];
}) {
  const totalApps = useMemo(() => {
    const count = uniqueBy(apps.map(([category, apps]) => apps).flat(), 'id')
      .length;

    return new Intl.NumberFormat('en-US').format(count);
  }, [apps]);

  return <span>{totalApps}</span>;
}

export function ShowcaseData({
  apps = getAppData(),
}: {
  apps?: (readonly [string, AppItem[]])[];
}) {
  const newCategory = useMemo(() => {
    return apps
      .map(([, apps]) => apps)
      .flat()
      .sort((a, b) => {
        return (
          new Date(b.checkedAt!).getTime() - new Date(a.checkedAt!).getTime()
        );
      })
      .slice(0, 50)
      .sort((a, b) => {
        return b.absoluteRating - a.absoluteRating;
      });
  }, [apps]);

  const appsWithNewInjected = useMemo(() => {
    return [...apps, ['new', newCategory]] as (readonly [string, AppItem[]])[];
  }, [apps, newCategory]);

  return (
    <>
      {appsWithNewInjected.map(([category, apps]) => (
        <ShowcaseCategoryRow
          key={category}
          category={category}
          apps={apps}
          title={ITUNES_GENRE_TO_CATEGORY_SHORT[category] ?? category}
        />
      ))}
    </>
  );
}

function ShowcaseCategoryRow({
  category,
  title,
  apps,
  icon = ['top', 'new'].includes(category)
    ? ''
    : '/categories/' + category + '.avif',
}: {
  category: string;
  title: string;
  apps: AppItem[];
  icon?: string;
}) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-row px-8 gap-y-1 mb-4 items-center">
        <div className="flex flex-row items-center">
          <h2 className="font-bold text-slate-50 text-2xl md:text-3xl lg:text-4xl">
            {title}
          </h2>
          {icon && (
            <img
              src={'/categories/' + category + '.avif'}
              className="pl-2 w-8"
            />
          )}
        </div>
        <span className="flex-1 border-b border-dotted border-slate-800 mx-2 md:mx-3 min-w-[2rem]" />

        <p className="text-gray-500">{apps.length} Apps</p>
      </div>
      <Row apps={apps} />
    </div>
  );
}
