---
title: "I Built This to Fix One Task. It Turned Into Something You Can Run."
seoTitle: "I Built This to Fix One Task. It Became a System."
seoDescription: "I expected nine parts of forcing an agent to follow a workflow it would skip. That fight never started. What the chain gave me instead was a position."
datePublished: 2026-08-11T18:19:03.222Z
cuid: cmsozia3p00000akg3tasglm3
slug: i-built-this-to-fix-one-task-it-turned-into-something-you-can-run
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/e230a69a-c7b3-47ec-ab75-299ded063c3e.png
tags: software-development, software-engineering, developer-tools, build-in-public, ai-agents, ai-workflow

---

There are two ways to work with an AI agent and I had tried both. Write the thing yourself and hand over only the tedious parts. Or hand over the whole task and audit whatever comes back at the end. The first is slow. The second is fast right up until it is wrong, and by then the wrong thing is finished.

I expected this series to be about forcing a third option into existence. Nine parts of making an agent follow a workflow it would rather skip.

That is not what happened. I never had to enforce it once.

The queue that started this had a payload contract nobody had verified, and each phase after that cost me something before it gave anything back. A plan that would not move until the risk register named the provider contract the brief had only guessed at. A build that missed nothing except what my own brief left out. A review that stopped handing back a feeling and started handing back a verdict on every requirement I had already called done. A matrix instead of a trusted green run. A rollback with a name on it before anything got called shipped. And a retrospective that would not let a lesson through until it had checked itself against the trail.

Eight parts of that. What I did not expect was which part turned out to be automatic.

## The Fight I Expected Never Started

By the time I finish writing a requirement, I already know roughly what it is going to cost. Most engineers do. You can feel the difference between a one-line fix and something that is going to touch four files and a migration before you have written a single line of it.

What I assumed was that the agent could not feel that, and that policing the gap would be my job forever. Reminding it to run the chain. Catching it when it decided a spike was small enough to skip.

It has not needed the reminder. Small bugs do not trigger a brief and a plan, and they should not. A standard requirement, a spike, anything long or cross-cutting, runs the full cycle in order. The classification lands where I would have put it, without me putting it there.

That is not the agent being clever. It is the one part of the system I have not shown you across eight parts: a short instruction file at the repo root that classifies every request before anything is touched, with the seven skill files sitting underneath it. Trivial work gets handled inline. Standard or complex work runs the chain, each phase reading the previous artifact rather than the conversation.

Underneath that sit the pieces that never earned their own article because they are plumbing, not phases: a slug that keeps every artifact for one item under a single name, a requirement manifest that separates what I actually said from what was inferred, an exit gate no artifact passes on its own say-so, and a waiver that leaves a paper trail even when skipping a phase was the right call.

It is less machinery than it sounds like. It is mostly a rule about when the machinery applies.

## The Chain Gave Me Somewhere to Stand

It took me most of the series to notice where I had ended up standing.

Not at the keyboard writing every line. Not at the end of the process reading a finished diff and trying to reconstruct whether it matches something I described days ago. Somewhere in the middle, at the gates, watching each artifact land before the next phase reads it.

That position did not exist in either of the two ways I had worked before. When I was writing everything, there was nothing to review because I was the one making the decisions as I went. When I was handing off whole tasks, the only place to stand was at the end, where every correction is expensive because the work is already finished.

The chain put me somewhere in between and gave me something specific to do there. Approve the brief or send it back. Read the plan before the build starts. See a requirement come back partial and decide whether it holds up the work. Every one of those is small on its own. Together they are the difference between hoping the result lands on what I asked for and being able to watch it land, phase by phase, while there is still time to steer.

That is the actual product of nine parts. Not a more obedient agent. A place for me to stand while it works.

## So Would I Run It Again

Yes. The more useful question is what would make me stop.

Processes like this rarely die from being wrong. They die from friction. You override the rule on a Tuesday because the thing in front of you is obviously fine, then again on Thursday, and inside two weeks it is something you describe in the past tense. I have watched that happen to checklists, to templates, to every convention a team agrees on in a meeting and quietly stops following.

What keeps this one alive is that I have not had to argue with it. The rule makes the call, it makes it the way I would have, and the cost only lands on work that was always going to be expensive. None of that depends on me being disciplined on a bad day, which is the only kind of day that matters for a process surviving.

If that changes, if I catch myself overriding the classification to get moving, then the answer changes with it.

## What I Cannot Check Yet

The agent and I agree about complexity. That is the part working best, and it is also the part I have the least evidence for.

Agreement is comfortable. This series was built on not trusting comfortable. A review that always came back clean would have been suspicious by Part 5, and I do not have a way, right now, to tell the difference between a classification that is right and one that simply matches mine. If it were consistently wrong in the same direction I am wrong, the artifacts would look exactly like this.

There is a second thing I cannot claim. Every phase here ran through one person, on one task, with nobody but me approving each handoff. Whether an artifact somebody else wrote carries the same weight is a real question and I do not have the answer.

Neither of those makes the last eight parts less true. They are just the next two things to check, and this series is entirely about the difference between what you have checked and what you have assumed.

## The Guide Is Not Mine to Keep

I could have written one readme and asked you to trust that it works. Nine parts was the slower way to make the same claim and the only honest one, because you got to see where the weight paid for itself and where it did not instead of taking my word for it.

Put it in a repo. Aim it at something with real risk in it, a contract nobody has verified, a change three other things depend on. Then find out where you end up standing.

I already know where I did.

What is in the gist is the compact version, small enough to read once and run this week. It is not everything I ended up building. The complete one, with the detail I had to leave out to keep nine parts readable, is [agentsmyth](https://jeelvankhede.github.io/agentsmyth/). That is where this goes next.

**What the whole chain actually gave me:**

> `guide.md` is not a skill your agent runs. It is the map of the seven skills that are, and the piece that decides when their full weight applies at all.
> 
> It gives you the agent instruction file for your repo root, the classification rule that separates trivial work from standard and complex, the requirement manifest that keeps what you said apart from what was inferred, and the exit gate every artifact passes before the next phase can start.
> 
> Point your agent at it alongside the seven skill files from the earlier parts. What it produces is not one artifact but the whole chain, brief through retrospective, each file written to survive a session restart because the agent reads files instead of remembering or inferring.
> 
> [guide.md on GitHub Gist](https://gist.github.com/JeelVankhede/23e18110987a795bd31e2cfa9bbdbff4)

Or try agentsmyth as a complete version of it.