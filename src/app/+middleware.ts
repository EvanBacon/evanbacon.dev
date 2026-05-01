import type { MiddlewareFunction } from "expo-server";
import { origin } from 'expo-server';

const redirects: Record<string, { destination: string; permanent: boolean }> = {
  "/blog/expo-2024": { destination: "/blog/expo-apps", permanent: true },
  "/expo/showcase": { destination: "/blog/expo-apps", permanent: true },
};

const middleware: MiddlewareFunction = (request) => {
  const url = new URL(request.url);


  // Redirect bacon.expo.app to evanbacon.dev
  // Use origin() because EAS Hosting passes internal hostname to middleware
  const requestOrigin = origin();
  if (requestOrigin && requestOrigin.startsWith('http')) {
    const originUrl = new URL(requestOrigin);
    if (originUrl.hostname === 'bacon.expo.app') {
      const redirectUrl = new URL(url.pathname + url.search, requestOrigin);
      redirectUrl.hostname = 'evanbacon.dev';
      return new Response(null, {
        status: 301,
        headers: { Location: redirectUrl.toString() },
      });
    }
  }

  const redirect = redirects[url.pathname];
  if (redirect) {
    return new Response(null, {
      status: redirect.permanent ? 301 : 302,
      headers: { Location: redirect.destination },
    });
  }
};

export default middleware;
