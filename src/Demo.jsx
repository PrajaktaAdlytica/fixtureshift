import { useEffect, useState } from 'react';
import { BrandMark, ButtonLink, Check, InsetLink, RecordCard, track } from './Interface';
import { MosaicPage } from './MosaicPage';
import { MosaicIcon } from './MosaicIcon';
import sample from './sample.json';

const [derby, unresolved] = sample.records;
const label = sample.simulationLabel;
const cases = [
  [derby.caseId, 'Riverside Derby', 'Pending review'],
  [unresolved.caseId, 'East Stand booking', 'Venue confirmation needed'],
  ['FS-014', 'Southbank Cup', 'Completed'],
];
const impacts = [
  ['F-208 · Division 2', 'West Foundry A · Sat 18:00', 'West Foundry B · Sat 18:30'],
  ['F-312 · Division 3', 'West Foundry B · Sat 18:30', 'Merefield Centre · Sun 11:00'],
  ['F-411 · Regional Cup', 'Merefield Centre · Sun 11:00', 'Merefield Centre · Sun 13:30'],
];
const notes = {
  'FS-SRC-101': 'Riverside Ground is unavailable at the originally published time after a surface inspection.',
  'FS-SRC-102': 'Fixture F-107 and its three neighboring fixtures appear in the original published positions.',
  'FS-SRC-103': 'Calder Annex Pitch 2 is confirmed for Sunday at 15:00. Committed overlaps can be checked against the booking version.',
  'FS-SRC-104': 'Minimum 48 hours between a prior finish and kickoff. Team travel windows and organizer approval also apply.',
  'FS-SRC-105': 'An uncommitted warm-up request overlaps the West Foundry option. A further booking conflict may occur if the request is confirmed.',
  'FS-SRC-106': 'Invented prior fixture changes and booking history underpin the illustrative follow-on rank.',
  'FS-SRC-107': 'The Sunday alternative leaves both teams at least 66 hours of rest and falls within both team travel windows.',
  'FS-SRC-201': 'Written confirmation from the venue operator is still missing. Leave the Tuesday candidate open.',
};
const search = new URLSearchParams(location.search);
const formatDate = date => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/London' }).format(new Date(date));

function download(record) {
  const text = JSON.stringify({ simulationLabel: label, schemaVersion: sample.schemaVersion, competition: sample.competition, timezone: sample.timezone, records: [record] }, null, 2);
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = record.caseId + '-simulated-data.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  track('reviewer_interaction', 'export');
}

export function DemoAccount() {
  return <MosaicPage path="/demo/account" compact eyebrow={label} title="Greyhaven Interregional League"
    intro="A simulated buyer record for a proposed one-competition fixture repair evaluation."
    actions={<ButtonLink href="/demo">Open the fictional case workbench</ButtonLink>}>
    <div className="wrap scene-body split account" data-scene-panel="up">
      <RecordCard name="Evaluation account" rows={[
        ['Buyer', 'Competition operations director'], ['Operator', 'League scheduling coordinator'], ['Data permission', 'Awaiting data owner'],
        ['Baseline', 'Spreadsheet, shared calendars and calls'], ['Pilot scope', 'Fixture Rescheduler · 40 prior disruptions'], ['Quote', 'Pending discovery'],
      ]} />
      <RecordCard name="Next commercial action" icon="people" rows={[
        ['Budget owner', 'Confirm signing and renewal authority'], ['Data owner', 'Confirm record access'], ['Reviewer', 'Agree the replay protocol'],
      ]}><InsetLink href="/demo">Open the fictional case workbench</InsetLink></RecordCard>
    </div>
  </MosaicPage>;
}

