import ExpoIcon from '@/svg/expo.svg';
import GitHubIcon from '@/svg/github.svg';
import XIcon from '@/svg/x.svg';
import React from 'react';

export default function CustomFooter() {
  return (
    <footer className="border-t border-t-slate-800 mt-2 py-6">
      <nav className="flex container mx-auto px-6 md:px-0 max-w-3xl">
        <ul>
          {[
            [
              <>
                <XIcon
                  className="inline mt-[-3px] mr-2"
                  width={18}
                  height={18}
                  fill="white"
                />
                Follow on Twitter
              </>,
              'https://x.com/baconbrix',
            ],
            [
              <>
                <GitHubIcon
                  className="inline mt-[-3px] mr-2"
                  width={18}
                  height={18}
                  fill="white"
                />
                View code on GitHub
              </>,

              'https://github.com/evanbacon',
            ],
            [
              <>
                <ExpoIcon
                  className="inline mt-[-3px] mr-2"
                  width={18}
                  height={18}
                  fill="white"
                />
                Powered by Expo
              </>,
              'https://www.expo.dev',
            ],
          ].map(([title, href], index) => (
            <li key={index} className="leading-loose h-10">
              <a
                target="_blank"
                href={href}
                className="text-slate-200 transition-opacity hover:opacity-70"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
