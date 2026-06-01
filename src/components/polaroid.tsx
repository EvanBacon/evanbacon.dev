import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { Caveat_400Regular } from '@expo-google-fonts/caveat';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

import { resolveAssetUri } from '@/utils/resolveMetroAsset';
import { Text, loadAsync } from './useFont';

loadAsync({ Caveat_400Regular });

type Slide = { src: string; title?: string; description?: string };

type GalleryContextValue = {
  /** Register a polaroid's slide; returns an unregister fn. Order = mount order. */
  register: (id: string, slide: Slide) => () => void;
  /** Open the shared lightbox at the slide belonging to `id`. */
  openById: (id: string) => void;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

type PolaroidProps = {
  /** A required() image asset, a remote URL string, or an { uri } source. */
  src: number | string | { uri: string };
  /** Handwritten-style caption shown on the bottom of the frame. */
  caption?: string;
  /** Optional smaller line under the caption (date, place, names). */
  subcaption?: string;
  /** Tilt the photo for that pinned-to-the-wall feel. Defaults to a slight left tilt. */
  tilt?: 'left' | 'right' | 'none';
  /**
   * On wide screens, lift the polaroid out into the page gutter beside the
   * text (rendered via a portal so it escapes the clipped content column).
   * Falls back to a centered block in normal flow on narrower screens.
   */
  side?: 'left' | 'right';
  className?: string;
};

const tilts = {
  left: '-rotate-2',
  right: 'rotate-2',
  none: 'rotate-0',
} as const;

const lightboxPlugins = [Captions];
const lightboxStyles = { container: { backgroundColor: 'rgba(0, 0, 0, .92)' } };

// Width of a gutter polaroid, and the gap it keeps from the text column / edges.
const GUTTER_W = 168;
const GUTTER_GAP = 24;
// The left gutter is shared with the fixed sidebar; don't let a left polaroid
// slide under it. If it can't clear this, fall back to an inline block.
const SIDEBAR_SAFE = 260;
// Smallest viewport where a gutter is wide enough to hold the frame. Below this
// the side polaroids fall back to centered blocks in normal flow.
const GUTTER_MIN_VW = 1180;

/** Nearest scrollable ancestor (the post scrolls inside a ScrollView, not the window). */
function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const oy = getComputedStyle(node).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight)
      return node;
    node = node.parentElement;
  }
  return null;
}

/** Walk up from the anchor to the text column (the first sensible content-width block). */
function findColumn(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const w = node.getBoundingClientRect().width;
    if (w >= 360 && w <= 900) return node;
    node = node.parentElement;
  }
  return el?.parentElement ?? null;
}

type GutterPos = { top: number; left: number };

/**
 * Tracks an in-flow anchor and computes a viewport-fixed position in the page
 * gutter beside it. Returns null when the screen is too narrow (caller renders
 * the polaroid inline instead).
 */
