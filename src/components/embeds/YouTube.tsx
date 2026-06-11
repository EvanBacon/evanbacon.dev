import React from 'react';

function getVideoId(input: string): string {
  if (!input) return '';
  // Already an ID (no slashes / protocol).
  if (!input.includes('/') && !input.includes('?')) return input;
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)([^?&/]+)/,
  ];
  for (const re of patterns) {
    const m = input.match(re);
    if (m) return m[1];
  }
  return input;
}

export function YouTube({
  id,
  url,
  caption,
  title,
}: {
  id?: string;
  url?: string;
  caption?: string;
  title?: string;
}) {
  const videoId = getVideoId(id ?? url ?? '');
  const [active, setActive] = React.useState(false);
  const label = title ?? caption ?? 'YouTube video';

  return (
    <figure className="my-5">
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ borderRadius: '1rem', aspectRatio: '16 / 9' }}
      >
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play ${label}`}
            className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
            style={{ background: 'transparent' }}
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt={label}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
            <span
              className="absolute left-1/2 top-1/2 flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                transform: 'translate(-50%, -50%)',
                width: 68,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'rgba(18,18,18,0.8)',
              }}
            >
              <svg viewBox="0 0 24 24" width={28} height={28} fill="#fff" role="img" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm opacity-60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
