import { useState } from 'react';

/**
 * Drop-in `<img>` replacement that never leaves an empty hole while loading.
 *
 * It renders a plain `<img>`, so `className` and the parent's sizing apply exactly
 * as they would to a raw tag — this only layers on top:
 *
 * - **Reserved space.** Pass `width`/`height` (or an aspect-ratio class in
 *   `className`) and the browser reserves the box from first paint, so nothing
 *   below the image reflows once it arrives.
 * - **Shimmer.** The box carries a moving gradient behind the (transparent)
 *   not-yet-decoded image, then cross-fades to the real pixels.
 * - **Lazy by default.** Use `priority` for above-the-fold images (hero poster,
 *   logo) so they are fetched immediately instead of waiting for intersection.
 * - **Graceful failure.** A broken URL swaps in an inline placeholder rather than
 *   the browser's "torn page" glyph.
 */

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Intrinsic size — lets the browser reserve the box before the bytes arrive. */
  width?: number;
  height?: number;
  /** Above-the-fold image: fetch eagerly at high priority instead of lazily. */
  priority?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  onLoad?: () => void;
} & Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'className' | 'width' | 'height' | 'style' | 'sizes' | 'onLoad'
>;

/** Inline stand-in so a failed load never shows a broken-image glyph. */
const FALLBACK_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#1D140D"/>
      <rect x="1" y="1" width="398" height="598" fill="none" stroke="#4C3C2F" stroke-width="2"/>
      <g fill="none" stroke="#C89B5A" stroke-width="10" stroke-linecap="round" opacity="0.75">
        <path d="M200 250c-28-22-64-30-100-26v140c36-4 72 4 100 26"/>
        <path d="M200 250c28-22 64-30 100-26v140c-36-4-72 4-100 26"/>
        <path d="M200 250v140"/>
      </g>
    </svg>`
  );

export default function SmartImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  style,
  sizes,
  onLoad,
  ...rest
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <img
      src={status === 'error' ? FALLBACK_SRC : src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onLoad={() => {
        // The fallback is itself an <img> and fires onLoad too. Gate on the state
        // read here (an event handler, so the closure value is current): an error
        // must never flip back to 'loaded', or the broken URL would be restored,
        // re-fire onError, and spin forever.
        if (status !== 'loading') return;
        setStatus('loaded');
        onLoad?.();
      }}
      onError={() => setStatus('error')}
      style={style}
      className={`smart-img smart-img--${status} ${className}`.trim()}
      {...rest}
    />
  );
}
