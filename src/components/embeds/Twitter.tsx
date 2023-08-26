import { ProfileCard } from "./Profile";

export function Tweet({ url }: { url: string }) {
  return <span>Tweet Embed not implemented: {url}</span>;
}

const PICTURES = {
  baconbrix: "https://github.com/evanbacon.png",
};
const BIOS = {
  baconbrix: "Expo Router",
};

// Twitter profile embed
export function TwitterProfile({ url }: { url: string }) {
  const username = url.match(/twitter\.com\/(.*)/)?.[1].toLowerCase();
  const bio = BIOS[username] || "No bio available";
  return (
    <ProfileCard
      title={"@" + username}
      subtitle={bio}
      image={
        PICTURES[username] ??
        "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
      }
      website="Twitter"
      url={url}
    />
  );
}