function useGutterPosition(
  anchorRef: React.RefObject<HTMLElement>,
  side: 'left' | 'right' | undefined
): GutterPos | null {
  const [pos, setPos] = useState<GutterPos | null>(null);

  useLayoutEffect(() => {
    if (!side || typeof window === 'undefined') return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const scroller = getScrollParent(anchor);

    const update = () => {
      if (window.innerWidth < GUTTER_MIN_VW) {
        setPos(null);
        return;
      }
      const a = anchor.getBoundingClientRect();
      const col = findColumn(anchor)!.getBoundingClientRect();
      if (side === 'left') {
        const left = col.left - GUTTER_GAP - GUTTER_W;
        // Bail to an inline block rather than crowd the sidebar.
        if (left < SIDEBAR_SAFE) {
          setPos(null);
          return;
        }
        setPos({ top: a.top, left });
      } else {
        const left = Math.min(
          col.right + GUTTER_GAP,
          window.innerWidth - GUTTER_W - 16
        );
        setPos({ top: a.top, left });
      }
    };

    update();
    scroller?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      scroller?.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [side, anchorRef]);

  return pos;
}

/** The visual polaroid: white frame, tilt, image, handwritten caption. */
function PolaroidCard({
  uri,
  caption,
  subcaption,
  tilt,
  onOpen,
  className,
  style,
}: {
  uri: string;
  caption?: string;
  subcaption?: string;
  tilt: 'left' | 'right' | 'none';
  onOpen: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={caption ?? 'Open photo'}
      className={cn(
        'block w-44 shrink-0 cursor-pointer bg-white p-3 pb-4 shadow-2xl transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
        tilts[tilt],
        className
      )}
      style={{ borderRadius: 2, ...style }}
    >
      <img
        draggable={false}
        src={uri || undefined}
        alt={caption ?? ''}
        className="block aspect-square w-full object-cover bg-slate-200"
      />
      {(caption || subcaption) && (
        <span className="flex flex-col items-center px-2 pt-4 pb-1 text-center">
          {caption && (
            <Text
              style={{
                fontFamily: 'Caveat_400Regular',
                fontSize: 24,
                color: '#1a1a1a',
                lineHeight: 26,
              }}
            >
              {caption}
            </Text>
          )}
          {subcaption && (
            <Text
              style={{
                fontFamily: 'Caveat_400Regular',
                fontSize: 16,
                color: '#6b7280',
              }}
            >
              {subcaption}
            </Text>
          )}
        </span>
      )}
    </button>
  );
}

/**
 * A single photo styled like a physical polaroid: white frame, soft shadow, a
 * slight tilt, and a handwritten-style caption. Tapping it opens a full-screen
 * lightbox (captions, keyboard/swipe nav).
 *
 * - Inside a <PolaroidGallery>, all siblings share one lightbox.
 * - With `side="left" | "right"`, it lifts into the page gutter on wide
 *   screens (via a portal, so it escapes the clipped content column).
 * - On its own, it opens a lightbox of just itself.
 */
export function Polaroid({
  src,
  caption,
  subcaption,
  tilt = 'left',
  side,
  className,
}: PolaroidProps) {
  const uri = resolveAssetUri(src as any) ?? '';
  const gallery = useContext(GalleryContext);
  const id = useId();

  const anchorRef = useRef<HTMLSpanElement>(null);
  const gutterPos = useGutterPosition(anchorRef, side);
  const inGutter = !!side && !!gutterPos;

  // Standalone (no surrounding gallery) lightbox state.
  const [soloOpen, setSoloOpen] = useState(false);

  useEffect(() => {
    if (!gallery) return;
    return gallery.register(id, {
      src: uri,
      title: caption,
      description: subcaption,
    });
  }, [gallery, id, uri, caption, subcaption]);

  const handleOpen = () => {
    if (gallery) gallery.openById(id);
    else setSoloOpen(true);
  };

  const card = (
    <PolaroidCard
      uri={uri}
      caption={caption}
      subcaption={subcaption}
      tilt={tilt}
      onOpen={handleOpen}
      className={cn(!inGutter && 'mx-auto my-8', className)}
      style={inGutter ? { width: GUTTER_W } : undefined}
    />
  );

  return (
    <>
      {side ? (
        // Anchor stays in flow to mark the vertical position; the card is
        // portalled into the gutter when there's room, else rendered inline.
        <span ref={anchorRef} className="block">
          {!inGutter && card}
        </span>
      ) : (
        card
      )}

      {inGutter &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: gutterPos.top,
              left: gutterPos.left,
              width: GUTTER_W,
              zIndex: 30,
            }}
          >
            {card}
          </div>,
          document.body
        )}

      {!gallery && (
        <Lightbox
          open={soloOpen}
          close={() => setSoloOpen(false)}
          slides={[{ src: uri, title: caption, description: subcaption }]}
          plugins={lightboxPlugins}
          captions={{ descriptionTextAlign: 'center' }}
          styles={lightboxStyles}
        />
      )}
    </>
  );
}

/**
 * A scattered cluster of polaroids that share one lightbox. Drop several
 * <Polaroid /> children inside; tapping any one opens the lightbox and you can
 * swipe through the whole set.
 */
export function PolaroidGallery({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
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
      <div
        className={cn(
          'my-8 flex flex-row flex-wrap items-start justify-center gap-4',
          className
        )}
      >
        {children}
      </div>
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

/** @deprecated Renamed to PolaroidGallery — kept so existing imports keep working. */
export const PolaroidStack = PolaroidGallery;

export default Polaroid;