export default function Demo() {
  const [caseId, setCase] = useState(search.get('case') === unresolved.caseId ? unresolved.caseId : derby.caseId);
  const [option, setOption] = useState(search.get('option') === 'B' ? 'B' : 'A');
  const [sourceId, setSource] = useState(search.has('evidence') ? 'FS-SRC-103' : search.get('option') === 'B' ? 'FS-SRC-105' : null);
  const [checked, setChecked] = useState(false);
  const [decisions, setDecisions] = useState({});
  const record = caseId === derby.caseId ? derby : unresolved;
  const isDerby = caseId === derby.caseId;
  const isArchived = caseId === 'FS-014';
  const decision = decisions[caseId];
  const source = record.sourceReferences.find(item => item.id === sourceId);
  useEffect(() => { track('demo_start', 'workbench'); }, []);
  function switchCase(id) {
    setCase(id); setSource(null); setOption('A'); setChecked(false);
  }
  function inspect(id) {
    setSource(current => current === id ? null : id);
    track('reviewer_interaction', 'open_evidence');
  }
  function decide() {
    if (decision || (isDerby && (!checked || option !== 'A'))) return;
    const example = structuredClone(record);
    example.recordedInPreviewAt = new Date().toISOString();
    setDecisions(current => ({ ...current, [caseId]: example }));
    track('reviewer_interaction', isDerby ? 'approve_sample' : 'leave_open');
  }
  function reset() {
    setDecisions({}); switchCase(derby.caseId);
  }
  return <MosaicPage path="/demo" compact className="demo demo-cinema" eyebrow={label} title="Fixture Rescheduler"
    intro="Inspect the fixture, compare alternatives and review the evidence."
    actions={<><ButtonLink href="#case-workbench">Open the case workbench</ButtonLink><ButtonLink href="/demo/account" secondary>Simulated buyer account</ButtonLink></>}>
    <div className="wrap demo-zone">
    <div id="case-workbench" className="workbench-header" data-scene-panel="up"><p className="eyebrow"><BrandMark />{label}</p><button className="quiet" onClick={reset}>Reset walkthrough</button></div>
    <div className="workbench">
      <aside className="queue" aria-label="Case queue" data-scene-panel="left"><h2><MosaicIcon name="archive" size={22} />Case queue</h2>
        {cases.map(([id, name, state]) => <button key={id} type="button" aria-pressed={id === caseId} onClick={() => switchCase(id)}>
          <span className="mono">{id}</span><strong>{name}</strong><small>{decisions[id]?.reviewedDecision.state || state}</small>
        </button>)}
      </aside>
      <section className="case" data-scene-panel="up">
        {isArchived ? <><p className="eyebrow">FS-014 · Archived sample</p><h2>Southbank Cup</h2><p>Completed in the fictional queue. The recorded review was approved before a revised notice was prepared.</p></> : <>
          <p className="eyebrow">{caseId} · {isDerby ? 'Match F-107' : 'Match F-131'}</p>
          <h2>{record.fixtureName}</h2>
          <p>{isDerby ? 'Calder Borough vs Westmere Athletic. Riverside Ground is unavailable for the published Saturday 17 April 2027 kickoff at 15:00 BST.' : 'Eastgate Rovers vs Marsh Vale. The proposed Broker’s Field slot on Tuesday 20 April at 19:00 needs written venue confirmation.'}</p>
          {isDerby ? <>
            <p className="ranking-note"><strong>Illustrative AI ranking.</strong> Calder Annex ranks first for lower follow-on risk. Check the booking, rest and travel evidence before deciding.</p>
            <div className="options" role="group" aria-label="Compare alternatives">
              {record.options.map(item => <button key={item.id} type="button" disabled={Boolean(decision)} aria-pressed={option === item.id} className={option === item.id ? 'option mosaic-hover selected' : 'option mosaic-hover'}
                onClick={() => { setOption(item.id); setChecked(false); track('reviewer_interaction', 'compare_options'); }}>
                <span className="eyebrow">{item.id === 'A' ? 'Sunday · 18 April · 15:00' : 'Saturday · 17 April · 18:00'}</span><strong>{item.venue}</strong>
                <span>{item.affectedFixtureIds.length} additional fixtures move</span><small>{item.id === 'A' ? 'Lower estimated follow-on risk' : 'Elevated estimated follow-on risk'}</small>
              </button>)}
            </div>
            {option === 'B' ? <div className="impact-table"><table><caption>Additional affected fixtures</caption><thead><tr><th>Fixture</th><th>Published</th><th>Proposed</th></tr></thead><tbody>{impacts.map(row => <tr key={row[0]}>{row.map(value => <td key={value}>{value}</td>)}</tr>)}</tbody></table></div>
              : <p className="status-note"><Check>Both teams pass rest and travel checks on the supplied records.</Check></p>}
          </> : <p className="status-note warning">Awaiting venue confirmation. The request is assigned to the league scheduling coordinator.</p>}
          {source && <div className="evidence-detail" aria-live="polite">
            <p className="eyebrow">{source.id} · {source.version} · {formatDate(source.date)}</p>
            <h3>{source.title}</h3><p>{notes[source.id]}</p><button className="quiet" onClick={() => {
              setSource(null);
              document.getElementById('source-' + source.id)?.focus();
            }}>Close evidence</button>
          </div>}
          <div className="case-review">
            <p><strong>Reviewer</strong> · Mara Venn, Competition Review Lead</p>
            {isDerby && !decision && option === 'A' && <label className="checkbox"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} />I reviewed the affected teams and the Sunday booking.</label>}
            {isDerby && option === 'B' && <p className="muted">Review the provisional warm-up request before approving a West Foundry notice.</p>}
            {!decision ? <button className="button" type="button" disabled={isDerby && (!checked || option !== 'A')} onClick={decide}>{isDerby ? 'Approve sample notice' : 'Leave case open'}<MosaicIcon name={isDerby ? 'check' : 'routes'} size={16} /></button>
              : <div className="decision" role="status"><strong>{decision.reviewedDecision.state}</strong>
                <p>{decision.notice?.text || 'Assigned follow-up: obtain written confirmation from the venue operator.'}</p>
                <details className="decision-history">
                  <summary>Decision history and export status</summary>
                  <ol>{decision.decisionHistory.map(entry => <li key={entry.at}>
                    {entry.state} · {entry.actorRole} · <time dateTime={entry.at}>{formatDate(entry.at)}</time>
                  </li>)}</ol>
                  <p>{decision.exportStatus} · {label}</p>
                </details>
                <button type="button" className="quiet download" onClick={() => download(decision)}><MosaicIcon name="download" />Export example record</button></div>}
          </div>
        </>}
      </section>
      <aside className="evidence" aria-label="Source evidence" data-scene-panel="right"><h2><MosaicIcon name="rules" size={22} />Evidence</h2>
        {!isArchived && record.sourceReferences.map(item => <button type="button" id={'source-' + item.id} key={item.id} aria-expanded={sourceId === item.id} onClick={() => inspect(item.id)}>
          <MosaicIcon name="rules" /><span><strong>{item.title}</strong><small>{item.id} · {item.version}</small><small>{formatDate(item.date)}</small></span>
        </button>)}
      </aside>
    </div>
    <div className="demo-end" data-scene-panel="up"><p>Fictional workbench. Notices stay in this demo. League staff approve and publish actual decisions.</p><ButtonLink href="/pilot" context="demo">Request a paid pilot</ButtonLink></div>
    </div>
  </MosaicPage>;
}
