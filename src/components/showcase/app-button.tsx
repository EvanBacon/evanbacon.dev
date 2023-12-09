import { AppIcon } from '@/components/showcase/app-icon';
import { ExpoIcon, ReactNavigationIcon } from '@/components/showcase/icons';
import { AppItem, getFrameworks } from '@/data/getAppStoreData';
import React from 'react';

const altSafe = (name: string) => name.replace('–', '-').replace('’', "'");

export function AppButton({ app }: { app: Partial<AppItem> }) {
  const iconSize = 24;
  const frameworks = getFrameworks(app);
  return (
    <a
      key={app.id}
      href={app.url}
      target="_blank"
      className="gap-y-1 text-slate-50 flex flex-col"
    >
      <AppIcon iconUrl={app.iconUrl!} name={app.name!} />

      <div className="gap-y-1 flex flex-col relative">
        <div className="flex items-center mt-2">
          <div className="flex items-center mt-2 gap-2 bg-slate-600/40 backdrop-blur rounded-full p-2 px-4">
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
        <span className="line-clamp-2	text-sm text-gray-500">{app.author}</span>
      </div>
    </a>
  );
}
