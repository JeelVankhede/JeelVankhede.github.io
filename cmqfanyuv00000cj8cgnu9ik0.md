---
title: "The Agent Did Exactly What I Asked And That Was the Problem."
seoTitle: "The Agent Did Exactly What I Asked And That Was the Problem"
seoDescription: "An AI agent built my approved plan correctly. The app still broke. Three days of fixing taught me where human judgment actually belongs."
datePublished: 2026-06-15T14:14:17.926Z
cuid: cmqfanyuv00000cj8cgnu9ik0
slug: the-agent-did-exactly-what-i-asked-and-that-was-the-problem
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/44c92a9c-8623-4dfc-af77-a6e16d759a5f.svg
tags: ai, productivity, software-engineering, developer-tools, ai-agents

---

Back in 2022, working with an AI coding assistant meant keeping a browser tab open.

You typed a question. You got a code block. You figured out where it belonged. That was it.

The suggestions were useful in the way a dictionary is useful. Technically correct. Completely unaware of what you were actually building. You stitched the outputs together yourself and moved on.

## The context problem started to close

Then came late 2024.

MCPs arrived. Context pipelines. Codebase-aware agents that could read your patterns, follow your naming conventions, understand the domain you were working in. The agent was not just answering questions anymore. It knew the project, the structure, the terminology you had already established.

This was a genuine step change. Not hype.

But something still did not work on complex tasks.

Single-feature work was fine. Isolated changes landed cleanly. When the scope crossed modules, crossed boundaries, crossed the full surface area of a codebase, the agent started drifting. It solved the visible problem and left behind the invisible ones.

I noticed this. I assumed I needed a better plan.

I was right about that. I was wrong about almost everything else.

## The agent did exactly what I asked. That was the problem.

The task: a global event mechanism and component communication layer across an entire React Native application.

This was not a small task. Done by hand, with a focused engineer, it would take two weeks minimum. The agent understood the domain well. I handed it the work, expecting two weeks to become two days.

I created a plan. I reviewed it. I approved it.

Neither the agent nor I noticed what the plan did not cover: conditionally-loaded passive components that lived outside the event mitigation scope. No impact map. No blast radius analysis. No verification scenarios. A proper engineering sprint would have treated this as a one to two sprint production artifact. We treated it as a chat output.

> The agent implemented the approved plan. Correctly.

That sentence should sound like a success. It is not.

It looked finished. It was not.

Passive and conditional components were outside the event mitigation scope entirely. State changes in those sections did not render correctly. The UI broke in places no one had thought to check, which meant I only found them by using the parts of the app the plan had quietly skipped.

The duplication was worse because it was invisible. Event handling had been wired in across several locations. I only caught it after adding console logs to trace the event flow and watching the same event fire more than once.

The third failure was different. The agent used a combination of Context and Redux for event-driven architecture. It added boilerplate that was never asked for, invented an implementation pattern that was not in scope, not in the plan, and not something I wanted. I had to go back to plain text, explain how it should actually work, and ask it to correct.

That raised a question I kept coming back to: **why would AI do something not asked, not in scope?**

The answer is not a defect. It is the absence of a constraint. There was no rule saying otherwise. The agent filled the gap with its best guess. The best guess was wrong.

## No tracking. No checkpoints. No floor.

No task tracking existed. No verification log. No regression checkpoints.

*Each observation I fed back got implemented immediately.*

*Code layered on top of code. The chat thread grew too long.*

*I summarised and started a new chat. Picked up from there.*

*It worked briefly. Then introduced new issues.*

**The pattern kept repeating.**

By day three, the implementation was 70-75% aligned with the original plan. No clear record of what had been verified, what had not, and what still needed a human decision. Just a long sequence of chat messages and fragile code.

*I made it work by the end of day three. Satisfactory,* ***not clean.***

## Coding was never the problem

I went in assuming the failures would be about code quality. Complex logic, edge cases, missed conditions.

It was not that.

The agent had good context. It could write the code. What it could not do is decide what the work actually is. That is not a tool limitation. It is a role boundary.

Not during the process. Not at the end. At the beginning.

During the process, human review catches mistakes after they happen. At the beginning, human judgment defines the surface area before anything starts.

That realization sent me looking. After three days, I researched existing solutions and tested a few. *They work.* They are well thought through. But they are built for the general case. To use them seriously, you adapt them to your stack, your conventions, your project's specific constraints. That gap is the part nobody packages for you.

I did not want to recommend something I had not built and broken and rebuilt. I did not want to write about a workflow I had read about rather than lived. I was not sure the workflow would hold.

The thing I was missing was not a better tool. It was a contract.

**Seven phases**. A human approves every handoff before the next phase begins.

That is what the next part covers.