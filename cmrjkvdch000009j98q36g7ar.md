---
title: "They Asked for My AI Rules. But I Could Not Just Hand Them Over."
seoTitle: "They Asked for My AI Rules. But I Could Not Hand Them Over"
seoDescription: "A demo landed well enough that people wanted the same AI rules. Handing them over directly would have been the wrong advice."
datePublished: 2026-07-13T18:50:46.496Z
cuid: cmrjkvdch000009j98q36g7ar
slug: they-asked-for-my-ai-rules-but-i-could-not-just-hand-them-over
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/d39275cb-cd49-492d-ae8d-118a2473c895.png
tags: workflow, npm, cli, ai-tools, developer-productivity

---

A team lead announces that the team will start using AI-assisted development. Everyone nods. Nobody asks what that actually means on Monday morning.

Some times ago I was in that position. A project I was working on needed to start using AI-assisted development, and the team was new to it. Nobody had rules written down for an agent to follow. Nobody had skills defined for it to load. There was no shared idea of how this should work inside our specific repo. Someone had to go first. That someone was me.

## The rules worked because I built them for one repo

I spent time curating a set of rules and skills for that project. Not generic ones. I shaped them tightly around how that repo was actually structured, its conventions, its layout, the things a new engineer usually has to learn by asking around. I wanted an agent working inside that codebase to already know what a human teammate would have picked up in the first two weeks.

I gave a demo. It landed well. Well enough that it got shared further across team, as something other teams could learn from.

I gave the demo again. Same reaction. Then a few developers reached out for the actual rules and skills files.

I said sure, and then I actually looked at what I would be handing them.

## The problem showed up the moment other people wanted in

It was not copy-paste-able. The rules referenced folder names, module boundaries, and patterns specific to one repo. Handing them over as-is would have meant handing over advice that was wrong for their project, dressed up as a shortcut.

So I told them to use it as a reference. Look at the structure, understand the reasoning, adapt it to your own repo.

That is correct advice. I watched people nod at it and then quietly missing it.

## I was solving the wrong problem the whole time

I had been thinking about this as a documentation problem. Write good rules, explain them well, let people copy the idea. What I actually had was a generation problem. The rules that worked were the ones rendered specifically for a stack, not the ones written generically and left for someone to translate.

The thing that was supposed to spread across other teams did not land as expected. What reached them was a reference nobody had time to turn into anything real. That gap sat there whether I looked at it or not.

What I wanted to build was not another generic harness. I wanted something that looked at a repo's actual stack and produced rules and skills that worked from day one, not rules that needed a translation step before they were useful.

## Nobody on a team agrees on one AI tool

Once I sat with that problem, a second one showed up right behind it, and this one turned out to matter just as much.

Every adoption plan I had seen quietly assumed one AI tool per team. In practice, that assumption breaks almost immediately. One engineer wants Cursor. Another has already built muscle memory in Claude Code. Someone else is testing Windsurf, or is stuck on Copilot because that is what the company licensed, or wants to try Antigravity because something new just came out.

Nobody wants to be told which editor or which agent to use, and forcing a single choice on a team is its own kind of friction, separate from the rules problem entirely. An adoption effort that only works for one tool is not really team adoption. It is one person's adoption, dressed up as a rollout.

## What the tool had to actually do

That is the shape the problem ended up taking. Not "write better rules." Generate rules and skills that are rendered for a specific stack, and make sure they work no matter which of the tools a given engineer has already chosen.

That is what became **FARE** and **BARE**, frontend and backend AI starter recipes, published as npm CLI tools. Point either one at a project and it generates rules, skills, and workflow context shaped around that project's actual stack, with adapters for five tools out of the box: Cursor, Claude Code, Windsurf, Copilot, and Antigravity. The output is meant to be used immediately, not adapted first.

The part worth being honest about is that this did not remove the original judgment call. Something still has to decide what "good rules for this stack" means because it's always well opinionated. The CLI just means that decision gets made once, by the tool, instead of once per engineer, per project, under deadline pressure, with wildly inconsistent results.

## I did not build everything I wanted to

The scope I first sketched out was larger than what shipped. There were ideas around deeper project-specific customization, additional integrations, and more automated context tracking that I dropped or pushed to later releases. Some of that was a reasonable v1 boundary. Some of it was me wanting to build the interesting version instead of the useful one, and catching myself doing it.

Keeping it simple was not the easy default. It was a decision, and one I had to make more than once while writing it.

I do not know yet whether this is the right shape for other teams' problems or just the right shape for the one I kept running into. If you try FARE or BARE on your own project, I would genuinely like to know where it holds up and where it does not.

> Awaiting your feedback!  
> [**F**rontend **A**i starter **RE**cipes](https://jeelvankhede.github.io/frontend-ai-starter-recipes/)  
> [**B**ackend **A**i starter **RE**cipes](https://jeelvankhede.github.io/backend-ai-starter-recipes/)