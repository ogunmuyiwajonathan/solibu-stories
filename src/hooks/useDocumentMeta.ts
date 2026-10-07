import { useEffect } from 'react';

const DEFAULT_TITLE = 'Solibu Stories';
const DEFAULT_DESCRIPTION =
  'Explore a curated library of captivating stories. Read online, track your progress, and discover your next adventure.';

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
