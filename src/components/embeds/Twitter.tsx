import React from 'react';

import { ProfileCard } from './Profile';

function getTweetId(input: string): string {
  if (!input) return '';
  if (/^\d+$/.test(input)) return input;
  const m = input.match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : input;
}

declare global {
  interface Window {
    twttr?: {
      widgets?: { load?: (el?: HTMLElement | null) => void };
    };
  }
}

let widgetsPromise: Promise<void> | null = null;

function loadWidgets(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.twttr?.widgets) return Promise.resolve();
  if (widgetsPromise) return widgetsPromise;
  widgetsPromise = new Promise<void>((resolve) => {
    const existing = document.getElementById('twitter-wjs');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.id = 'twitter-wjs';
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
  return widgetsPromise;
}

export function Tweet({
  id,
  url,
  username,
}: {
  id?: string;
  url?: string;
  username?: string;
}) {
  const tweetId = getTweetId(id ?? url ?? '');
  const handle = username ?? 'i';
  const href = `https://twitter.com/${handle}/status/${tweetId}`;
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;
    loadWidgets().then(() => {
      if (!cancelled) window.twttr?.widgets?.load?.(ref.current);
    });
    return () => {
      cancelled = true;
    };
  }, [tweetId]);

  return (
    <div ref={ref} className="my-5 flex justify-center [&_.twitter-tweet]:!my-0">
      <blockquote
        className="twitter-tweet"
        data-theme="dark"
        data-dnt="true"
        data-conversation="none"
      >
        <a href={href}>{href}</a>
      </blockquote>
    </div>
  );
}

const PICTURES = {
  baconbrix: 'https://github.com/evanbacon.png',
};
const BIOS = {
  baconbrix: 'Expo Router',
};

// Twitter profile embed
export function TwitterProfile({ url }: { url: string }) {
  const username = url.match(/twitter\.com\/(.*)/)?.[1].toLowerCase();
  const bio = BIOS[username] || 'No bio available';
  return (
    <ProfileCard
      title={'@' + username}
      subtitle={bio}
      image={
        PICTURES[username] ??
        'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
      }
      website="Twitter"
      url={url}
    />
  );
}
