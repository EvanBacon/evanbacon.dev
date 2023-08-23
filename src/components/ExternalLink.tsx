import { Link } from "expo-router";
import React from "react";

export function ExternalLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      target="_blank"
      {...props}
      // onPress={(e) => {
      //   if (Platform.OS !== "web") {
      //     // Prevent the default behavior of linking to Safari.
      //     e.preventDefault();
      //     // Open the link in an in-app browser.
      //     WebBrowser.openBrowserAsync(resolveHref(props.href));
      //   }
      // }}
    />
  );
}
