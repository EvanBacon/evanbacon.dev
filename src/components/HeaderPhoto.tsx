import React from 'react';

const HeaderPhoto = () => {
  return (
    <img
      src={'/pfp.png'}
      loading="lazy"
      style={{ animationDuration: '500ms', animationDelay: '0ms' }}
      className="opacity-0 animate-kennyburns aspect-square w-[48px] h-[48px] rounded-full mr-3"
    />
  );
};

export default HeaderPhoto;
