import GamesRoute from '@/components/games-route';

import * as WebBrowser from 'expo-web-browser';

export default function GamesRouteNative() {
  return (
    <GamesRoute
      openExternalUrl={url => {
        WebBrowser.openBrowserAsync(url, {
          toolbarColor: 'black',
          controlsColor: 'white',
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        });
      }}
      dom={{
        contentInsetAdjustmentBehavior: 'automatic',
        automaticallyAdjustsScrollIndicatorInsets: true,
        mediaPlaybackRequiresUserAction: false,
        allowsInlineMediaPlayback: true,
      }}
    />
  );
}
