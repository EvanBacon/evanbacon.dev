import React from 'react';
import { ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

export function Snack({ url }: { url: string }) {
  return (
    <WebView
      source={{ uri: url }}
      style={{ flex: 1, minHeight: 256 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scrollEnabled={false}
      renderLoading={() => <ActivityIndicator />}
      renderError={() => <span>Error loading page</span>}
    />
  );
}
