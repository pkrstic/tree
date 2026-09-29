import TreeExamples from './examples/TreeExamples'
import TreeParameters from './examples/TreeParameters'
import TreeJsonInput from './examples/TreeJsonInput'
import TreeCssVariables from './examples/TreeCssVariables'
import packageInfo from '../package.json'
import licenseUrl from '../LICENSE?url'
import './App.css'

function GitHubLogo() {
  return <svg className="github-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
    <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 6.098c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.094 24 17.597 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
}

export default function App() {
  return <main>
    <header className="page-header"><a className="brand" href="#">tree<span> / react component</span></a><nav aria-label="Page sections"><a href="#parameters">Parameters</a><a href="#json-input">JSON input</a><a href="#css-variables">CSS variables</a><a href="#examples">Live examples</a><a href="#about">Author & license</a><a className="github-link" href="https://github.com/pkrstic/tree"><GitHubLogo />GitHub ↗</a></nav></header>
    <section className="intro">
      <span className="eyebrow">COMPONENT REFERENCE</span>
      <h1>A little structure.<br />A lot of possibilities.</h1>
      <p>A React tree for browsing hierarchies, choosing categories, and finding the right node. Explore its options below.</p>
      <p className="intro-meta">By <strong>{packageInfo.author}</strong> · Version {packageInfo.version} · <a href="#about">WTFPL v2</a></p>
      <p className="intro-meta"><a className="github-link" href="https://github.com/pkrstic/tree"><GitHubLogo />View on GitHub ↗</a></p>
      <div className="intro-tags"><span>TypeScript</span><span>Native form inputs</span><span>No UI dependencies</span></div>
    </section>
    <TreeParameters />
    <TreeJsonInput />
    <TreeCssVariables />
    <div className="section-heading" id="examples"><h2>Live examples</h2><p>Interact with each tree. Open its code to see the configuration.</p></div>
    <TreeExamples />
    <footer id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">Author &amp; license</h2>
      <p>Created by <strong>{packageInfo.author}</strong>. Version <strong>{packageInfo.version}</strong>.</p>
      <p>Licensed under the <a href="https://www.wtfpl.net/txt/copying/">WTFPL version 2</a> (Do What The Fuck You Want To Public License). You can use, modify, and redistribute this component under its terms.</p>
      <a className="license-download" href={licenseUrl} download="LICENSE">Download the license text ↓</a>
      <p className="footer-documentation">View the <a href="https://github.com/pkrstic/tree">source code on GitHub</a>. Full API, data format, and npm preparation notes are in the <a href="https://github.com/pkrstic/tree#readme">README</a>.</p>
    </footer>
  </main>
}
