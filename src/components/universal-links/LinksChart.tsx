import { AppIcon } from '@/components/showcase/app-icon';
import { ITUNES_GENRE_TO_CATEGORY_SHORT } from '@/data/app-store-categories';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import PageHeader, { GlitchText } from '../PageHeader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  },
});

type UniversalLinkCategory = {
  yes: string[];
  no: string[];
  category: string;
  ratio: number;
  total: number;
  yesApps: {
    bundleId: string;
    icon: string;
    name: string;
    rating: number;
    url: string;
  }[];
};

type DataRes = { date: string; data: UniversalLinkCategory[] };

function useFetchedServerData(endpoint: string) {
  return useQuery<DataRes>({
    queryKey: [endpoint],
    queryFn: async () => {
      return fetch(endpoint).then(response => response.json());
    },
  });
}

function FetchedProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default function UniversalLinksVisualized({
  endpoint,
}: {
  endpoint: string;
}) {
  return (
    <FetchedProvider>
      <UniversalLinksVisualizedInner endpoint={endpoint} />
    </FetchedProvider>
  );
}

function UniversalLinksVisualizedInner({ endpoint }: { endpoint: string }) {
  const { data, isFetching } = useFetchedServerData(endpoint);

  if (isFetching || !data) {
    const msg = isFetching ? 'Loading...' : 'No data...';
    return <LoadingState>{msg}</LoadingState>;
  }

  return <UniversalLinksVisualizedInner2 data={data} />;
}

function LoadingState({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-[30vh] flex flex-1 items-center justify-center">
      <h1 className="text-2xl text-slate-400">{children}</h1>
    </div>
  );
}

const voterData = {
  date: '2023-11-25T00:33:30.274Z',
  data: [
    { category: 'developer', ratio: 0.9766 },
    { category: 'finance', ratio: 0.9663 },
    { category: 'sports', ratio: 0.9534 },
    { category: 'music', ratio: 0.9504 },
    { category: 'navigation', ratio: 0.9502 },
    { category: 'photo', ratio: 0.9386 },
    { category: 'shopping', ratio: 0.9377 },
    { category: 'weather', ratio: 0.928 },
    { category: 'news', ratio: 0.9263 },
    { category: 'social', ratio: 0.9236 },
    { category: 'lifestyle', ratio: 0.8946 },
    { category: 'books', ratio: 0.8871 },
    { category: 'entertainment', ratio: 0.883 },
    { category: 'health', ratio: 0.8636 },
    { category: 'reference', ratio: 0.8515 },
    { category: 'travel', ratio: 0.8063 },
    { category: 'utilities', ratio: 0.7738 },
    { category: 'magazines', ratio: 0.7391 },
    { category: 'education', ratio: 0.7061 },
    { category: 'food', ratio: 0.7049 },
    { category: 'graphics', ratio: 0.6595 },
    { category: 'productivity', ratio: 0.6291 },
    { category: 'medical', ratio: 0.6265 },
    { category: 'business', ratio: 0.6173 },
    { category: 'Games', ratio: 0.6155 },
  ],
};

const voterDataIap = {
  date: '2023-11-25T07:34:14.889Z',
  data: [
    { category: 'reference', ratio: 0.9627 },
    { category: 'magazines', ratio: 0.9469 },
    { category: 'utilities', ratio: 0.8877 },
    { category: 'entertainment', ratio: 0.799 },
    { category: 'news', ratio: 0.7098 },
    { category: 'graphics', ratio: 0.6799 },
    { category: 'medical', ratio: 0.6418 },
    { category: 'travel', ratio: 0.6344 },
    { category: 'food', ratio: 0.6011 },
    { category: 'social', ratio: 0.5674 },
    { category: 'finance', ratio: 0.4696 },
    { category: 'productivity', ratio: 0.4689 },
    { category: 'lifestyle', ratio: 0.4687 },
    { category: 'shopping', ratio: 0.4643 },
    { category: 'health', ratio: 0.4602 },
    { category: 'navigation', ratio: 0.4049 },
    { category: 'sports', ratio: 0.3881 },
    { category: 'music', ratio: 0.3834 },
    { category: 'business', ratio: 0.3668 },
    { category: 'photo', ratio: 0.214 },
    { category: 'education', ratio: 0.1373 },
    { category: 'books', ratio: 0.0748 },
    { category: 'developer', ratio: 0 },
    { category: 'weather', ratio: 0 },
    { category: 'Games', ratio: 0 },
  ],
};

