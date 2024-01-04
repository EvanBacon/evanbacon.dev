import { AppIcon } from '@/components/showcase/app-icon';
import { ExpoIcon, ReactNavigationIcon } from '@/components/showcase/icons';
import { AppItem, getFrameworks } from '@/data/getAppStoreData';
import React from 'react';

const altSafe = (name: string) => name.replace('–', '-').replace('’', "'");

export function AppButton({ app }: { app: Partial<AppItem> }) {
  const iconSize = 24;
  const frameworks = getFrameworks(app);

  const checkedAt = React.useMemo(() => {
    if (!app.checkedAt) {
      return null;
    }

    const date = new Date(app.checkedAt);

    // Only include the year if it's not the current year
    if (date.getFullYear() === new Date().getFullYear()) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  }, [app.checkedAt]);

  const matches = React.useMemo(() => {
    if (!app.matches) {
      return null;
    }

    return `Matched: ${app.matches.join(', ')}`;
  }, [app.matches]);

  return (
    <a
      key={app.id}
      href={app.url}
      target="_blank"
      className="gap-y-1 text-slate-50 flex flex-col"
    >
      <AppIcon iconUrl={app.iconUrl!} name={app.name!} />

      <div className="gap-y-1 flex flex-col relative" title={matches}>
        <div className="flex items-center">
          <div className="flex items-center mt-2 gap-2 bg-slate-600/40 backdrop-blur rounded-full p-2 px-4 select-none">
            {frameworks.expoSdk && (
              <ExpoIcon
                fill="white"
                style={{ width: iconSize, height: iconSize }}
              />
            )}
            {frameworks.reactNavigation && (
              <ReactNavigationIcon
                fill="white"
                style={{ width: iconSize, height: iconSize }}
              />
            )}
          </div>
        </div>
        <h3 className="line-clamp-2	font-normal text-lg">{altSafe(app.name)}</h3>
        {/* <span className="line-clamp-2	text-sm text-gray-500">{app.author}</span> */}
        {checkedAt && (
          <span
            className="line-clamp-2	text-sm text-gray-500"
            title={'Last checked: ' + checkedAt}
          >
            {checkedAt}
          </span>
        )}
      </div>
    </a>
  );
}
