import { useEffect, useId, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MosaicIcon } from './MosaicIcon';
import { getScene } from './mosaic-scenes';

gsap.registerPlugin(ScrollTrigger);

const cameraMoves = {
  down: { from: { scale: 1.14, xPercent: 2, yPercent: -3 }, to: { scale: 1.08, xPercent: -2, yPercent: 4 }, y: -20, x: 0, tileOrigin: 'start', tileAxis: 'y' },
  pan: { from: { scale: 1.10, xPercent: 4 }, to: { scale: 1.10, xPercent: -4 }, y: 12, x: -30, tileOrigin: 'end', tileAxis: 'x' },
  push: { from: { scale: 1.02, xPercent: 0 }, to: { scale: 1.22, xPercent: -3, yPercent: 4 }, y: 28, x: 0, tileOrigin: 'center' },
  recede: { from: { scale: 1.20, xPercent: 4, yPercent: -3 }, to: { scale: 1.03, xPercent: 0, yPercent: 0 }, y: 16, x: 24, tileOrigin: 'edges' },
};

const pitch = 'M78 68H342V192H78ZM210 68V192M78 104H117V156H78M342 104H303V156H342M227 130a17 17 0 1 1-34 0a17 17 0 1 1 34 0';
const maps = {
  survey: [pitch + 'M54 68V192M43 80H65M43 180H65M78 45H342M92 36V54M328 36V54', 'M117 156H178V192', [[117,156],[178,192],[342,68]]],
  grid: ['M64 64H356V192H64ZM64 106H356M64 149H356M128 64V192M192 64V192M256 64V192M320 64V192', 'M160 85H224V128H288V170H337', [[160,85],[224,128],[288,170],[337,170]]],
  branch: ['M73 129H164L243 70H348M164 129L243 188H348', 'M73 129H164L243 70H348', [[73,129],[164,129],[348,70],[348,188]]],
  workbench: [pitch + 'M117 156L174 206H248L304 156M117 156L174 96H248L304 156', 'M117 156L174 96H248L304 156', [[117,156],[174,96],[248,96],[304,156],[248,206]]],
  walkthrough: ['M83 94H164V165H255V94H337M83 74H337M83 185H337', 'M83 94H164V165H255V94H337', [[83,94],[164,94],[255,165],[337,94]]],
  inbox: ['M89 78H331V180H89ZM89 78L210 151L331 78M89 180L170 126M331 180L250 126', 'M89 78L210 151L331 78', [[89,78],[210,151],[331,78]]],
  boundary: ['M110 58H310V205H110ZM140 83H280V180H140ZM170 108H250V157H170Z', 'M110 58H310V205H110Z', [[110,58],[310,205],[210,132]]],
  account: ['M103 75H316V179H103ZM193 75V179M211 108H290M211 145H290M126 154H171M161 114a12 12 0 1 1-24 0a12 12 0 1 1 24 0', 'M211 108H290M211 145H278', [[149,114],[290,108],[278,145]]],
  relays: ['M64 128H360M100 128V94H146M274 128V162H320', 'M64 128H210H360', [[64,128],[146,94],[210,128],[320,162],[360,128]]],
  network: ['M75 99L190 130L168 45M190 130L137 205M190 130L312 58M190 130L346 175M312 58L346 175', 'M75 99L190 130L346 175', [[75,99],[168,45],[137,205],[190,130],[312,58],[346,175]]],
  lanes: ['M61 68H350M61 128H350M61 190H350M102 68V190M208 68V190M313 68V190', 'M102 68H208V128H313V190', [[102,68],[208,68],[208,128],[313,128],[313,190]]],
  venue: ['M67 94H155V154H67ZM168 94H256V154H168ZM269 94H357V154H269ZM109 176H315', 'M168 94H256V154H168Z', [[109,124],[212,124],[315,124]]],
  center: ['M209 33V226M112 129H306M296 129a87 87 0 1 1-174 0a87 87 0 1 1 174 0M266 129a57 57 0 1 1-114 0a57 57 0 1 1 114 0', 'M209 129H296', [[209,129],[266,129],[296,129]]],
  replay: ['M76 90H339M76 164H339M122 62V193M211 62V193M300 62V193', 'M76 90H122V164H300V90H339', [[76,90],[122,164],[211,164],[300,90],[339,90]]],
  gate: ['M102 175V72H313V175M131 175V97H284V175M159 175V122H256V175M60 175H358', 'M209 204V146H257', [[209,204],[209,146],[257,146]]],
  field: [pitch, 'M78 192H342', [[78,192],[210,192],[342,192]]],
  ledger: ['M85 69H335V190H85ZM85 109H335M85 149H335M149 69V190M257 69V190', 'M106 89H130M169 129H242M280 169H313', [[118,89],[207,129],[296,169]]],
  pages: ['M92 73H209L228 88H324V186H215L194 171H92ZM209 73L215 186M111 109H179M111 129H186M244 116H304M244 137H304', 'M194 171L215 186H324', [[92,73],[215,186],[324,186]]],
  compass: ['M210 49L285 129L210 209L135 129ZM210 69V189M153 129H267', 'M210 49L225 129L210 209L195 129Z', [[210,49],[135,129],[210,129],[285,129],[210,209]]],
};

