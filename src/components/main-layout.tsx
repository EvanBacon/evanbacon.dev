import CustomFooter from '@/components/Footer';
import { Icon } from '@/components/top-nav/icon';
import { makeIcon, TabBarIcon } from '@/components/top-nav/tab-bar-icon';
import {
  TabbedNavigator,
  useTabScrollToTop,
} from '@/components/top-nav/tab-slot';
import { useIsFullScreenRoute } from '@/components/useIsFullScreenRoute';
import classNames from 'classnames';
import { Link } from 'expo-router';
import React from 'react';

function HeaderLogo() {
  return (
    <TabbedNavigator.Link
      scrollToTop
      className="group focus:outline-none"
      name="index"
      href="/"
    >
      <div className="flex pt-5 pb-8 items-start h-[96px] max-h-[96px]">
        <div className="flex items-center p-3 my-1 rounded transition-colors group-hover:bg-white/10 group-focus:bg-white/10 group-focus:outline-none">
          <Icon
            width={undefined}
            height={undefined}
            className="hidden xl:block h-12"
            name="logo"
            fill={Colors.dark}
          />
          <Icon
            width={undefined}
            height={undefined}
            className="block xl:hidden w-10"
            name="logo-small"
            fill={Colors.dark}
          />
        </div>
      </div>
    </TabbedNavigator.Link>
  );
}

function SideBar() {
  return (
    <div className="w-mdrail xl:w-[244px] mr-safe">
      <div className="xl:w-[244px] fixed h-full items-stretch flex min-w-20 pt-2 px-3 pb-5 bg-black border-r border-r-[#30363d]">
        <div className="items-stretch flex pl-safe xl:items-start">
          <div className="z-[3] flex flex-1 flex-col h-full justify-between items-center xl:items-stretch">
            <HeaderLogo />

            <div className="gap-3 flex flex-1 flex-col">
              <SideBarTabItem
                name="index"
                icon={makeIcon('home')}
                popup="Home"
                scrollToTop
              >
                Home
              </SideBarTabItem>
              <SideBarTabItem
                name="blog/index"
                icon={makeIcon('blog')}
                popup="Blog"
              >
                Blog
              </SideBarTabItem>
              <SideBarTabItem
                name="games"
                icon={makeIcon('games')}
                popup="Games"
                scrollToTop
              >
                Games
              </SideBarTabItem>
            </div>

            <div>
              <SideBarTabItem
                name="https://x.com/baconbrix"
                icon={makeIcon('twitter')}
              >
                Follow
              </SideBarTabItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useIsTabSelected(name: string): boolean {
  const { navigation } = TabbedNavigator.useContext();

  const state = navigation.getState();
  const current = state.routes.find((route, i) => state.index === i);

  return current?.name === name;
}

function TabBarItem({
  children,
  name,
  id,
  popup = name.replace(/\/index$/, ''),
  className,
  scrollToTop,
}: {
  children?: any;
  name: string;
  id: string;
  popup?: string;
  className?: string;
  scrollToTop?: boolean;
}) {
  const focused = useIsTabSelected(id);

  if (name.match(/^([./]|https?:\/\/)/)) {
    return (
      <Link href={name} target="_blank" className={className}>
        {children({ focused })}
      </Link>
    );
  }

  return (
    <TabbedNavigator.Link
      scrollToTop={scrollToTop}
      name={id}
      className={className}
    >
      {children({ focused })}
    </TabbedNavigator.Link>
  );
}

function SideBarTabItem({
  children,
  icon,
  name,
  popup,
  scrollToTop,
}: {
  children: string;
  icon: (props: { focused?: boolean; color: string }) => JSX.Element;
  name: string;
  popup?: string;
  scrollToTop?: boolean;
}) {
  return (
    <TabBarItem
      name={name}
      id={name}
      scrollToTop={scrollToTop}
      accessibilityHasPopup="menu"
      className="group w-full py-1 focus:outline-none"
      popup={popup}
    >
      {({ focused }) => (
        <div className="flex p-3 flex-row items-center rounded-full transition-colors group-hover:bg-white/10 group-focus:bg-white/10 group-focus:outline-none">
          <div
            className="flex transition-transform duration-150 group-hover:scale-110 group-focus:scale-110"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.17, 0.17, 0, 1)',
            }}
          >
            {icon({
              focused,
              width: 30,
              height: 30,
              color: '#fff',
            })}
          </div>

          <span
            className={classNames(
              'text-white text-lg mx-4 hidden xl:flex',
              focused ? 'font-bold' : 'font-medium'
            )}
          >
            {children}
          </span>
        </div>
      )}
    </TabBarItem>
  );
}

