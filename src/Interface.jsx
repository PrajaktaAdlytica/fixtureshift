import { useEffect, useState } from 'react';
import { products, solutions } from './content';
import { MosaicIcon, routeIcons } from './MosaicIcon';

const allowedEvents = new Set(['offer_view', 'demo_start', 'reviewer_interaction', 'pilot_cta', 'qualified_request', 'guided_demo_request']);

export function track(event, context) {
  if (!allowedEvents.has(event)) return;
  try {
    const history = JSON.parse(sessionStorage.getItem('fixtureshift-events') || '[]');
    const entry = { event, context, time: new Date().toISOString() };
    sessionStorage.setItem('fixtureshift-events', JSON.stringify([...history.slice(-99), entry]));
  } catch {
    // Browsing and form interactions remain available if storage is unavailable.
  }
}

export function ButtonLink({ href, children, secondary = false, context = 'navigation', current }) {
  return (
    <a className={secondary ? 'text-link' : 'button'} href={href} aria-current={current}
      onClick={href === '/pilot' ? () => track('pilot_cta', context) : undefined}>
      {children}<MosaicIcon name={href === '/demo' ? 'play' : 'arrow'} size={16} />
    </a>
  );
}

function Brand() {
  return <a className="brand" href="/" aria-label="FixtureShift home">
    <img src="/assets/brand/lockup-forest.svg" alt="" width="391" height="100" />
  </a>;
}

export function BrandMark({ size = 25 }) {
  return <img className="brand-mark" src="/assets/brand/mark-compact-forest.svg" alt="" width={size} height={size} />;
}

function Menu({ title, icon, feature, items, path }) {
  const [headline, description, href, art] = feature;
  const current = path === href || items.some(([, target]) => target === path);
  return <details className="nav-group">
    <summary className="nav-control" data-current={current || undefined}><MosaicIcon name={icon} size={17} />{title}<MosaicIcon name="caret" size={12} /></summary>
    <div className="menu-popover" data-lenis-prevent>
      <a className="menu-feature mosaic-hover" href={href} aria-current={path === href ? 'page' : undefined} style={{ '--menu-art': 'url(/assets/' + art + '.webp)' }}>
        <MosaicIcon name={icon} size={26} /><span><strong>{headline}</strong><small>{description}</small></span>
      </a>
      <ul className="menu-link-list">{items.map(([text, target, detail]) => <li key={target}>
        <a href={target} aria-current={path === target ? 'page' : undefined}>
          <span className="nav-icon-plate"><MosaicIcon name={routeIcons[target]} /></span>
          <span><strong>{text}</strong><small>{detail}</small></span>
          <MosaicIcon name="arrow" size={15} />
        </a>
      </li>)}</ul>
    </div>
  </details>;
}

const nav = [
  { title: 'Platform', icon: 'pitch', feature: ['Platform overview', 'From the competition rules to the published fixture.', '/platform', 'ceramic-products'],
    items: products.map((item, index) => [item.name, '/product/' + item.slug, ['Venue, rest and travel limits', 'Fixture lists across divisions', 'Compare changes and their impact', 'Approval and revised notices'][index]]) },
  { title: 'Use cases', icon: 'map', feature: ['All use cases', 'Scheduling decisions across shared grounds.', '/solutions', 'ceramic-use-cases'],
    items: solutions.map((item, index) => [item.name, '/solutions/' + item.slug, ['Rules across regions', 'Knock-on changes across divisions', 'Booking evidence and provisional holds'][index]]) },
  { title: 'Resources', icon: 'archive', feature: ['Guided demo', 'Talk through a past disruption with us.', '/request-demo', 'ceramic-atlas'],
    items: [['Paid pilot', '/pilot', 'Replay one competition'], ['Trust and data', '/trust', 'Evidence, approval and permissions'], ['Research sources', '/sources', 'Market and fixture references'], ['About', '/about', 'The people and workflow behind the idea'], ['Contact', '/contact', 'Operations, partnerships and feedback']] },
];

