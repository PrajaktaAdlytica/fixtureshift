import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MosaicIcon } from './MosaicIcon';
import { BrandMark, ButtonLink } from './Interface';
import sample from './sample.json';
import './cinema.css';

gsap.registerPlugin(ScrollTrigger);

const [derby] = sample.records;
const affected = derby.options[1].affectedFixtureIds;
const options = [
  { id: 'A', name: 'Calder Annex', time: 'Sun 18 Apr · 15:00', risk: 'Lower estimated risk', source: 'Regional venue bookings', version: 'v7', sourceId: 'FS-SRC-103', note: 'The Sunday slot at Calder Annex Pitch 2 is confirmed. Both teams pass the rest and travel checks.' },
  { id: 'B', name: 'West Foundry', time: 'Sat 17 Apr · 18:00', risk: 'Elevated estimated risk', source: 'Facility event request', version: 'v1', sourceId: 'FS-SRC-105', note: 'An uncommitted warm-up request overlaps this slot. Three other fixtures would move under this option.' },
];

const chapterShots = {
  products: { camera: { scale: 1.23, xPercent: 5, yPercent: -3 }, exit: { scale: 1.03, xPercent: -1, yPercent: 2 }, title: { x: -38, y: 24 }, cardX: 0, cardY: 40 },
  sectors: { camera: { scale: 1.10, xPercent: -4, yPercent: 1 }, exit: { scale: 1.23, xPercent: -5, yPercent: -3 }, title: { x: 40, y: 0 }, cardX: 48, cardY: 14 },
  pricing: { camera: { scale: 1.25, xPercent: 7, yPercent: -4 }, exit: { scale: 1.08, xPercent: 0, yPercent: 3 }, title: { x: -32, y: 17 }, cardX: 32, cardY: 31 },
  closing: { camera: { scale: 1.21, xPercent: 3, yPercent: -5 }, exit: { scale: 1.04, xPercent: 0, yPercent: 0 }, title: { x: -30, y: 26 }, cardX: 0, cardY: 22 },
};

function animateChapters(root, desktop) {
  root.querySelectorAll('[data-chapter]').forEach(section => {
    const shot = chapterShots[section.dataset.chapter];
    const art = section.querySelector('.chapter-art');
    const title = section.querySelector('[data-chapter-heading]');
    const cards = section.querySelectorAll('[data-chapter-card]');

    gsap.fromTo(art, shot.camera, {
      ...shot.exit, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: .65 },
    });
    gsap.fromTo(title, {
      x: desktop ? shot.title.x : 0, y: shot.title.y, opacity: .28, clipPath: 'inset(0% 0% 46% 0%)',
    }, {
      x: 0, y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)',
      scrollTrigger: { trigger: title, start: 'top 93%', end: 'top 59%', scrub: .45 },
    });
    cards.forEach((card, index) => {
      const even = index % 2 === 0;
      const delay = section.dataset.chapter === 'products' ? index * 0.04 : 0;
      gsap.from(card, {
        x: desktop ? (section.dataset.chapter === 'pricing' && even ? -shot.cardX : shot.cardX) : 0,
        y: shot.cardY, opacity: .32, delay,
        scrollTrigger: { trigger: card, start: 'top 94%', end: 'top 63%', scrub: .52 },
      });
    });
  });
}

function runwayDistance(runway) {
  return runway.offsetHeight - runway.firstElementChild.offsetHeight;
}

