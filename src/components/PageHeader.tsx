import classNames from 'classnames';
import React from 'react';
import { Animated, Easing } from 'react-native';

export default function PageHeader({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const text = useGlitchText(children);

  return (
    <h1
      className={classNames(
        'text-5xl min-h-[3rem] font-bold my-3 mx-2 md:mx-0 text-slate-50',
        className
      )}
    >
      {text}
    </h1>
  );
}

function useGlitchText(children: string) {
  const [text, setText] = React.useState('  ');

  const animated = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated._value === 1) return;
    const arr1 = children.split('');
    const arr2 = [];
    arr1.forEach((char, i) => (arr2[i] = randChar())); //fill arr2 with random characters

    let step = 0;

    animated.addListener(({ value }) => {
      const p = Math.floor(value * arr1.length);
      if (step != p) {
        step = p;
        arr1.forEach((char, i) => (arr2[i] = randChar()));
        const pt1 = arr1.join('').substring(p, 0);
        const pt2 = arr2.join('').substring(arr2.length - p, 0);
        setText(pt1 + pt2);
      }
    });

    Animated.timing(animated, {
      toValue: 1.1,
      duration: 200 * arr1.length,
      // Power4: Easing.ease,
      easing: Easing.inOut(Easing.exp),
      useNativeDriver: false,
      delay: 100,
    }).start();
  }, [children]);

  return text;
}

export function GlitchText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const text = useGlitchText(children);

  return <p className={classNames(className)}>{text}</p>;
}

function randChar() {
  // let c = 'x';
  let c = 'abcdefghijklmnopqrstuvwxyz';
  // let c = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`';
  c = c[Math.floor(Math.random() * c.length)];
  return c;
  // return Math.random() > 0.5 ? c : c.toUpperCase();
}
