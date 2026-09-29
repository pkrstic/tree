import TreeExamples from './examples/TreeExamples'
import TreeParameters from './examples/TreeParameters'
import TreeJsonInput from './examples/TreeJsonInput'
import TreeCssVariables from './examples/TreeCssVariables'
import packageInfo from '../package.json'
import licenseUrl from '../LICENSE?url'
import './App.css'

export default function App() {
  return <main>
    <header className="page-header"><a className="brand" href="#">tree<span> / react component</span></a><nav aria-label="Page sections"><a href="#parameters">Parameters</a><a href="#json-input">JSON input</a><a href="#css-variables">CSS variables</a><a href="#about">Author & license</a><a href="#examples">Explore examples ↗</a></nav></header>
    <section className="intro">
      <span className="eyebrow">COMPONENT REFERENCE</span>
      <h1>A little structure.<br />A lot of possibilities.</h1>
      <p>A React tree for browsing hierarchies, choosing categories, and finding the right node. Explore its options below.</p>
      <p className="intro-meta">By <strong>{packageInfo.author}</strong> · Version {packageInfo.version} · <a href="#about">WTFPL v2</a></p>
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
      <p className="footer-documentation">Full API, data format, and npm preparation notes are in README.md.</p>
    </footer>
  </main>
}
