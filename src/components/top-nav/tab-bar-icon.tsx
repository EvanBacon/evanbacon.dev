import React from 'react';
import { Icon, IconName } from './icon';

export function makeIcon(name: IconName) {
  return (props: { focused?: boolean; style?: any; color: string }) => (
    <TabBarIcon name={name} {...props} color="white" />
  );
}

export function TabBarIcon({
  focused,
  ...props
}: {
  name: IconName;
  focused?: boolean;
  color: string;
  style?: any;
}) {
  let resolvedName: any = props.name;
  if (focused) {
    resolvedName = props.name + '-active';
  }

  return (
    <Icon
      style={[{ width: 22, height: 22 }, props.style]}
      {...props}
      name={resolvedName}
      fill={props.color}
    />
  );
}
