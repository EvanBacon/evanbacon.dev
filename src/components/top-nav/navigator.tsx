import { Icon } from '@/components/top-nav/icon';
import { makeIcon, TabBarIcon } from '@/components/top-nav/tab-bar-icon';
import { TabbedNavigator } from '@/components/top-nav/tab-slot';
import { Link } from 'expo-router';
import React from 'react';
import { Text, ViewStyle } from 'react-native';

function HeaderLogo() {
  return (
    <Link
      style={{
        $$css: true,
        _: 'group focus:outline-none',
      }}
      href="/"
    >
      <div className="py-5 items-start xl:pt-0 min-h-[96px] h-[96px] mt-3 pb-6">
        <div className="flex items-center p-3 my-1 rounded transition-colors group-hover:bg-white/10 group-focus:bg-white/10 group-focus:outline-none">
          <Icon className="hidden xl:block" name="logo" fill={Colors.dark} />
          <Icon
            className="block xl:hidden"
            name="logo-small"
            fill={Colors.dark}
          />
        </div>
      </div>
    </Link>
  );
}

function SideBar() {
  return (
    <div className="w-20 min-w-20 xl:min-w-[244px]">
      <div className="fixed h-full max-h-full items-stretch flex border-r border-r-[#30363d] min-w-20 w-20 pt-2 px-3 pb-5 xl:min-w-[244px] xl:w-[244px] xl:items-start">
        <div className="z-[3] flex flex-1 flex-col h-full justify-between items-center xl:items-stretch">
          <HeaderLogo />

          <div className="gap-1 flex flex-1 flex-col">
            <SideBarTabItem name="index" icon={makeIcon('home')}>
              Home
            </SideBarTabItem>
            <SideBarTabItem name="blog/index" icon={makeIcon('explore')}>
              Blog
            </SideBarTabItem>
            <SideBarTabItem name="games" icon={makeIcon('explore')}>
              Games
            </SideBarTabItem>
            {/* Divider */}
          </div>

          <SideBarTabItem name="/more" icon={makeIcon('more')}>
            More
          </SideBarTabItem>
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
  style,
  id,
}: {
  children?: any;
  name: string;
  style?: ViewStyle;
  id: string;
}) {
  const focused = useIsTabSelected(id);

  if (name.startsWith('/') || name.startsWith('.')) {
    return (
      <Link href={name} style={style}>
        {children({ focused })}
      </Link>
    );
  }

  return (
    <TabbedNavigator.Link name={id} style={style}>
      {children({ focused })}
    </TabbedNavigator.Link>
  );
}

function SideBarTabItem({
  children,
  icon,
  name,
}: {
  children: string;
  icon: (props: { focused?: boolean; color: string }) => JSX.Element;
  name: string;
}) {
  return (
    <TabBarItem
      name={name}
      id={name}
      accessibilityHasPopup="menu"
      style={[
        {
          $$css: true,
          __: 'group w-full py-1 focus:outline-none',
        },
      ]}
    >
      {({ focused, hovered }) => (
        <div
          className="flex p-3 flex-row items-center rounded-full transition-colors group-hover:bg-white/10 group-focus:bg-white/10 group-focus:outline-none"
          // style={[
          //   {
          //     padding: 12,
          //     flexDirection: 'row',
          //     alignItems: 'center',
          //     borderRadius: 999,
          //     transitionProperty: ['background-color', 'box-shadow'],
          //     transitionDuration: '200ms',
          //   },
          //   hovered && {
          //     backgroundColor: 'rgba(0, 0, 0, 0.1)',
          //   },
          // ]}
        >
          <div
            className="flex transition-transform duration-150 group-hover:scale-110 group-focus:scale-110"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.17, 0.17, 0, 1)',
            }}
          >
            {icon({
              focused,
              color: '#000',
            })}
          </div>

          <Text
            style={[
              {
                $$css: true,
                _: 'text-white text-base mx-4 hidden xl:flex',
              },
              // // {
              // //   color: 'white',
              // //   fontSize: 16,
              // //   marginLeft: 16,
              // //   marginRight: 16,
              // //   lineHeight: 24,
              // // },
              // // Platform.select({
              // //   default: {
              // //     display: isLarge ? 'flex' : 'none',
              // //   },
              // //   web: cssStyles.sideBarTabItemText,
              // // }),
              focused && {
                fontWeight: 'bold',
              },
            ]}
          >
            {children}
          </Text>
        </div>
      )}
    </TabBarItem>
  );
}

export function ResponsiveNavigator() {
  return (
    <TabbedNavigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: 'white',
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="hidden md:flex">
          <SideBar />
        </div>

        <AppHeader />

        <div className="container mx-auto px-4 max-w-3xl md:px-0 flex flex-1">
          <TabbedNavigator.Slot />
        </div>

        <TabBar />
      </div>
    </TabbedNavigator>
  );
}

function AppHeader() {
  return (
    <div className="flex md:hidden">
      <div className="h-16" />
      <div className="flex flex-1 z-10 bg-black fixed top-0 left-0 right-0 px-4 flex-row items-center justify-between border-b border-b-[#30363d] h-16">
        <Icon name="logo" fill={Colors.dark} />
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className="flex md:hidden">
      <div className="h-12" />

      <div className="fixed bottom-0 left-0 right-0 flex flex-1 flex-row border-t border-t-[#30363d] bg-black justify-around items-stretch h-12 px-4">
        {[
          { name: 'index', id: 'index', icon: 'home' },
          { name: 'blog', id: 'blog/index', icon: 'explore' },
          { name: 'games', id: 'games', icon: 'explore' },
          { name: '/more', id: 'more', icon: 'more' },
        ].map((tab, i) => (
          <TabBarItem
            style={[
              {
                $$css: true,
                __: 'group flex items-center focus:outline-none',
              },
            ]}
            key={i}
            name={tab.name}
            id={tab.id}
          >
            {({ focused }) => (
              <TabBarIcon
                style={{ width: '2.5rem', height: '2.5rem' }}
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
