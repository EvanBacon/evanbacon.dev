import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

import { resolveAssetUri } from '@/utils/resolveMetroAsset';

type Slide = { src: string; title?: string; description?: string };

type GalleryContextValue = {
  /** Register a photo's slide; returns an unregister fn. Order = mount order. */
  register: (id: string, slide: Slide) => () => void;
  /** Open the shared lightbox at the slide belonging to `id`. */
  openById: (id: string) => void;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

const lightboxPlugins = [Captions];
const lightboxStyles = { container: { backgroundColor: 'rgba(0, 0, 0, .94)' } };

/** Small corner glyph that hints "tap to expand" — fades in on hover/focus. */
function ExpandIcon() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

type PhotoProps = {
  /** A require()'d image asset, a remote URL string, or an { uri } source. */
  src: number | string | { uri: string };
  /** Description shown under the photo and in the lightbox. */
  caption?: string;
  /** Aspect ratio of the framed (standalone) thumbnail. Ignored in a grid. */
  aspect?: 'square' | 'video' | 'portrait' | 'auto';
  className?: string;
  /**
   * Rendering mode. `card` (default) is a framed image with a caption below;
   * `tile` is a uniform grid cell (no caption) — set by <PhotoGrid>.
   */
  variant?: 'card' | 'tile';
  /** In a grid, make this the tall cell that spans two rows (set by <PhotoGrid>). */
  featured?: boolean;
  /** In a 2-col mobile grid, span both columns so an odd count stays even (set by <PhotoGrid>). */
  wideOnMobile?: boolean;
  /** Position within a grid, used to stagger the fade-in (set by <PhotoGrid>). */
  index?: number;
};

const ratios = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  auto: undefined,
} as const;

// Hard ceiling so a full-column-width square/portrait photo can't tower over
// the text. Narrow row cells stay well under this and keep their ratio.
const MAX_PHOTO_HEIGHT = 520;

/**
 * A single photo with a clean, frameless presentation: rounded corners, a
 * hairline border, and a soft hover lift. Tapping it opens a full-screen
 * lightbox (captions + keyboard/swipe nav).
 *
 * - Inside a <PhotoGalleryProvider>, every photo shares one lightbox, so you
 *   can swipe through the whole post no matter where the photos sit.
 * - On its own it opens a lightbox of just itself.
 */
export function Photo({
  src,
  caption,
  aspect = 'video',
  className,
  variant = 'card',
  featured = false,
  wideOnMobile = false,
  index = 0,
}: PhotoProps) {
  const uri = resolveAssetUri(src as any) ?? '';
  const gallery = useContext(GalleryContext);
  const id = useId();

  // Standalone (no surrounding provider) lightbox state.
  const [soloOpen, setSoloOpen] = useState(false);

  useEffect(() => {
    if (!gallery) return;
    return gallery.register(id, { src: uri, description: caption });
  }, [gallery, id, uri, caption]);

  const handleOpen = () => {
    if (gallery) gallery.openById(id);
    else setSoloOpen(true);
  };

  const soloLightbox = !gallery && (
    <Lightbox
      open={soloOpen}
      close={() => setSoloOpen(false)}
      slides={[{ src: uri, description: caption }]}
      plugins={lightboxPlugins}
      captions={{ descriptionTextAlign: 'center' }}
      styles={lightboxStyles}
    />
  );

  // Grid cell: a uniform, captionless tile that matches the home-page grid —
  // rounded, ken-burns fade-in, hover lift. Tall when `featured`.
  if (variant === 'tile') {
    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          aria-label={caption ?? 'Open photo'}
          className={cn(
            'group relative cursor-zoom-in overflow-hidden rounded-lg bg-[#00000042] ring-1 ring-white/10 transition-all duration-500 ease-in-out hover:scale-105 hover:ring-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
            featured ? 'h-full row-span-2' : 'h-40',
            wideOnMobile && 'col-span-2 md:col-span-1',
            className
          )}
        >
          <span
            className="absolute inset-0 block animate-kennyburns opacity-0"
            style={{ animationDelay: 200 + index * 120 + 'ms' }}
          >
            <img
              draggable={false}
              src={uri || undefined}
              alt={caption ?? ''}
              className="absolute inset-0 block h-full w-full object-cover"
            />
          </span>
          <ExpandIcon />
        </button>
        {soloLightbox}
      </>
    );
  }

  // Standalone card: framed hero image with a caption beneath it.
  return (
    <figure className={cn('group my-8 flex min-w-0 flex-col', className)}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={caption ?? 'Open photo'}
        style={{ aspectRatio: ratios[aspect], maxHeight: MAX_PHOTO_HEIGHT }}
        className="relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 transition duration-300 hover:ring-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <img
          draggable={false}
          src={uri || undefined}
          alt={caption ?? ''}
          className="absolute inset-0 block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <ExpandIcon />
      </button>
      {caption && (
        <figcaption className="mt-2.5 px-0.5 text-[13px] leading-snug text-neutral-400">
          {caption}
        </figcaption>
      )}
      {soloLightbox}
    </figure>
  );
}

