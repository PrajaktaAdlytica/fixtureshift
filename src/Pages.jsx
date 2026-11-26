import { useEffect, useState } from 'react';
import { ButtonLink, InsetLink, RecordCard, track } from './Interface';
import { PricingCards, ProductRail, Scorecard } from './Home';
import { MosaicPage } from './MosaicPage';
import { MosaicIcon, routeIcons } from './MosaicIcon';
import { products, solutions, sources } from './content';

export function Detail({ item, family }) {
  const prefix = family === 'Product' ? '/product/' : '/solutions/';
  const path = prefix + item.slug;
  useEffect(() => {
    if (family === 'Product') track('offer_view', item.slug);
  }, [family, item.slug]);
  const related = (family === 'Product' ? products : solutions).filter(peer => peer.slug !== item.slug);
  return <MosaicPage path={path} eyebrow={item.name} title={item.title} intro={item.intro} actions={<>
    <ButtonLink href="/demo">Run the fixture demo</ButtonLink><ButtonLink href="/pilot" context={family.toLowerCase()} secondary>Request a paid pilot</ButtonLink>
  </>}>
    <div className="wrap scene-body place-detail">
      <div className="detail-editorial">
        {item.sections.map(([title, copy], index) => <section key={title} data-scene-panel={index % 2 ? 'right' : 'left'}>
          <span className="editorial-icon"><MosaicIcon name={index ? 'check' : routeIcons[path]} size={23} /></span>
          <div><h2>{title}</h2><p>{copy}</p></div>
        </section>)}
      </div>
      <aside className="scene-record" data-scene-panel="right">
        <RecordCard name={item.artifact} icon={routeIcons[path]} rows={item.rows}><p className="mono muted">DEMO · SIMULATED DATA</p><InsetLink href="/demo">Inspect the fictional case</InsetLink></RecordCard>
      </aside>
    </div>
    <section className="related-scene"><div className="wrap" data-scene-panel="up">
      <h2>{family === 'Product' ? 'Explore the platform' : 'Explore related use cases'}</h2>
      <div className="related-grid">{related.map(peer => <InsetLink key={peer.slug} href={prefix + peer.slug}>{peer.name}</InsetLink>)}</div>
    </div></section>
  </MosaicPage>;
}

export function Directory({ kind }) {
  const platform = kind === 'platform';
  return <MosaicPage path={'/' + kind} eyebrow={platform ? 'Platform' : 'Use cases'}
    title={platform ? 'One competition record, from rules to release.' : 'Find the decision your team needs to make.'}
    intro={platform ? 'Set competition rules, build a season and retain the evidence behind each approved change.' : 'Start with what you need to decide when a fixture cannot go ahead.'}
    actions={<ButtonLink href="/demo">Run the fixture demo</ButtonLink>}>
    <section className="wrap scene-body" data-scene-panel="up">{platform ? <ProductRail /> : <div className="use-grid">{solutions.map(item => <article className="scene-use-card mosaic-hover" key={item.slug}>
      <RecordCard name={item.artifact} icon={routeIcons['/solutions/' + item.slug]} rows={item.rows} /><h2>{item.name}</h2><p>{item.intro}</p><InsetLink href={'/solutions/' + item.slug}>Explore use case</InsetLink></article>)}</div>}</section>
  </MosaicPage>;
}

export function Pricing() {
  return <MosaicPage path="/pricing" eyebrow="Pricing" title="Scope an evaluation and an annual license." intro="Start with one competition. Agree what the evaluation will cost and what would make an annual license worthwhile."
    actions={<ButtonLink href="#offers">Compare evaluation and licensing</ButtonLink>}>
    <section className="wrap scene-body" id="offers" data-scene-panel="up"><PricingCards /></section>
  </MosaicPage>;
}

const formCopy = {
  pilot: ['Paid pilot', 'Replay the disruptions your team has already handled.', 'Compare Fixture Rescheduler with your current repair workflow on 40 prior disruptions.', 'Preview paid evaluation request'],
  'request-demo': ['Guided demo', 'Talk through a fixture change with us.', 'Describe what happens when your league needs to change a published fixture.', 'Preview walkthrough request'],
  contact: ['Contact', 'Talk to FixtureShift.', 'For fixture operations, partnerships, privacy questions or feedback on the example.', 'Preview message'],
  'sign-in': ['Workspace access', 'Open your competition workspace.', 'Workspace access is being evaluated. A sample competition is available to explore.', 'Preview access request'],
};

function Select({ label, name, options }) {
  return <label>{label}<select name={name} required defaultValue=""><option value="" disabled>Select an option</option>{options.map(item => <option key={item}>{item}</option>)}</select></label>;
}

