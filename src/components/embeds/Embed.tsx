import React from "react";
import { ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

import { Gist, GitHubProfile, GitHubRepo } from "./GitHub";
import { NpmPackage } from "./Npm";
import { Snack } from "./Snack";
import { Tweet, TwitterProfile } from "./Twitter";

function TweetEmbedWebView({ url }: { url: string }) {
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

export function Embed({ url }: { url: string }) {
  if (url.match(/^https:\/\/twitter\.com\/(.*)\/status\//)) {
    return <Tweet url={url} />;
  } else if (url.match(/^https:\/\/twitter\.com\/(.*)/)) {
    return <TwitterProfile url={url} />;
  } else if (url.match(/^https:\/\/snack\.expo\.io\/(.*)/)) {
    return <Snack url={url} />;
  } else if (url.match(/^https:\/\/gist\.github\.com\/(.*)/)) {
    return <Gist url={url} />;
  } else if (url.match(/^https:\/\/github\.com\/(.*)\/(.*)/)) {
    return <GitHubRepo url={url} />;
  } else if (url.match(/^https:\/\/github\.com\/(.*)/)) {
    return <GitHubProfile url={url} />;
  } else if (url.match(/^https?:\/\/(?:www\.)?npmjs\.com\/package\/(.*)/)) {
    return <NpmPackage url={url} />;
  }
  console.log("url", url);
  // else if (url.match(/^https:\/\/snack\.expo\.io\/(.*)/)) {
  //     return <Snack url={url} />;
  //   } else if (url.match(/^https:\/\/www\.youtube\.com\/watch\?v=(.*)/)) {
  //     return <YouTube url={url} />;
  //   } else if (url.match(/^https:\/\/youtu\.be\/(.*)/)) {
  //     return <YouTube url={url} />;
  //   } else if (url.match(/^https:\/\/github\.com\/(.*)\/(.*)/)) {
  //     return <GitHubRepo url={url} />;
  //   } else if (url.match(/^https:\/\/github\.com\/(.*)/)) {
  //     return <GitHubProfile url={url} />;
  //   }
  return (
    <div
      style={{
        marginTop: 32,
        paddingVertical: 16,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#e6e6e6",
        borderWidth: 1,
      }}
    >
      <a target="_blank" href={url}>
        Embed not implemented: {url}
      </a>
    </div>
  );
}
