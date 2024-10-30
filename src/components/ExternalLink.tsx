import React from 'react';
import { Link } from 'expo-router';

export function ExternalLink(props: React.ComponentProps<typeof Link>) {
  return <Link target="_blank" {...props} />;
}
