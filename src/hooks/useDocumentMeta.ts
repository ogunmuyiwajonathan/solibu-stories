import { useEffect } from 'react';

const DEFAULT_TITLE = 'Solibu Stories';
const DEFAULT_DESCRIPTION =
  'Explore a curated library of captivating stories. Read online, track your progress, and discover your next adventure.';

/**
 * Points `<link rel="canonical">` and `og:url` at the route currently displayed.
 *
 * index.html serves every route, so a canonical baked into it would claim that
 * `/library` and every `/book/:id` are duplicates of the homepage — telling
 * search engines to fold those pages into `/`, which directly contradicts the
 * sitemap that lists them as distinct. A wrong canonical is worse than none, so
 * the tag is created here rather than hardcoded.
 *
 * Query params are dropped so tracking links canonicalise to the clean URL.
 */
function setCanonicalUrl() {
  const url = `${window.location.origin}${window.location.pathname}`;

  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);

  let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', url);
}

/**
 * Sets the tab title and meta description for the current page, then restores
 * the site defaults on unmount so a stale title never leaks onto the next route.
 *
 * Without this every tab read "Solibu Stories", which gives search engines and
 * tab-switchers no signal about which page is open.
 *
 * Pass only a title (`useDocumentMeta('Library')`) to leave the description alone.
 */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    if (title) document.title = `${title} | ${DEFAULT_TITLE}`;
    setCanonicalUrl();
    // Only touch the description when one is supplied, so a page that sets just a
    // title does not silently blank out the description inherited from index.html.
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      if (description) {
        const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        tag?.setAttribute('content', DEFAULT_DESCRIPTION);
      }
    };
  }, [title, description]);
}

export default useDocumentMeta;