const mapWipe = Array.from({ length: 12 }, (_, i) => i);

export function SceneDiagram({ motif, className = '' }) {
  const id = useId();
  const [outline, highlight, points] = maps[motif];
  return <svg className={'scene-diagram ' + className} viewBox="0 0 420 255" aria-hidden="true" focusable="false">
    <defs><pattern id={id} width="11" height="11" patternUnits="userSpaceOnUse"><rect width="9.5" height="9.5" rx="1" fill="currentColor" opacity=".17" /></pattern></defs>
    <rect x="30" y="26" width="360" height="203" fill={'url(#' + id + ')'} />
    <path d={outline} fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".68" />
    <path d={highlight} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="7 3" opacity=".95" />
    {points.map(([x, y], index) => <g key={x + ':' + y}><rect x={x - 8} y={y - 8} width="16" height="16" rx="2" fill="currentColor" opacity={index === 0 ? 1 : .85} /><rect x={x - 3} y={y - 3} width="6" height="6" rx="1" fill="#202918" /></g>)}
  </svg>;
}

export function MosaicPage({ path, compact = false, className = '', eyebrow, title, intro, actions, children }) {
  const root = useRef(null);
  const scene = getScene(path);

  useEffect(() => {
    const page = root.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const wide = matchMedia('(min-width: 900px)');
    let dispose = () => {};
    const fragment = location.hash.slice(1);
    const firstPaint = fragment ? requestAnimationFrame(() => {
      page.querySelector('#' + CSS.escape(fragment))?.scrollIntoView();
    }) : null;

    function configure() {
      dispose();
      if (reduced.matches || document.documentElement.dataset.motion === 'off') return;

      const desktop = wide.matches;
      const lenis = desktop ? new Lenis({ anchors: true, smoothWheel: true, lerp: .14, prevent: node => node.matches('.product-rail, .impact-table') }) : null;
      const tick = time => lenis?.raf(time * 1000);
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
      }
      const layout = gsap.context(() => {
        const introNodes = page.querySelectorAll('[data-scene-intro]');
        const coverTiles = page.querySelectorAll('.scene-wipe span');
        const hero = page.querySelector('.scene-hero');
        const shot = cameraMoves[scene.camera];
        gsap.from(introNodes, { x: desktop ? shot.x : 0, y: shot.y, opacity: .55, stagger: .085, duration: .64, ease: 'power2.out' });
        gsap.fromTo(coverTiles, { opacity: .9 }, {
          opacity: 0, yPercent: -11, duration: .65, ease: 'power2.out',
          stagger: { grid: [3, 4], axis: shot.tileAxis, amount: .48, from: shot.tileOrigin },
        });
        gsap.fromTo('.scene-image', shot.from, {
          ...shot.to, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 18%', scrub: .55 },
        });
        page.querySelectorAll('[data-scene-panel]').forEach(panel => {
          const direction = panel.dataset.scenePanel;
          gsap.from(panel, {
            x: desktop ? direction === 'left' ? -24 : direction === 'right' ? 24 : 0 : 0,
            y: 24, opacity: .58, duration: .7, ease: 'power2.out',
            scrollTrigger: { trigger: panel, start: 'top 94%', once: true },
          });
        });
      }, page);
      dispose = () => {
        layout.revert();
        if (lenis) {
          gsap.ticker.remove(tick);
          lenis.destroy();
        }
      };
      ScrollTrigger.refresh();
    }

    configure();
    reduced.addEventListener('change', configure);
    wide.addEventListener('change', configure);
    window.addEventListener('fixtureshift-motion', configure);
    return () => {
      if (firstPaint !== null) cancelAnimationFrame(firstPaint);
      reduced.removeEventListener('change', configure);
      wide.removeEventListener('change', configure);
      window.removeEventListener('fixtureshift-motion', configure);
      dispose();
    };
  }, [scene.camera]);

  return <main id="main" ref={root} className={'mosaic-page' + (compact ? ' compact' : '') + ' ' + className}
    style={{ '--scene-accent': scene.accent }} data-scene={scene.motif} data-camera={scene.camera}>
    <section className="scene-hero" aria-labelledby="scene-title">
      <div className="scene-backdrop" aria-hidden="true">
        <img className="scene-image" src={'/assets/' + scene.file + '.webp'} alt="" fetchPriority="high" width="1024" height="750" />
        <div className="scene-wipe">{mapWipe.map(i => <span key={i} />)}</div>
      </div>
      <div className="wrap scene-layout">
        <div className="scene-copy">
          <p className="eyebrow scene-kicker" data-scene-intro><MosaicIcon name={scene.icon} size={23} />{eyebrow}</p>
          <h1 id="scene-title" data-scene-intro>{title}</h1>
          {intro && <p className="lede" data-scene-intro>{intro}</p>}
          {actions && <div className="actions" data-scene-intro>{actions}</div>}
        </div>
        <figure className="scene-plate" data-scene-intro>
          <SceneDiagram motif={scene.motif} />
          <figcaption><span>{scene.caption}</span>{scene.annotation && <small>{scene.annotation}</small>}</figcaption>
        </figure>
      </div>
    </section>
    {children}
  </main>;
}