export function Header({ path }) {
  const [open, setOpen] = useState(false);
  const [motion, setMotion] = useState(() => {
    try { return sessionStorage.getItem('fixtureshift-motion') !== 'off'; } catch { return true; }
  });
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
    window.dispatchEvent(new Event('fixtureshift-motion'));
    try { sessionStorage.setItem('fixtureshift-motion', motion ? 'on' : 'off'); } catch { /* optional setting */ }
  }, [motion]);
  useEffect(() => {
    function dismiss(event) {
      if (event.key === 'Escape') {
        const active = document.activeElement?.closest('details[open]');
        document.querySelectorAll('.nav-group[open]').forEach(element => { element.open = false; });
        if (active) active.querySelector('summary')?.focus();
        else if (open) {
          setOpen(false);
          document.querySelector('.menu-toggle')?.focus();
        }
      }
      if (event.type === 'click') {
        document.querySelectorAll('.nav-group[open]').forEach(element => {
          if (!element.contains(event.target)) element.open = false;
        });
      }
    }
    document.addEventListener('keydown', dismiss);
    document.addEventListener('click', dismiss);
    return () => {
      document.removeEventListener('keydown', dismiss);
      document.removeEventListener('click', dismiss);
    };
  }, [open]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="topbar">
      <div className="nav-inner">
        <Brand />
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          <MosaicIcon name={open ? 'close' : 'menu'} size={22} />
        </button>
        <nav id="site-nav" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main" data-lenis-prevent>
          <div className="nav-primary">
            {nav.map(menu => <Menu key={menu.title} {...menu} path={path} />)}
            <a className="nav-control" href="/pricing" aria-current={path === '/pricing' ? 'page' : undefined}><MosaicIcon name="price" size={17} />Pricing</a>
          </div>
          <div className="nav-actions">
            <a className="nav-control sign-in" href="/sign-in" aria-current={path === '/sign-in' ? 'page' : undefined}><MosaicIcon name="access" size={16} />Sign in</a>
            <ButtonLink href="/demo" current={path === '/demo' ? 'page' : undefined}>Run the fixture demo</ButtonLink>
          </div>
        </nav>
      </div>
    </header>
    <button className="motion-toggle" type="button" onClick={() => setMotion(!motion)} aria-pressed={!motion}><MosaicIcon name="motion" size={16} />Reduce motion</button>
  </>;
}

export function Footer({ path }) {
  const columns = [
    ['Product', 'pitch', [['Platform', '/platform'], ...products.map(p => [p.name, '/product/' + p.slug])]],
    ['Use cases', 'map', [['All use cases', '/solutions'], ...solutions.map(s => [s.name, '/solutions/' + s.slug])]],
    ['Evaluation', 'play', [['Fixture demo', '/demo'], ['Paid pilot', '/pilot'], ['Pricing', '/pricing'], ['Guided demo', '/request-demo']]],
    ['Company', 'people', [['About', '/about'], ['Contact', '/contact'], ['Trust and data', '/trust'], ['Research sources', '/sources']]],
  ];
  return <footer className="footer"><div className="wrap">
    <div className="footer-brand"><Brand /><p>Sports competition operations</p></div>
    <div className="footer-grid">{columns.map(([title, icon, links]) => <div key={title}>
      <h2><MosaicIcon name={icon} size={21} />{title}</h2>{links.map(([label, href]) => <a href={href} key={href} aria-current={path === href ? 'page' : undefined}><MosaicIcon name={routeIcons[href]} size={14} />{label}</a>)}
    </div>)}</div>
    <div className="footer-bottom"><p>FixtureShift</p><a href="/privacy" aria-current={path === '/privacy' ? 'page' : undefined}><MosaicIcon name="access" size={15} />Privacy</a><a href="/terms" aria-current={path === '/terms' ? 'page' : undefined}><MosaicIcon name="rules" size={15} />Preview terms</a></div>
  </div></footer>;
}

export function RecordCard({ name, rows, icon = 'rules', children }) {
  return <div className="record-card mosaic-hover">
    <div className="record-title"><MosaicIcon name={icon} size={20} /><strong>{name}</strong></div>
    <dl>{rows.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
    {children}
  </div>;
}

export function Check({ children }) {
  return <span className="check"><MosaicIcon name="check" />{children}</span>;
}

export function InsetLink({ href, children }) {
  return <a className="inset-link" href={href}>{children}<MosaicIcon name="arrow" size={17} /></a>;
}