function useCinemaMotion(root, scrollDriver) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 900px)');
    const roomForHold = window.matchMedia('(min-width: 1100px) and (min-height: 760px)');
    let dispose = () => {};

    function configure() {
      dispose();
      if (!root.current || reduced.matches || document.documentElement.dataset.motion === 'off') return;
      const desktop = wide.matches;
      const holdDashboard = roomForHold.matches;
      const headerHeight = () => document.querySelector('.topbar')?.offsetHeight || 72;
      root.current.classList.add('has-cinematic-motion');
      root.current.classList.toggle('has-staged-console', holdDashboard);
      const lenis = desktop ? new Lenis({
        anchors: true, smoothWheel: true, wheelMultiplier: .78, lerp: .095,
        prevent: node => node.matches('.product-rail'),
      }) : null;
      scrollDriver.current = lenis;
      const tick = time => lenis?.raf(time * 1000);
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
      }

      const context = gsap.context(() => {
        const tween = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tween.from('.cine-hero-image', { scale: 1.09, duration: 1.9 }, 0)
          .from('.cine-title-line > span', { yPercent: 110, duration: .85, stagger: .10 }, .08)
          .from('.cine-hero-kicker, .cine-actions', { y: 21, opacity: .25, duration: .65, stagger: .1 }, .28)
          .from('.incident-card', { x: desktop ? 65 : 0, y: desktop ? 0 : 28, opacity: .18, duration: .85 }, .38);

        const opening = root.current.querySelector('.hero-runway');
        const camera = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: opening,
            start: () => 'top ' + headerHeight() + 'px',
            end: () => '+=' + runwayDistance(opening),
            scrub: .35,
          },
        });
        camera.to('.hero-camera', {
          scale: desktop ? 1.88 : 1.61, xPercent: -8, yPercent: 6, duration: .75, ease: 'sine.inOut',
        }, .06).to('.cine-headline, .replay-scroll, .hero-caption', {
          y: -27, opacity: 0, duration: .3, ease: 'sine.inOut',
        }, .13).to('.incident-card', { y: 28, opacity: 0, duration: .25, ease: 'sine.inOut' }, .24)
          .fromTo('.cine-cut-frame', { opacity: 0 }, { opacity: 1, duration: .25 }, .25)
          .fromTo('.camera-overhead', {
            scale: 1.24, xPercent: 5, yPercent: -3, clipPath: 'inset(0 0 0 100%)',
          }, {
            scale: 1, xPercent: 0, yPercent: 0, clipPath: 'inset(0 0 0 0%)', ease: 'sine.inOut', duration: .5,
          }, .39).to('.camera-origin-caption', { y: -12, opacity: 0, duration: .18 }, .52)
          .fromTo('.camera-atlas-caption', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .19 }, .7)
          .fromTo('.camera-progress', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

        gsap.fromTo('.atlas-image', { scale: 1, xPercent: 0, yPercent: 0 }, {
          scale: 1.1, xPercent: -2, yPercent: 1, ease: 'none',
          scrollTrigger: { trigger: '.cine-atlas', start: 'top 82%', end: 'bottom 28%', scrub: .8 },
        });
        if (desktop) {
          gsap.fromTo('.atlas-token-face', { xPercent: -48, yPercent: 60 }, {
            xPercent: 25, yPercent: -25, ease: 'none',
            scrollTrigger: { trigger: '.cine-atlas', start: 'top 55%', end: 'bottom 30%', scrub: .55 },
          });
        }
        const stage = root.current.querySelector('.console-hold');
        const consoleRunway = stage.parentElement;
        gsap.timeline({
          defaults: { ease: 'power2.out' },
          onUpdate() {
            const progress = this.progress();
            const beat = progress < .32 ? 'case' : progress < .67 ? 'compare' : 'evidence';
            if (stage.dataset.beat !== beat) stage.dataset.beat = beat;
          },
          scrollTrigger: {
            trigger: holdDashboard ? consoleRunway : stage,
            start: holdDashboard ? 'top 22%' : 'top 91%',
            end: holdDashboard ? () => '+=' + runwayDistance(consoleRunway) : 'bottom 38%',
            scrub: .32,
          },
        }).from('.console-case-title, .console-cases', {
          x: desktop ? -30 : 0, y: desktop ? 0 : 18, opacity: .32, stagger: .07, duration: .22,
        }, 0).from('.console-options button', {
          y: 23, opacity: .19, stagger: .08, duration: .26,
        }, .28).from('.console-impact', { y: 15, opacity: .24, duration: .19 }, .49)
          .from('.console-evidence', { x: desktop ? 32 : 0, y: desktop ? 0 : 18, opacity: .18, duration: .22 }, .67)
          .from('.console-document, .console-status', { y: 13, opacity: .4, duration: .16 }, .75)
          .to({}, { duration: .09 }, .91);
        gsap.utils.toArray('[data-reveal]').forEach(element => {
          const children = element.querySelectorAll('[data-shot]');
          gsap.from(children.length ? children : element, {
            y: 33, x: index => desktop ? (index % 2 ? 23 : -12) : 0, opacity: .7, stagger: .11, duration: .78,
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });
        animateChapters(root.current, desktop);
      }, root);
      dispose = () => {
        context.revert();
        scrollDriver.current = null;
        root.current?.classList.remove('has-cinematic-motion', 'has-staged-console');
        root.current?.querySelector('.console-hold')?.removeAttribute('data-beat');
        if (lenis) {
          gsap.ticker.remove(tick);
          lenis.destroy();
        }
      };
      ScrollTrigger.refresh();
    }
    configure();
    window.addEventListener('fixtureshift-motion', configure);
    reduced.addEventListener('change', configure);
    wide.addEventListener('change', configure);
    roomForHold.addEventListener('change', configure);
    return () => {
      dispose();
      window.removeEventListener('fixtureshift-motion', configure);
      reduced.removeEventListener('change', configure);
      wide.removeEventListener('change', configure);
      roomForHold.removeEventListener('change', configure);
    };
  }, [root, scrollDriver]);
}

