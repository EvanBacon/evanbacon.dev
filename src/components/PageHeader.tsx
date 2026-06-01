import classNames from 'classnames';
import { IS_DOM } from 'expo/dom';
import React from 'react';

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & Omit<React.HTMLAttributes<HTMLElement>, 'children'>;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function PageHeader({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  if (IS_DOM || process.env.EXPO_OS !== 'web') return null;

  return (
    <TextScramble
      as="h1"
      duration={0.8}
      speed={0.04}
      className={classNames(
        'text-5xl min-h-[3rem] font-bold my-3 mx-2 md:mx-0 text-slate-50',
        className
      )}
    >
      {children}
    </TextScramble>
  );
}

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const displayText = useScrambledText({
    text: children,
    duration,
    speed,
    characterSet,
    trigger,
    onScrambleComplete,
  });

  return React.createElement(
    Component,
    { className, ...props },
    displayText
  );
}

function useScrambledText({
  text,
  duration,
  speed,
  characterSet,
  trigger,
  onScrambleComplete,
}: {
  text: string;
  duration: number;
  speed: number;
  characterSet: string;
  trigger: boolean;
  onScrambleComplete?: () => void;
}) {
  const [scrambledText, setScrambledText] = React.useState<string | null>(null);
  const isAnimating = React.useRef(false);
  const onScrambleCompleteRef = React.useRef(onScrambleComplete);

  React.useEffect(() => {
    onScrambleCompleteRef.current = onScrambleComplete;
  }, [onScrambleComplete]);

  React.useEffect(() => {
    if (!trigger || isAnimating.current) return;

    isAnimating.current = true;
    const steps = Math.max(1, duration / speed);
    let step = 0;

    const interval = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
        } else if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setScrambledText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setScrambledText(null);
        isAnimating.current = false;
        onScrambleCompleteRef.current?.();
      }
    }, speed * 1000);

    return () => {
      clearInterval(interval);
      setScrambledText(null);
      isAnimating.current = false;
    };
  }, [characterSet, duration, speed, text, trigger]);

  return scrambledText ?? text;
}

export function GlitchText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <TextScramble className={classNames(className)}>{children}</TextScramble>
  );
}
