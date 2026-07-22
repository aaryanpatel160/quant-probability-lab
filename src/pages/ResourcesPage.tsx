const resources = [
  ['Jane Street Probability & Markets', 'A concise, accessible bridge from probability and expected value to market making and adverse selection.', 'https://www.janestreet.com/static/pdfs/trading-interview.pdf'],
  ['MIT OpenCourseWare 18.05', 'A university course with readings, problems and solutions covering probability, distributions and inference.', 'https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/'],
  ['Harvard Statistics 110', 'Joe Blitzstein’s renowned probability course, free textbook links and lecture resources.', 'https://stat110.hsites.harvard.edu/'],
  ['Jane Street Probability Cards', 'Challenge problems spanning expectation, conditional probability, geometry and random walks.', 'https://www.janestreet.com/probability-playing-cards/'],
  ['MDN: Installing web apps', 'Instructions and platform notes for installing this PWA on a Home Screen.', 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing']
]

export function ResourcesPage() {
  return <div className="page"><div className="page-title"><span className="eyebrow">SOURCE LIBRARY</span><h1>Go deeper<br />when online.</h1><p>The app’s lessons are offline. These carefully selected external resources require an internet connection.</p></div><div className="resource-list">{resources.map(([title, description, url]) => <a key={title} href={url} target="_blank" rel="noreferrer"><div><strong>{title}</strong><p>{description}</p></div><span>↗</span></a>)}</div><p className="source-policy">All app questions use original wording and parameter choices. Links document the concepts and curriculum provenance; they do not imply that a question was asked by a named firm.</p></div>
}
