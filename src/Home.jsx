import { useRef } from 'react';
import { ButtonLink, InsetLink, RecordCard } from './Interface';
import { MosaicIcon, routeIcons } from './MosaicIcon';
import { faq, products, solutions } from './content';
import Cinema from './Cinema';

export function ProductRail({ cinematic = false }) {
  const rail = useRef(null);
  function move(direction) {
    const track = rail.current;
    const card = track.firstElementChild;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap),
      behavior: document.documentElement.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <>
    <div className="section-heading"><div data-chapter-heading={cinematic ? '' : undefined}><p className="eyebrow">The platform</p><h2 id={cinematic ? 'product-heading' : undefined}>From setting the rules to publishing a change.</h2></div>
      <div className="rail-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous product"><MosaicIcon name="left" size={20} /></button><button type="button" onClick={() => move(1)} aria-label="Next product"><MosaicIcon name="arrow" size={20} /></button></div>
    </div>
    <div className="product-rail" ref={rail} aria-label="Product modules">
      {products.map((product, index) => <article className={'product-card mosaic-hover card-' + index} key={product.slug} data-chapter-card={cinematic ? '' : undefined}>
        <div className="offer-art" aria-hidden="true" />
        <RecordCard name={product.artifact} icon={routeIcons['/product/' + product.slug]} rows={product.rows} />
        <h3>{product.name}</h3><p>{product.intro}</p>
        <InsetLink href={'/product/' + product.slug}>Explore {product.name}</InsetLink>
      </article>)}
    </div>
  </>;
}

export function Scorecard() {
  return <RecordCard name="Evaluation scorecard" icon="check" rows={[
    ['Time to approve', 'Elapsed minutes'],
    ['Hard conflicts', 'Count per option'],
    ['Additional fixtures moved', 'Count outside the original match'],
  ]}><p className="muted">Agree the scoring and thresholds before the replay.</p></RecordCard>;
}

export function PricingCards({ cinematic = false }) {
  return <div className="pricing-grid">
    <article className="mosaic-hover" data-chapter-card={cinematic ? '' : undefined}><p className="eyebrow card-kicker"><MosaicIcon name="routes" />One competition</p><h3>Paid evaluation</h3><p className="price">Quoted</p><p>Replay historical cases, compare your current workflow and review the findings with your named reviewer.</p><ButtonLink href="/pilot" context="pricing">Discuss pilot scope</ButtonLink></article>
    <article className="mosaic-hover" data-chapter-card={cinematic ? '' : undefined}><p className="eyebrow card-kicker"><MosaicIcon name="calendar" />Active divisions and seasons</p><h3>Proposed annual license</h3><p className="price">$24,000 <small>/ year</small></p><p>Current price hypothesis. Final scope and quote depend on the competition, active divisions and seasons.</p><ButtonLink href="/pilot" context="pricing" secondary>Discuss licensing</ButtonLink></article>
  </div>;
}

function MosaicBackdrop({ src }) {
  return <div className="chapter-scene" aria-hidden="true">
    <img className="chapter-art" src={src} loading="lazy" alt="" />
  </div>;
}

function ProductChapter() {
  return <section className="mosaic-chapter product-chapter" id="products" aria-labelledby="product-heading" data-chapter="products">
    <MosaicBackdrop src="/assets/ceramic-products.webp" />
    <div className="wrap chapter-content">
      <ProductRail cinematic />
    </div>
  </section>;
}

