import React, { type ReactNode } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MessageSquareText, Sparkles } from 'lucide-react';
import { experience, metrics, profile, projects, skills } from './data/portfolio';

const navItems = ['Work', 'Skills', 'Experience', 'Contact'];

function ExternalLink({ href, children, variant = 'secondary' }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' }) {
  const isExternal = href.startsWith('http');

  return (
    <a className={`btn ${variant === 'primary' ? 'btnPrimary' : ''}`} href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}

export function App() {
  return (
    <main>
      <header className="siteHeader">
        <div className="container navBar">
          <a href="#top" className="brand" aria-label="Jeel Vankhede home">JV</a>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
            ))}
          </nav>
        </div>
      </header>

      <section id="top" className="hero sectionPad">
        <div className="container heroGrid">
          <div>
            <div className="kicker"><Sparkles size={16} /> {profile.role}</div>
            <h1>Hands-on full-stack lead for serious product engineering.</h1>
            <p className="heroText">
              I build and lead full-stack products across frontend, backend, mobile, architecture, and AI-assisted engineering workflows. Strongest around React, Next.js, TypeScript, Node.js, NestJS, and Android/Kotlin depth.
            </p>
            <div className="actionRow">
              <ExternalLink href={`mailto:${profile.email}`} variant="primary"><Mail size={17} /> Contact</ExternalLink>
              <ExternalLink href={profile.links.github}><Github size={17} /> GitHub</ExternalLink>
              <ExternalLink href={profile.links.stackOverflow}><MessageSquareText size={17} /> Stack Overflow</ExternalLink>
              <ExternalLink href={profile.links.linkedin}><Linkedin size={17} /> LinkedIn</ExternalLink>
            </div>
          </div>
          <aside className="heroCard">
            <p className="cardLabel">Current positioning</p>
            <h2>Lead Full Stack Engineer</h2>
            <p>Frontend · Backend · Mobile · Architecture · Technical Leadership · AI-assisted developer productivity</p>
            <div className="availability">Ahmedabad, India · Remote-first compatible</div>
          </aside>
        </div>
      </section>

      <section className="metricsStrip" aria-label="Proof metrics">
        <div className="container metricsGrid">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="work" className="sectionPad">
        <div className="container">
          <div className="sectionHeader">
            <p className="sectionKicker">Featured work</p>
            <h2>Proof-heavy projects, not filler.</h2>
            <p>These are the projects that best represent my current value: architecture ownership, delivery leadership, complex product workflows, and developer productivity tooling.</p>
          </div>
          <div className="projectGrid">
            {projects.map((project, index) => (
              <article className="projectCard" key={project.name}>
                <div className="projectNumber">0{index + 1}</div>
                <p className="projectType">{project.type}</p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <ul>
                  {project.impact.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="tagRow">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="sectionPad altSection">
        <div className="container">
          <div className="sectionHeader compact">
            <p className="sectionKicker">Technical range</p>
            <h2>Wide coverage, practical depth.</h2>
          </div>
          <div className="skillsGrid">
            {skills.map((skill) => (
              <article className="skillCard" key={skill.title}>
                <h3>{skill.title}</h3>
                <p>{skill.items.join(' · ')}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="sectionPad">
        <div className="container">
          <div className="sectionHeader compact">
            <p className="sectionKicker">Experience</p>
            <h2>Progression from Android depth to full-stack leadership.</h2>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timelineItem" key={item.company}>
                <div className="timelineMeta">
                  <span>{item.period}</span>
                  <span>{item.location}</span>
                </div>
                <div className="timelineBody">
                  <h3>{item.company}</h3>
                  <p className="roleText">{item.role}</p>
                  <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="sectionPad contactSection">
        <div className="container contactCard">
          <p className="sectionKicker">Contact</p>
          <h2>Need a technical lead who can still ship?</h2>
          <p>I’m best suited for Lead Full Stack Engineer, Senior Full Stack Engineer, and hands-on Technical Lead roles across product, SaaS, startup, and remote-first teams.</p>
          <div className="actionRow center">
            <ExternalLink href={`mailto:${profile.email}`} variant="primary"><Mail size={17} /> Email me</ExternalLink>
            <ExternalLink href={profile.links.linkedin}><Linkedin size={17} /> LinkedIn</ExternalLink>
            <ExternalLink href={profile.links.github}><Github size={17} /> GitHub</ExternalLink>
          </div>
        </div>
      </section>
    </main>
  );
}
