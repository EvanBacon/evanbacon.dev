import { AppIcon } from '@/components/showcase/app-icon';
import { ExpoIcon, ReactNavigationIcon } from '@/components/showcase/icons';
import { AppItem, getFrameworks } from '@/data/getAppStoreData';
import React from 'react';

const Div = 'div';
const A = 'a';
const H3 = 'h3';
const Span = 'span';
const altSafe = (name: string) => name.replace('–', '-').replace('’', "'");

export function AppButton({ app }: { app: Partial<AppItem> }) {
  const iconSize = 24;
  const frameworks = getFrameworks(app);
  return (
    <A
      key={app.id}
      href={app.url}
      target="_blank"
      className="gap-y-1 flex flex-col"
    >
      <AppIcon iconUrl={app.iconUrl!} name={app.name!} />

      <Div className="gap-y-1 flex flex-col relative">
        <Div className="flex items-center mt-2">
          <Div className="flex items-center mt-2 gap-2 bg-black/20 backdrop-blur rounded-full p-2 px-4">
            {frameworks.expoSdk && (
              <ExpoIcon
                fill="white"
                style={{ width: iconSize, height: iconSize }}
              />
            )}
            {frameworks.reactNavigation && (
              <ReactNavigationIcon
                stroke="white"
                style={{ width: iconSize, height: iconSize }}
              />
            )}
          </Div>
        </Div>
        <H3 className="font-normal text-lg">{altSafe(app.name)}</H3>
        <Div className="flex items-center">
          <Span className="text-sm text-gray-500">{app.author}</Span>
        </Div>
      </Div>
    </A>
  );
}