export function VoterGraph({ iap }: { iap?: boolean }) {
  const [show, setShow] = React.useState(false);
  const inputData = iap ? voterDataIap : voterData;
  const data = inputData.data as { category: string; ratio: number }[];
  return (
    <div className="gap-4 flex flex-col">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        {data.map(({ category, ratio }, index) => {
          const adjustedRatio = Math.ceil(100 * ratio);
          const visible = show || index < 4;
          return (
            <div
              key={category}
              className={classNames(
                'flex flex-col transition-all',
                visible ? 'visible' : 'hidden'
              )}
            >
              <div className="flex flex-row mb-4 items-center">
                <div className="flex flex-row items-center">
                  <h2 className="font-bold text-slate-50 text-xl">
                    {ITUNES_GENRE_TO_CATEGORY_SHORT[category] ?? category}
                  </h2>
                </div>
              </div>
              <RatioLine ratio={adjustedRatio} />
            </div>
          );
        })}
      </div>
      <p
        onClick={() => setShow(!show)}
        className="text-gray-200 text-xl underline"
      >
        {show ? 'Collapse' : `Show all ${data.length} categories`}
      </p>

      <ul className="text-slate-500">
        <li>
          Each app's rating is calculated as the <i>total ratings</i> ×{' '}
          <i>average user rating (1-5)</i> to get the total adjusted rating.
        </li>
        <li>Last updated: {new Date(inputData.date).toLocaleDateString()}</li>
      </ul>
      <br />
    </div>
  );
}

function RatioLine({ ratio }) {
  // A voter-style bar chart with one side colored and the other side gray and a divider in the middle
  // The divider is the ratio
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex-1">
        <div className="flex relative w-full h-4 bg-gray-800 overflow-hidden rounded-md group bg-gradient-to-r from-red-300 to-red-600">
          <div
            className="flex bg-gradient-to-r from-blue-600 to-blue-300"
            style={{
              width: `${ratio}%`,
            }}
          />
          {/* Vertical Divider in the mid-point */}
          <div className="absolute top-0 left-[50%] bottom-0 bg-slate-50 w-1" />
        </div>
      </div>
    </div>
  );
}

function UniversalLinksVisualizedInner2({ data }: { data: DataRes }) {
  const [show, setShow] = React.useState(false);

  const sorted = useMemo(() => {
    return data.data.sort((a, b) => {
      return b.ratio - a.ratio;
    });
  }, [data.data]);

  return (
    <div className="gap-4 flex flex-col">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        {sorted.map(({ category, yesApps, ratio, total }, index) => {
          const adjustedRatio = Math.ceil(100 * ratio);
          const visible = show || index < 4;
          return (
            <div
              key={category}
              className={classNames(
                'flex flex-col transition-all',
                visible ? 'visible' : 'hidden'
              )}
            >
              <div className="flex flex-row mb-4 items-center">
                <div className="flex flex-row items-center">
                  <h2 className="font-bold text-slate-50 text-xl md:text-2xl">
                    {index + 1}
                    {'. '}
                    {ITUNES_GENRE_TO_CATEGORY_SHORT[category] ?? category}
                  </h2>
                  {/* {!['top', 'Games', undefined].includes(category) && (
                    <img
                      src={'/categories/' + category + '.avif'}
                      className="pl-2 w-8"
                    />
                  )} */}
                </div>
                <span className="flex-1 border-b border-dotted border-slate-800 mx-2 md:mx-3 min-w-[2rem]" />
                <GlitchText
                  className="text-gray-200 text-xl"
                  children={`${adjustedRatio}%`}
                />
              </div>
              <BarChartLine ratio={adjustedRatio} apps={yesApps} />
            </div>
          );
        })}
      </div>
      <p
        onClick={() => setShow(!show)}
        className="text-gray-200 text-xl underline"
      >
        {show ? 'Collapse' : `Show all ${data.data.length} categories`}
      </p>

      <ul className="text-slate-500">
        <li>Based on the top 100 apps in each category.</li>
        <li>Last updated: {new Date(data.date).toLocaleDateString()}</li>
      </ul>
      <br />
    </div>
  );
}

// Animates in from left to right and has a percentage that animates up
function BarChartLine({ ratio, apps }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    });
  }, []);
  return (
    <div className="flex flex-row items-center gap-2">
      {/* <div className=" h-12 aspect-square grid grid-cols-2 gap-2">
        {apps.slice(0, 4).map(({ bundleId, icon, name }) => (
          <AppIcon key={bundleId} iconUrl={icon} name={name} />
        ))}
      </div> */}

      <div className="flex-1">
        <div className="relative w-full h-12 bg-gray-800 overflow-hidden rounded-md group">
          {ratio > 0 && (
            <div
              className="flex  absolute top-0 left-0 h-full"
              style={{
                width: `${ratio}%`,
              }}
            >
              <div
                className={classNames(
                  'flex flex-1 bg-gradient-to-r p-1 from-blue-600 to-blue-300 transition-all duration-500',
                  show ? `max-w-full` : 'max-w-0'
                )}
              >
                {apps.slice(0, 3).map(({ bundleId, icon, name }, index) => (
                  <div
                    key={bundleId}
                    className={classNames(
                      'aspect-square h-full p-1 transition-all canhover:grayscale group-hover:translate-x-0 group-hover:grayscale-0',
                      transitions[index]
                    )}
                  >
                    <AppIcon iconUrl={icon} name={name} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const transitions = [
  'canhover:translate-x-[0]',
  'canhover:translate-x-[-1.5rem]',
  'canhover:translate-x-[-3rem]',
  'canhover:translate-x-[-5rem] hidden canhover:block',
];