type SnapshotProps = {
  /** A require()'d image asset, a remote URL string, or an { uri } source. */
  src: number | string | { uri: string };
  /** Description shown under the image and in the lightbox. */
  caption?: string;
  /** Cap on the rendered height so a tall screenshot can't dominate the page. */
  maxHeight?: number;
  className?: string;
};

/**
 * A standalone image shown in full — no cropping. Unlike <Photo>, which fills a
 * framed aspect box with `object-cover`, this fits the whole image (contain) at
 * its natural aspect ratio, which is what you want for screenshots, diagrams,
 * and tweets. Taps still open the shared lightbox.
 */
export function Snapshot({
  src,
  caption,
  maxHeight = 480,
  className,
}: SnapshotProps) {
  const uri = resolveAssetUri(src as any) ?? '';
  const gallery = useContext(GalleryContext);
  const id = useId();

  const [soloOpen, setSoloOpen] = useState(false);

  useEffect(() => {
    if (!gallery) return;
    return gallery.register(id, { src: uri, description: caption });
  }, [gallery, id, uri, caption]);

  const handleOpen = () => {
    if (gallery) gallery.openById(id);
    else setSoloOpen(true);
  };

  return (
    <figure className={cn('group my-8 flex min-w-0 flex-col items-center', className)}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={caption ?? 'Open image'}
        className="relative block cursor-zoom-in overflow-hidden rounded-xl ring-1 ring-white/10 transition duration-300 hover:ring-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <img
          draggable={false}
          src={uri || undefined}
          alt={caption ?? ''}
          style={{ maxHeight }}
          className="block h-auto w-auto max-w-full object-contain"
        />
        <ExpandIcon />
      </button>
      {caption && (
        <figcaption className="mt-2.5 max-w-prose px-0.5 text-center text-[13px] leading-snug text-neutral-400">
          {caption}
        </figcaption>
      )}
      {!gallery && (
        <Lightbox
          open={soloOpen}
          close={() => setSoloOpen(false)}
          slides={[{ src: uri, description: caption }]}
          plugins={lightboxPlugins}
          captions={{ descriptionTextAlign: 'center' }}
          styles={lightboxStyles}
        />
      )}
    </figure>
  );
}

/**
 * Arranges its <Photo /> children into the same masonry grid used on the home
 * page: two columns on mobile, three on wider screens, with one taller cell
 * spanning two rows once there are enough photos. Children render as uniform,
 * captionless tiles; captions still show in the lightbox.
 */
export function PhotoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;
  // Mirror the home page: feature the 2nd tile once a grid is full enough to
  // carry a tall cell without leaving an obvious hole.
  const featuredIndex = count >= 4 ? 1 : -1;

  return (
    <div
      className={cn(
        'my-8 grid w-full gap-4',
        count >= 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2',
        className
      )}
    >
      {items.map((child, index) =>
        cloneElement(child as React.ReactElement<PhotoProps>, {
          variant: 'tile',
          featured: index === featuredIndex,
          // A 3-tile grid is 2 cols on mobile: let the first tile span the full
          // width so the layout stays even (3 across on desktop, unchanged).
          wideOnMobile: count === 3 && index === 0,
          index,
        })
      )}
    </div>
  );
}

/** @deprecated Renamed to PhotoGrid — kept so existing imports keep working. */
export const PhotoRow = PhotoGrid;

/**
 * Provides one shared lightbox for every <Photo /> rendered inside it,
 * regardless of how the photos are scattered through the content. Wrap the
 * whole post so a tap on any photo lets you swipe through all of them in
 * document order.
 */
export function PhotoGalleryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entries, setEntries] = useState<{ id: string; slide: Slide }[]>([]);
  const [index, setIndex] = useState(-1);

  const register = useCallback((id: string, slide: Slide) => {
    setEntries((prev) =>
      prev.some((e) => e.id === id)
        ? prev.map((e) => (e.id === id ? { id, slide } : e))
        : [...prev, { id, slide }]
    );
    return () => setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const openById = useCallback(
    (id: string) =>
      setEntries((prev) => {
        setIndex(prev.findIndex((e) => e.id === id));
        return prev;
      }),
    []
  );

  const value = useMemo<GalleryContextValue>(
    () => ({ register, openById }),
    [register, openById]
  );

  return (
    <GalleryContext.Provider value={value}>
      {children}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={entries.map((e) => e.slide)}
        plugins={lightboxPlugins}
        captions={{ descriptionTextAlign: 'center' }}
        styles={lightboxStyles}
      />
    </GalleryContext.Provider>
  );
}

export default Photo;
