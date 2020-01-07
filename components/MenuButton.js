import React from 'react';
import { Text } from 'react-native';
import * as SVG from 'react-native-svg';

const SIZE = 48;

export default function MenuButton({ onPress, isActive }) {

    const transitionStyle = {
        transitionProperty: 'all',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'cubic-bezier(.645, .045, .355, 1)',
    }
    const stylePath = {
        fill: 'none',
        stroke: '#ffffff',
        strokeWidth: 3,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: 24,
        strokeDashoffset: -38,
        ...transitionStyle,
    }
    const styleA = [stylePath, {
        strokeDasharray: [24, 126.64183044433594],
    }, isActive && { strokeDasharray: [22.627416998, 126.64183044433594], strokeDashoffset: -94.1149185097 }]

    const styleB = [stylePath, {
        strokeDasharray: [24, 70],
    }, isActive && { strokeDasharray: [0, 70], strokeDashoffset: -50 }]

    return (
        <Text style={[{ backgroundColor: 'transparent', width: 50, height: 50, transform: [{ scale: 1.2 }] }, transitionStyle]} onPress={() => {
            onPress()
        }}>
            <SVG.Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <SVG.Circle style={{ fill: 'transparent' }} cx={50} cy={50} r={32} />
                <SVG.Path style={styleA} d="M0 40h62c13 0 6 28-4 18L35 35" />
                <SVG.Path style={styleB} d="M0 50h70" />
                <SVG.Path style={styleA} d="M0 60h62c13 0 6-28-4-18L35 65" />
            </SVG.Svg>
        </Text>

    )
}