function UseCaseChapter() {
  return <section className="mosaic-chapter use-case-chapter" id="use-cases" aria-labelledby="use-heading" data-chapter="sectors">
    <MosaicBackdrop src="/assets/ceramic-use-cases.webp" />
    <div className="wrap chapter-content use-chapter-content">
      <div className="use-chapter-reading">
        <div data-chapter-heading>
          <p className="eyebrow">Use cases</p><h2 id="use-heading">Built for competitions that share a calendar.</h2>
        </div>
        <div className="use-chapter-list">
          {solutions.map(item => <article className="mosaic-hover" key={item.slug} data-chapter-card>
            <h3 className="card-kicker"><MosaicIcon name={routeIcons['/solutions/' + item.slug]} size={23} />{item.name}</h3><p>{item.intro}</p>
            <InsetLink href={'/solutions/' + item.slug}>Explore {item.name.toLowerCase()}</InsetLink>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

function PricingChapter() {
  return <section className="mosaic-chapter pricing-chapter" id="pricing" aria-labelledby="pricing-heading" data-chapter="pricing">
    <MosaicBackdrop src="/assets/ceramic-pricing.webp" />
    <div className="wrap chapter-content">
      <div className="chapter-pricing-title" data-chapter-heading><p className="eyebrow">Pricing</p><h2 id="pricing-heading">Scope an evaluation and an annual license.</h2></div>
      <PricingCards cinematic />
    </div>
  </section>;
}

export default function Home() {
  return <Cinema>
    <section className="slice wrap decision-slice" data-reveal>
      <div className="section-heading" data-shot><div><p className="eyebrow">The decision process</p><h2>Check the rules.<br />Review the risk.</h2></div><p>A constraint solver checks recorded venue, rest and travel rules. The proposed AI model ranks feasible options by risk of further disruption. League staff keep the final decision.</p></div>
      <div className="process-grid" data-shot>
        <RecordCard name="Check feasibility" rows={[['Venue booking', 'Confirmed'], ['Rest and travel', 'Rules pass']]} />
        <RecordCard name="Compare risk" rows={[['Calder Annex', 'Lower estimated risk'], ['West Foundry', 'Provisional warm-up hold']]} />
        <RecordCard name="Record the decision" rows={[['Reviewer', 'Competition Review Lead'], ['Publication', 'League approval']]} />
      </div>
    </section>
    <ProductChapter />
    <UseCaseChapter />
    <section className="slice band pilot-slice"><div className="wrap split" data-reveal>
      <div><p className="eyebrow">Paid pilot</p><h2>Replay one competition.</h2><p>Compare the proposed workflow with your current process across 40 past disruptions. Bring fixture snapshots, venue bookings and the rules that applied at the time.</p><ButtonLink href="/pilot" context="homepage-scorecard">Request a paid pilot</ButtonLink></div><Scorecard />
    </div></section>
    <PricingChapter />
    <section className="slice band"><div className="wrap split">
      <div><p className="eyebrow">Product feedback</p><h2>Would this fit your league?</h2><p>Run the fictional case, then tell us which decisions still need a call and how your current workflow handles them.</p><InsetLink href="/contact">Share feedback</InsetLink></div>
      <RecordCard name="East Stand booking · DEMO" rows={[['State', 'Awaiting venue confirmation'], ['Reviewer', 'Competition Review Lead'], ['Next step', 'Request venue acknowledgement']]}><InsetLink href="/demo?case=FS-031">See the open case</InsetLink></RecordCard>
    </div></section>
    <section className="slice wrap split" data-reveal><div><p className="eyebrow">FAQ</p><h2>Before you bring a case.</h2></div><div className="faq">{faq.map(([q, a], index) => <details key={q} open={index === 0 ? true : undefined}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
    <Closing cinematic />
  </Cinema>;
}

export function Closing({ cinematic = false }) {
  return <section id={cinematic ? 'closing' : undefined} className={cinematic ? 'closing mosaic-chapter closing-chapter' : 'closing'} data-chapter={cinematic ? 'closing' : undefined} aria-labelledby="closing-heading">
    {cinematic ? <MosaicBackdrop src="/assets/ceramic-finale.webp" /> : <img src="/assets/ceramic-finale.webp" loading="lazy" alt="" width="1600" height="900" />}
    <div className="wrap closing-content">
      <div data-chapter-heading={cinematic ? '' : undefined}><h2 id="closing-heading">Bring one past disruption.</h2><p>Tell us how you repair fixtures today and who can authorize records for an evaluation.</p></div>
      <div className="actions" data-chapter-card={cinematic ? '' : undefined}><ButtonLink href="/pilot" context="closing">Request a paid pilot</ButtonLink><ButtonLink href="/request-demo" secondary>Request a guided demo</ButtonLink></div>
    </div>
  </section>;
}