function Origin({ scrollDriver }) {
  function followFixture(event) {
    const runway = event.currentTarget.closest('.hero-runway');
    if (runway.closest('.has-cinematic-motion')) {
      const top = runwayDistance(runway) * .34;
      if (scrollDriver.current) scrollDriver.current.scrollTo(top);
      else window.scrollTo({ top, behavior: 'smooth' });
    } else {
      document.getElementById('comparison')?.scrollIntoView();
    }
  }
  return <div className="hero-runway"><section className="cine-hero" id="opening">
    <div className="hero-camera"><img className="cine-hero-image" src="/assets/ceramic-hero.webp" alt="" fetchPriority="high" /></div>
    <div className="cinema-scrim" />
    <CameraPassage />
    <div className="wrap cine-opening">
      <div className="cine-headline">
        <p className="eyebrow cine-hero-kicker"><MosaicIcon name="pitch" size={16} /> Sports competition operations</p>
        <h1>{['Repair a published', 'fixture schedule', 'after a venue', 'falls through.'].map((text, index) =>
          <span className="cine-title-line" key={text}><span>{text}{index < 3 ? ' ' : ''}</span></span>)}</h1>
        <div className="actions cine-actions"><ButtonLink href="/demo">Run the fixture demo</ButtonLink><ButtonLink href="/pilot" secondary context="hero">Request a paid pilot</ButtonLink></div>
      </div>
      <div className="incident-card mosaic-hover">
        <div className="incident-top"><span className="mono">F-107</span><span className="incident-alert"><MosaicIcon name="close" size={15} />Venue unavailable</span></div>
        <div className="incident-body"><strong>Riverside Derby</strong><span><MosaicIcon name="calendar" size={16} />Sat 17 Apr · 15:00</span></div>
      </div>
      <button className="replay-scroll" type="button" onClick={followFixture}><MosaicIcon name="caret" size={16} />Follow the fixture</button>
    </div>
    <div className="hero-caption"><span>Riverside Ground</span><span>DEMO · SIMULATED DATA</span></div>
  </section></div>;
}

function CameraPassage() {
  return <div className="cine-cut-frame" aria-hidden="true">
    <img className="camera-overhead" src="/assets/ceramic-atlas.webp" alt="" />
    <div className="camera-shade" />
    <div className="wrap camera-captions">
      <span className="camera-origin-caption"><span className="mono">F-107</span> Riverside Ground</span>
      <span className="camera-atlas-caption"><span className="mono">F-107</span> Alternate venues</span>
    </div>
    <div className="camera-track"><span className="camera-progress" /></div>
  </div>;
}

function Atlas({ selected, setSelected }) {
  return <section className="cine-atlas" id="comparison">
    <div className="atlas-still">
      <img src="/assets/ceramic-atlas.webp" loading="lazy" className="atlas-image" alt="" />
      <div className="atlas-scrim" />
    </div>
    <div className="wrap atlas-content">
      <div className="atlas-copy" data-reveal>
        <p className="eyebrow" data-shot>Fixture comparison</p>
        <h2 data-shot>See what else<br />would move.</h2>
        <p data-shot>One lost venue can affect teams in three other fixtures. Compare the two workable options and follow the derby to its proposed slot.</p>
        <a className="atlas-next" href="#booking">Review the evidence <MosaicIcon name="caret" size={16} /></a>
      </div>
      <div className="atlas-map" aria-label="Venue comparison" data-reveal>
        <div className="atlas-map-head"><span className="mono">Greyhaven competition</span><span className="mono">Illustrated venues</span></div>
        <div className={'atlas-pins selected-' + selected.id}>
          <span className="map-point origin-point"><MosaicIcon name="close" size={19} /><span>Riverside Ground</span></span>
          <button className="map-point sunday-point" type="button" aria-pressed={selected.id === 'A'} onClick={() => setSelected(options[0])}><MosaicIcon name="venue" size={19} /><span>Calder Annex</span></button>
          <button className="map-point saturday-point" type="button" aria-pressed={selected.id === 'B'} onClick={() => setSelected(options[1])}><MosaicIcon name="venue" size={19} /><span>West Foundry</span></button>
          <span className="atlas-motion-token" aria-hidden="true"><span className="atlas-token-face mono">F-107</span></span>
        </div>
        <div className="atlas-scenarios" role="group" aria-label="Fixture options">
          {options.map(item => <button key={item.id} type="button" className="atlas-scenario" aria-pressed={selected.id === item.id} onClick={() => setSelected(item)}>
            <span>{item.name}</span><strong>{item.id === 'A' ? '0' : '3'}</strong><small>other fixtures move</small>
          </button>)}
        </div>
      </div>
    </div>
  </section>;
}

