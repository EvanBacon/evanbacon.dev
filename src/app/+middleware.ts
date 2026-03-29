import type { MiddlewareFunction } from "expo-server";

const redirects: Record<string, { destination: string; permanent: boolean }> = {
  "/blog/expo-2024": { destination: "/blog/expo-apps", permanent: true },
  "/expo/showcase": { destination: "/blog/expo-apps", permanent: true },
};

const middleware: MiddlewareFunction = (request) => {
  const url = new URL(request.url, "http://localhost");
  const redirect = redirects[url.pathname];
  if (redirect) {
    return new Response(null, {
      status: redirect.permanent ? 301 : 302,
      headers: { Location: redirect.destination },
    });
  }
};

export default middleware;