export function FormPage({ type }) {
  const [result, setResult] = useState(null);
  const [dataPermission, setDataPermission] = useState('');
  const [eyebrow, title, intro, action] = formCopy[type];
  const isPilot = type === 'pilot';
  const isAccess = type === 'sign-in';
  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const followUp = fields.get('followup') === 'yes';
    if (isPilot) track('qualified_request', followUp ? 'simulated_followup_selected' : 'simulated_no_followup');
    if (type === 'request-demo') track('guided_demo_request', 'simulated');
    setResult({ followUp });
  }
  return <MosaicPage path={'/' + type} compact eyebrow={eyebrow} title={title} intro={intro}>
    <div className="wrap scene-body form-layout">
      <form className="intake mosaic-hover" onSubmit={submit} aria-label={eyebrow} data-scene-panel="left">
        <p className="form-note">Preview only. Use fictional information. Details stay in this browser view.</p>
        <div className="form-fields">
          {isPilot && <label>Name<input name="name" autoComplete="name" required /></label>}
          <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
          {!isAccess && <><label>Organization<input name="organization" autoComplete="organization" required /></label><label>Role<input name="role" autoComplete="organization-title" required /></label></>}
          {isPilot && <>
            <label>Competition and divisions<input name="scope" required /></label>
            <label>Budget owner or signing role<input name="budget-owner" required /></label>
            <label>Data permission<select name="permission" value={dataPermission} onChange={event => setDataPermission(event.target.value)} required>
              <option value="" disabled>Select an option</option><option>Authorized</option><option>Awaiting data owner</option><option>Unknown</option>
            </select></label>
            <label>Reviewer role<input name="reviewer" required /></label>
            <Select label="Pilot interest" name="pilot-interest" options={['Paid evaluation', 'Exploring fit', 'Future season']} />
          </>}
          {type === 'contact' && <Select label="Topic" name="topic" options={['Product feedback', 'League operations', 'Venue partnership', 'Privacy question']} />}
          {!isAccess && <label className="full">{isPilot ? 'Current repair workflow' : type === 'contact' ? 'Message' : 'Scheduling question'}<textarea name="workflow" rows="4" required /></label>}
        </div>
        {!isAccess && <fieldset className="followup"><legend>May FixtureShift email you about this request?</legend>
          <label className="checkbox"><input type="radio" name="followup" value="yes" required />Yes, email me about this request</label>
          <label className="checkbox"><input type="radio" name="followup" value="no" required />No follow-up email</label>
        </fieldset>}
        <button className="button" type="submit">{action}<MosaicIcon name="arrow" size={16} /></button>
        {result && <div className="decision" role="status"><strong>Preview complete.</strong><p>{isAccess ? 'Workspace access is simulated. You can open the public demo.' : result.followUp ? 'In a live intake, the next conversation would confirm your scope and permissions. This preview stays local.' : 'Follow-up is off. This preview stays local.'}</p></div>}
        <p className="muted"><a href="/privacy">Privacy and preview data</a></p>
      </form>
      <aside className="intake-aside" data-scene-panel="right">
        {isPilot ? <>
          <RecordCard name="Evaluation scope" rows={[['Scope', 'One competition'], ['Price', 'Quoted after discovery'], ['Data permission', dataPermission || 'Select status in the form']]} />
          <Scorecard />
          <p>Bring historical snapshots, venue bookings, rest and travel rules, a data owner and a named reviewer.</p>
          <RecordCard name="Evaluation decision" icon="check" rows={[
            ['Baseline', 'Your current repair workflow'],
            ['Before replay', 'Approve the scope, scoring rules, adverse outcomes and success threshold'],
            ['After replay', 'Review the comparison with the budget owner and confirm who decides on renewal'],
          ]} />
        </> : <RecordCard name="Riverside Derby · F-107" rows={[['Original slot', 'Sat 17 Apr · 15:00'], ['Venue', 'Riverside Ground unavailable'], ['Walkthrough', 'Synthetic data']]}><InsetLink href="/demo">Open the public demo</InsetLink></RecordCard>}
      </aside>
    </div>
  </MosaicPage>;
}

const textLabels = { '/about': 'About', '/trust': 'Trust and data', '/privacy': 'Privacy', '/terms': 'Preview terms' };

export function TextPage({ item, path }) {
  return <MosaicPage path={path} compact eyebrow={textLabels[path]} title={item.title} intro={item.intro}>
    <div className="wrap scene-body"><div className="detail-editorial policy-editorial">
      {item.sections.map(([title, copy], index) => <section key={title} data-scene-panel={index % 2 ? 'right' : 'left'}>
        <span className="editorial-icon"><MosaicIcon name={index === 0 ? routeIcons[path] : 'rules'} size={23} /></span><div><h2>{title}</h2><p>{copy}</p></div>
      </section>)}
    </div></div>
  </MosaicPage>;
}

export function Sources() {
  return <MosaicPage path="/sources" compact eyebrow="Research sources" title="What we’re evaluating." intro="League scheduling products already address parts of this workflow. FixtureShift focuses on the source-linked decision after a venue drops out.">
    <div className="wrap scene-body"><ul className="sources scene-sources">{sources.map(([name, description, link], index) => <li key={link} data-scene-panel={index % 2 ? 'right' : 'left'}><strong><MosaicIcon name="archive" />{name}</strong><p>{description}</p><InsetLink href={link}>Read the source<span className="sr-only"> from {name}</span></InsetLink></li>)}</ul></div>
  </MosaicPage>;
}
