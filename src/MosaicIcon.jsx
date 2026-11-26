import { mosaicTiles } from './mosaic-icon-shapes';

export const routeIcons = {
  '/': 'pitch', '/platform': 'pitch', '/solutions': 'map', '/demo': 'play', '/demo/account': 'people',
  '/product/scheduling-rules': 'rules', '/product/season-builder': 'calendar',
  '/product/fixture-rescheduler': 'routes', '/product/schedule-publishing': 'publish',
  '/solutions/national-federations': 'network', '/solutions/multi-division-leagues': 'calendar',
  '/solutions/shared-venues': 'venue', '/pricing': 'price', '/pilot': 'routes', '/request-demo': 'play',
  '/contact': 'mail', '/about': 'people', '/trust': 'shield', '/privacy': 'access', '/terms': 'rules',
  '/sources': 'archive', '/sign-in': 'access',
};

export function MosaicIcon({ name = 'pitch', size = 18 }) {
  return <svg className="mosaic-icon" aria-hidden="true" focusable="false" viewBox="0 0 28 28" width={size} height={size}>
    {mosaicTiles(name).map(tile => <rect key={tile.index} className={tile.accent ? 'accent' : undefined}
      x={tile.x} y={tile.y} width="3.2" height="3.2" rx=".48" />)}
  </svg>;
}
