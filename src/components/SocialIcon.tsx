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
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    );
  }
  return <FontAwesome {...props} color={color || colors[name]} name={name} />;
}