export default function ResponsiveNavigator() {
  const isFullScreen = useIsFullScreenRoute();
  return (
    <TabbedNavigator screenOptions={{}}>
      <div className="flex flex-1 flex-col md:flex-row pr-safe pt-safe max-w-full">
        <div className="hidden md:flex">
          <SideBar />
        </div>

        <AppHeader />

        <div
          className={classNames(
            'flex flex-1 flex-col pt-4 mt-14 md:mt-0 md:pt-8 gap-4 overflow-x-hidden',

            isFullScreen
              ? 'px-0 mx-0 max-w-full'
              : 'container mx-auto px-4 md:px-6 lg:px-0 max-w-3xl'
          )}
        >
          <InnerSlot />
          <CustomFooter />
        </div>

        <TabBar />
      </div>
    </TabbedNavigator>
  );
}

function InnerSlot() {
  useTabScrollToTop();

  return <TabbedNavigator.Slot />;
}

function AppHeader() {
  return (
    <div className="flex md:hidden">
      <div className="pt-safe min-h-14 flex flex-1 z-10 bg-[#10141a2e] backdrop-blur-lg fixed top-0 left-0 right-0 px-6 flex-row items-stretch justify-between border-b border-b-[#30363d]">
        <Icon
          name="logo"
          width={undefined}
          height={undefined}
          className="w-36"
          fill={Colors.dark}
        />

        <Link
          className={
            'transition-transform mr-[-8px] my-2 rounded-full aspect-square hover:scale-110 hover:bg-white/10 active:scale-90 active:opacity-80'
          }
          style={[
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
          href="https://x.com/baconbrix"
          target="_blank"
        >
          <Icon
            width={undefined}
            height={undefined}
            className="w-8"
            name="twitter"
            fill={Colors.dark}
          />
        </Link>
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className="flex md:hidden">
      <div className="h-12 pb-safe" />

      <div className="fixed bottom-0 left-0 right-0 flex flex-1 flex-row border-t border-t-[#30363d] bg-black justify-around items-stretch min-h-12 px-4 pb-safe">
        {[
          { name: 'index', id: 'index', icon: 'home', scrollToTop: true },
          { name: 'blog/index', id: 'blog/index', icon: 'blog' },
          { name: 'games', id: 'games', icon: 'games', scrollToTop: true },
          // { name: 'https://x.com/baconbrix', id: 'twitter', icon: 'twitter' },
        ].map((tab, i) => (
          <TabBarItem
            className="group flex items-center focus:outline-none"
            key={i}
            name={tab.name}
            id={tab.id}
            scrollToTop={tab.scrollToTop}
          >
            {({ focused }) => (
              <TabBarIcon
                width={undefined}
                height={undefined}
                style={{ width: '2.8rem', height: '2.8rem' }}
                className="flex-1 px-2 transition-transform hover:scale-110 active:scale-90 active:opacity-80"
                color="white"
                name={tab.icon}
                focused={focused}
              />
            )}
          </TabBarItem>
        ))}
      </div>
    </div>
  );
}

const Colors = {
  lightGray: '#30363d',
  dark: 'white',
};
