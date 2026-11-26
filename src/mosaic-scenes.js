const scenes = {
  '/product/scheduling-rules': ['rules', 'ceramic-rules', 'survey', 'Plan view', 'Venue limits, travel windows and rest rules', '#d6b168', 'down'],
  '/product/season-builder': ['calendar', 'ceramic-season', 'grid', 'Season grid', 'Divisions, grounds and fixture slots', '#dfaa66', 'pan'],
  '/product/fixture-rescheduler': ['routes', 'ceramic-repair', 'branch', 'Disruption map', 'One postponed fixture, two possible routes', '#e6a275', 'push'],
  '/product/schedule-publishing': ['publish', 'ceramic-publish', 'relays', 'Release path', 'League approval and the revised notice', '#f1bd73', 'recede'],
  '/demo': ['play', 'ceramic-workbench', 'workbench', 'Riverside Derby · F-107', 'The original slot and the replacement routes', '#ebaf66', 'push'],
  '/demo/account': ['people', 'ceramic-operations', 'account', 'Evaluation account', 'Buyer, operator and reviewer', '#e3b784', 'recede'],
  '/platform': ['pitch', 'ceramic-products', 'survey', 'Competition record', 'From the rules through release', '#deb578', 'pan'],
  '/solutions': ['map', 'ceramic-use-cases', 'network', 'Regional grounds', 'Federations, leagues and venue operators', '#e8be77', 'down'],
  '/solutions/national-federations': ['network', 'ceramic-federation', 'network', 'Regional network', 'Regional records under one competition ruleset', '#dfbf79', 'recede'],
  '/solutions/multi-division-leagues': ['calendar', 'ceramic-divisions', 'lanes', 'Shared competition calendar', 'Three divisions sharing the venue grid', '#e6af6d', 'down'],
  '/solutions/shared-venues': ['venue', 'ceramic-shared', 'venue', 'Facility bookings', 'Unavailable, confirmed and provisional', '#edc48a', 'pan'],
  '/pricing': ['price', 'ceramic-pricing', 'center', 'Evaluation scope', 'One competition or an annual license', '#efbc71', 'recede'],
  '/pilot': ['routes', 'ceramic-pilot', 'replay', 'Pilot replay', 'Historical cases and the comparison protocol', '#ebba7a', 'down'],
  '/request-demo': ['play', 'ceramic-guided', 'walkthrough', 'Guided walkthrough', 'The fixture, alternatives and source evidence', '#e6ae87', 'push'],
  '/contact': ['mail', 'ceramic-contact', 'inbox', 'Operations desk', 'Fixture operations, partnerships and feedback', '#edbf89', 'pan'],
  '/sign-in': ['access', 'ceramic-access', 'gate', 'Workspace access', 'Sample competition workspace', '#eac57f', 'recede'],
  '/about': ['people', 'ceramic-about', 'field', 'Competition operations', 'For the teams behind the published schedule', '#f3c58a', 'pan'],
  '/trust': ['shield', 'ceramic-archives', 'ledger', 'Decision trail', 'Source versions, open questions and approvals', '#e2bd83', 'push'],
  '/privacy': ['access', 'ceramic-privacy', 'boundary', 'Preview boundary', 'Browser-only forms and generic usage events', '#eac583', 'down'],
  '/terms': ['rules', 'ceramic-terms', 'pages', 'Preview terms', 'Illustrative records and league authority', '#e5af7e', 'recede'],
  '/sources': ['archive', 'ceramic-sources', 'compass', 'Research sources', 'Market references and fixture change examples', '#e9b775', 'pan'],
  missing: ['venue', 'ceramic-finale', 'field', 'Fixtures and grounds', '', '#ecc48d', 'recede'],
};

export function getScene(path) {
  const [icon, file, motif, caption, annotation, accent, camera] = scenes[path] || scenes.missing;
  return { icon, file, motif, caption, annotation, accent, camera };
}
