import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export const colors = {
    link: '#517fa4',
    snapchat: '#ffc00',
    facebook: '#3b5998',
    quora: '#a82400',
    twitter: '#00aced',
    'google-plus-official': '#dd4b39',
    pinterest: '#cb2027',
    linkedin: '#007bb6',
    youtube: '#bb0000',
    vimeo: '#aad450',
    tumblr: '#32506d',
    instagram: '#517fa4',
    foursquare: '#0072b1',
    wordpress: '#21759b',
    stumbleupon: '#EB4823',
    github: '#000000',
    'github-alt': '#000000',
    twitch: '#6441A5',
    medium: '#02b875',
    soundcloud: '#f50',
    gitlab: '#e14329',
    angellist: '#1c4082',
    codepen: '#000000',
}

export default function SocialIcon({ name, color, ...props }) {
    return (
        <FontAwesome
            {...props}
            color={color || colors[name]}
            name={name}
        />
    );
}
