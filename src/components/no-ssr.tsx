import React from 'react';

export function NoSSR({ children }: { children: React.ReactNode }) {
  const [render, setRender] = React.useState(false);
  React.useEffect(() => {
    setRender(true);
  }, []);

  if (!render) {
    return null;
  }

  return <>{children}</>;
}
