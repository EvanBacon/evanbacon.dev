import { FontAwesome } from '@expo/vector-icons';

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
};

export default function SocialIcon({ name, color, ...props }) {
  if (['twitter', 'x'].includes(name)) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill={color || 'white'}
        width={props.size}
        height={props.size}
      >
        <path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0"></path>
      </svg>
    );
  }
  return <FontAwesome {...props} color={color || colors[name]} name={name} />;
}
