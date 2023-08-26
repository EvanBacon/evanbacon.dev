import React from 'react';
import gsap from 'gsap';

export default function PageHeader({ children }) {
  const [text, setText] = React.useState('  ');

  React.useEffect(() => {
    const arr1 = children.split('');
    const arr2 = [];
    arr1.forEach((char, i) => (arr2[i] = randChar())); //fill arr2 with random characters

    const tl = gsap.timeline();
    let step = 0;
    tl.fromTo(
      {},
      {
        innerHTML: arr2.join(''),
      },
      {
        duration: arr1.length / 15,
        ease: 'power4.in',
        delay: 0.2,
        onUpdate: () => {
          const p = Math.floor(tl.progress() * arr1.length);
          if (step != p) {
            step = p;
            arr1.forEach((char, i) => (arr2[i] = randChar()));
            const pt1 = arr1.join('').substring(p, 0);
            const pt2 = arr2.join('').substring(arr2.length - p, 0);
            setText(pt1 + pt2);
          }
        },
      }
    );
  }, [children]);

  return (
    <h1 className="text-5xl h-[3rem] font-bold my-3 mx-2 md:mx-0 text-slate-50">
      {text}
    </h1>
  );
}

function randChar() {
  // let c = 'x';
  let c = 'abcdefghijklmnopqrstuvwxyz';
  // let c = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`';
  c = c[Math.floor(Math.random() * c.length)];
  return c;
  // return Math.random() > 0.5 ? c : c.toUpperCase();
}
