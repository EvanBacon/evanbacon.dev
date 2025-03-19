export function GET() {
  return new Response('Redirecting', {
    status: 301,
    headers: {
      Location: '/blog/expo-apps',
    },
  });
}
