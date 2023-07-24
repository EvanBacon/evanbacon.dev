import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import * as SVG from 'react-native-svg';

const { Path, Circle, Svg } = SVG;

export default function MenuButton({ onPress, isActive }) {
  const transitionStyle = Platform.select({
    web: {
      transitionProperty: 'all',
      transitionDuration: '0.5s',
      transitionTimingFunction: 'cubic-bezier(.645, .045, .355, 1)',
    },
    default: {},
  });
  const stylePath = {
    fill: 'none',
    stroke: '#ffffff',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: 24,
    strokeDashoffset: -38,
    ...transitionStyle,
  };
  const styleA = [
    stylePath,
    {
      strokeDasharray: [24, 126.64183044433594],
    },
    isActive && {
      strokeDasharray: [22.627416998, 126.64183044433594],
      strokeDashoffset: -94.1149185097,
    },
  ];

  const styleB = [
    stylePath,
    {
      strokeDasharray: [24, 70],
    },
    isActive && { strokeDasharray: [0, 70], strokeDashoffset: -50 },
  ];

  const touchableStyle = [
    { width: 50, height: 50, transform: [{ scale: 1.2 }] },
    transitionStyle,
  ] as any;

  return (
    <TouchableOpacity style={touchableStyle} onPress={onPress}>
      <Svg style={{ flex: 1 }} viewBox="0 0 100 100">
        <Circle fill="transparent" cx={50} cy={50} r={32} />
        <Path style={styleA} d="M0 40h62c13 0 6 28-4 18L35 35" />
        <Path style={styleB} d="M0 50h70" />
        <Path style={styleA} d="M0 60h62c13 0 6-28-4-18L35 65" />
      </Svg>
    </TouchableOpacity>
  );
}
