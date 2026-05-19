import { credibility, experience, metrics, navItems, profile, projects, skills } from './data/portfolio';
import { type ReactNode } from 'react';

type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
};

function LinkButton({ href, children, variant = 'secondary' }: LinkProps) {
  const isExternal = href.startsWith('http');
  return (
    <a className={`btn ${variant === 'primary' ? 'btnPrimary' : ''} ${variant === 'text' ? 'btnText' : ''}`} href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
      {children}<span aria-hidden="true">→</span>
    </a>
  );
}

export function App() {
  return (
    <main>
      <header className="siteHeader">
        <div className="container navBar">
          <a href="#top" className="brand" aria-label="Jeel Vankhede home">{profile.initials}</a>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
          </nav>
        </div>
      </header>

      <section id="top" className="hero sectionPad">
        <div className="container heroGrid">
          <div>
            <div className="kicker"><span aria-hidden="true">✦</span> {profile.role}</div>
            <h1>I lead full-stack product engineering across React, Node, mobile, and AI-assisted workflows.</h1>
            <p className="heroText">Lead Full Stack Engineer with 9+ years across frontend, backend, Android, architecture, and delivery leadership. I help teams ship reliable products faster through pragmatic engineering practices and structured AI-assisted development workflows.</p>
            <div className="actionRow">
              <LinkButton href={`mailto:${profile.email}`} variant="primary">Contact</LinkButton>
              <LinkButton href={profile.resumeUrl}>View resume</LinkButton>
              <LinkButton href={profile.links.github}>GitHub</LinkButton>
              <LinkButton href={profile.links.stackOverflow}>Stack Overflow</LinkButton>
              <LinkButton href={profile.links.linkedin}>LinkedIn</LinkButton>
            </div>
          </div>
          <aside className="heroCard">
            <p className="cardLabel">Current positioning</p>
            <h2>Lead Full Stack Engineer</h2>
            <p>Frontend · Backend · Mobile · Architecture · Technical Leadership · AI-assisted developer productivity</p>
            <div className="availability">Based in Ahmedabad, India · Available for remote-first engineering teams</div>
          </aside>
        </div>
      </section>

      <section className="metricsStrip" aria-label="Proof metrics">
        <div className="container metricsGrid">
          {metrics.map((metric) => <div className="metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        </div>
      </section>

      <section id="work" className="sectionPad">
        <div className="container">
          <div className="sectionHeader">
            <p className="sectionKicker">Featured work</p>
            <h2>Case-study proof, not filler projects.</h2>
            <p>Selected work that represents architecture ownership, delivery leadership, complex product workflows, and developer productivity tooling.</p>
          </div>
          <div className="projectGrid">
            {projects.map((project, index) => (
              <article className="projectCard" key={project.name}>
                <div className="projectNumber">0{index + 1}</div>
                <p className="projectType">{project.type}</p>
                <h3>{project.name}</h3>
                <dl className="caseStudyList">
                  <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                  <div><dt>Role</dt><dd>{project.role}</dd></div>
                  <div><dt>Scope</dt><dd>{project.scope}</dd></div>
                  <div><dt>Impact</dt><dd>{project.impact}</dd></div>
                </dl>
                <div className="tagRow">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {project.links.length > 0 && <div className="projectLinks">{project.links.map((link) => <LinkButton key={link.href} href={link.href} variant="text">{link.label}</LinkButton>)}</div>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="credibility" className="sectionPad altSection">
        <div className="container">
          <div className="sectionHeader compact"><p className="sectionKicker">Public engineering credibility</p><h2>External proof behind the resume.</h2></div>
          <div className="credibilityGrid">
            {credibility.map((item) => <article className="credibilityCard" key={item.title}><h3>{item.title}</h3><strong>{item.value}</strong><p>{item.description}</p><LinkButton href={item.href} variant="text">View proof</LinkButton></article>)}
          </div>
        </div>
      </section>

      <section id="skills" className="sectionPad">
        <div className="container">
          <div className="sectionHeader compact"><p className="sectionKicker">Technical range</p><h2>Wide coverage, practical depth.</h2></div>
          <div className="skillsGrid">{skills.map((skill) => <article className="skillCard" key={skill.title}><h3>{skill.title}</h3><p>{skill.items.join(' · ')}</p></article>)}</div>
        </div>
      </section>

      <section id="experience" className="sectionPad altSection softAlt">
        <div className="container">
          <div className="sectionHeader compact"><p className="sectionKicker">Experience</p><h2>Progression from Android depth to full-stack leadership.</h2></div>
          <div className="timeline">
            {experience.map((item) => <article className="timelineItem" key={item.company}><div className="timelineMeta"><span>{item.period}</span><span>{item.location}</span></div><div className="timelineBody"><h3>{item.company}</h3><p className="roleText">{item.role}</p><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}
          </div>
        </div>
      </section>

      <section id="contact" className="sectionPad contactSection">
        <div className="container contactCard">
          <p className="sectionKicker">Contact</p>
          <h2>Need a technical lead who can still ship?</h2>
          <p>I am best suited for Lead Full Stack Engineer, Senior Full Stack Engineer, and hands-on Technical Lead roles across product, SaaS, startup, and remote-first teams.</p>
          <div className="actionRow center">
            <LinkButton href={`mailto:${profile.email}`} variant="primary">Email me</LinkButton>
            <LinkButton href={profile.resumeUrl}>View resume</LinkButton>
            <LinkButton href={profile.links.linkedin}>LinkedIn</LinkButton>
            <LinkButton href={profile.links.github}>GitHub</LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}
