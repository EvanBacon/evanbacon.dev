import React from 'react';

const icons = require.context('./icons');

export type IconName =
  | 'logo'
  | 'logo-small'
  | 'games'
  | 'games-active'
  | 'blog'
  | 'blog-active'
  | 'home'
  | 'home-active'
  | 'messages'
  | 'notifications';

export function Icon({
  name,
  ...props
}: {
  name: IconName;
  fill: string;
  style?: any;
  width?: number;
  height?: number;
  className?: string;
}) {
  const Comp = React.useMemo(() => {
    const imp = icons(`./${name}.svg`);
    if (!imp) {
      throw new Error(
        `Icon not found: ${name}. Options: ${icons.keys().join(', ')}}`
      );
    }
    return imp.default;
  }, [name]);
  return <Comp {...props} color={props.fill} />;
}