function Console({ selected, setSelected }) {
  const sunday = selected.id === 'A';
  return <section className="cine-workbench" id="booking">
    <div className="wrap">
      <div className="console-intro" data-reveal>
        <div data-shot><p className="eyebrow">Fixture Rescheduler</p><h2>Review the booking.</h2></div>
        <p data-shot>The decision stays with league staff. Check the source record and see what the change would affect.</p>
      </div>
      <a className="console-skip" href="#after-console">Skip dashboard reveal</a>
      <div className="console-runway"><div className="console-hold">
      <ol className="console-beats" aria-hidden="true">
        <li data-step="case">Case</li><li data-step="compare">Compare</li><li data-step="evidence">Evidence</li>
      </ol>
      <div className="frame-console">
        <div className="console-bar"><span className="console-product"><BrandMark /> Fixture Rescheduler</span><span className="mono">DEMO · SIMULATED DATA</span></div>
        <div className="console-main">
          <div className="console-cases">
            <span className="eyebrow">Case queue</span>
            <a className="current-case" href="/demo"><strong>Riverside Derby</strong><small>FS-027 · Pending review</small></a>
            <a href="/demo?case=FS-031"><strong>East Stand booking</strong><small>FS-031 · Confirmation needed</small></a>
          </div>
          <div className="console-body">
            <div className="console-case-title"><span className="console-case-id mono">F-107</span><h3>Riverside Derby</h3></div>
            <p>Calder Borough vs Westmere Athletic</p>
            <div className="console-options" role="group" aria-label="Review alternatives">
              {options.map(item => <button key={item.id} aria-pressed={selected.id === item.id} type="button" onClick={() => setSelected(item)}>
                <span>{item.time}</span><strong>{item.name}</strong><small>{item.risk}</small>
              </button>)}
            </div>
            <div className="console-impact" aria-live="polite">
              <span className="eyebrow">Additional fixture moves</span>
              <div>{affected.map(fixture => <span key={fixture} className={sunday ? 'is-stable' : 'is-affected'}>{fixture}<small>{sunday ? 'Keeps slot' : 'Moves'}</small></span>)}</div>
            </div>
          </div>
          <aside className="console-evidence" aria-label="Booking evidence" aria-live="polite">
            <span className="eyebrow">Source evidence</span>
            <span className="console-document"><MosaicIcon name="rules" size={23} /><span>{selected.source}<small>{selected.sourceId} · {selected.version}</small></span></span>
            <p>{selected.note}</p>
            <span className={sunday ? 'console-status' : 'console-status warning'}>{sunday ? <MosaicIcon name="check" size={18} /> : <MosaicIcon name="close" size={18} />} {sunday ? 'Booking confirmed' : 'Provisional hold'}</span>
            <ButtonLink href={sunday ? '/demo?evidence=1#case-workbench' : '/demo?option=B#case-workbench'}>Open the case</ButtonLink>
          </aside>
        </div>
      </div>
      </div>
      </div>
      <div id="after-console" tabIndex={-1} />
    </div>
  </section>;
}

export default function Cinema({ children }) {
  const root = useRef(null);
  const scrollDriver = useRef(null);
  const [selected, setSelected] = useState(options[0]);
  useCinemaMotion(root, scrollDriver);
  return <main id="main" className="cinema" ref={root}>
    <Origin scrollDriver={scrollDriver} />
    <Atlas selected={selected} setSelected={setSelected} />
    <Console selected={selected} setSelected={setSelected} />
    {children}
  </main>;
}
