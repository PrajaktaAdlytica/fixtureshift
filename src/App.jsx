import { useEffect } from 'react';
import { products, solutions, staticPages } from './content';
import { ButtonLink, Footer, Header } from './Interface';
import Home from './Home';
import Demo, { DemoAccount } from './Demo';
import { Detail, Directory, FormPage, Pricing, Sources, TextPage } from './Pages';
import { MosaicPage } from './MosaicPage';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-sans/latin-400.css';
import '@fontsource/instrument-sans/latin-600.css';
import './styles.css';
import './mosaic.css';

const path = location.pathname.replace(/\/$/, '') || '/';

function resolvePage() {
  const product = products.find(item => '/product/' + item.slug === path);
  const solution = solutions.find(item => '/solutions/' + item.slug === path);
  if (product) return <Detail item={product} family="Product" />;
  if (solution) return <Detail item={solution} family="Solution" />;
  if (path === '/') return <Home />;
  if (path === '/demo') return <Demo />;
  if (path === '/demo/account') return <DemoAccount />;
  if (path === '/platform' || path === '/solutions') return <Directory kind={path.slice(1)} />;
  if (path === '/pricing') return <Pricing />;
  if (path === '/sources') return <Sources />;
  if (['/pilot', '/request-demo', '/contact', '/sign-in'].includes(path)) return <FormPage type={path.slice(1)} />;
  if (staticPages[path]) return <TextPage path={path} item={staticPages[path]} />;
  return <MosaicPage path="missing" compact eyebrow="FixtureShift" title="Page unavailable."
    intro="Find the competition tools or return to the fixture walkthrough."
    actions={<><ButtonLink href="/">Return home</ButtonLink><ButtonLink href="/demo" secondary>Run the fixture demo</ButtonLink></>} />;
}

export default function App() {
  useEffect(() => {
    const heading = document.querySelector('main h1')?.textContent;
    if (heading && path !== '/') document.title = heading + ' | FixtureShift';
  }, []);
  return <><Header path={path} />{resolvePage()}<Footer path={path} /></>;
}
