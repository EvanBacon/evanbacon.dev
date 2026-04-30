// A custom slot navigator: a StackRouter under the hood so each navigation
// pushes a real browser history entry, plus a per-tab pathname stack so
// clicking a tab restores the last sub-page visited within that tab.
import { StackRouter } from '@react-navigation/routers';
import { Link, Navigator, router, usePathname } from 'expo-router';
import * as React from 'react';

const tabHistory = new Map<string, string[]>();

function tabKeyForPath(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg ?? '';
}

function tabKeyForLinkName(linkName: string): string {
  const base = linkName.replace(/\/index$/, '');
  return base === 'index' || base === '' ? '' : base.split('/')[0];
}

function tabRootHref(linkName: string): string {
  const base = linkName.replace(/\/index$/, '');
  if (base === 'index' || base === '') return '/';
  return '/' + base;
}

function recordPathname(key: string, pathname: string) {
  const stack = tabHistory.get(key) ?? [];
  const top = stack[stack.length - 1];
  if (top === pathname) return;
  if (stack[stack.length - 2] === pathname) {
    tabHistory.set(key, stack.slice(0, -1));
  } else {
    tabHistory.set(key, [...stack, pathname]);
  }
}

export function useTabScrollToTop() {
  // No-op: scroll-to-top is handled inline in TabLink.onPress.
}

function useNavigatorContext() {
  return Navigator.useContext();
}

export function TabbedNavigator(props: React.ComponentProps<typeof Navigator>) {
  return <Navigator {...props} router={StackRouter} />;
}

export function useIsTabSelected(linkName: string): boolean {
  const pathname = usePathname();
  return tabKeyForPath(pathname) === tabKeyForLinkName(linkName);
}

export default function TabbedSlot() {
  const { state, descriptors } = Navigator.useContext();
  const pathname = usePathname();

  React.useEffect(() => {
    recordPathname(tabKeyForPath(pathname), pathname);
  }, [pathname]);

  const focused = state.routes[state.index];
  const descriptor = descriptors[focused.key];
  return <>{descriptor.render()}</>;
}

export function TabLink({
  name,
  scrollToTop,
  ...props
}: { name: string; scrollToTop?: boolean } & Omit<
  React.ComponentProps<typeof Link>,
  'href' | 'onPress' | 'onLongPress'
>) {
  const pathname = usePathname();
  const root = tabRootHref(name);
  const key = tabKeyForLinkName(name);
  const isCurrent = tabKeyForPath(pathname) === key;

  const onPress = (e: any) => {
    e.preventDefault();
    if (scrollToTop && isCurrent) {
      window.scrollTo(0, 0);
    }

    let target = root;
    if (isCurrent) {
      tabHistory.set(key, [root]);
    } else {
      const stored = tabHistory.get(key);
      const last = stored?.[stored.length - 1];
      if (last && last !== root) target = last;
    }

    router.navigate(target as any);
  };

  return <Link {...(props as any)} href={root as any} onPress={onPress} />;
}

TabbedNavigator.Slot = TabbedSlot;
TabbedNavigator.Link = TabLink;
TabbedNavigator.useContext = useNavigatorContext;
