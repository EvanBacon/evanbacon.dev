import React from 'react';

export default function PageHeader({ children }) {
  return (
    <h1 className="text-5xl font-bold leading-tight tracking-tight my-3">
      {children}
    </h1>
  );
}
