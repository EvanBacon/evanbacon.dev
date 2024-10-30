import GamesRoute from '@/components/games-route';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import * as WebBrowser from 'expo-web-browser';

export default function GamesRouteNative() {
  const paddingBottom = useBottomTabOverflow();
  return (
    <GamesRoute
      openExternalUrl={url => {
        WebBrowser.openBrowserAsync(url, {
          toolbarColor: 'black',
          controlsColor: 'white',
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        });
      }}
      paddingBottom={paddingBottom}
      dom={{
        contentInsetAdjustmentBehavior: 'automatic',
        automaticallyAdjustsScrollIndicatorInsets: true,
        mediaPlaybackRequiresUserAction: false,
        allowsInlineMediaPlayback: true,
      }}
    />
  );
}
