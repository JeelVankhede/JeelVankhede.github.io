---
title: "The Agent Did Not Drift. I Did."
seoTitle: "The AI Agent Executed Perfectly. My Brief Did Not."
seoDescription: "Build ran five phases without a single drift. The expectation it missed was never in the brief. That was not a Build failure."
datePublished: 2026-06-29T14:18:11.243Z
cuid: cmqzayw7n000009i26fkeght1
slug: the-agent-did-not-drift-i-did
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/92239d51-9e54-42e5-bf68-20a2c8145fb6.png
tags: software-development, developer-tools, ai-tools, ai-agents, engineering-workflows

---

The agent paused. It was waiting for me. I was not used to that.

Every AI tool I had worked with before would fill the gap. Ask it to implement a feature and it would implement the feature, then the next logical thing, then the thing after that. You would come back to a diff three times larger than what you asked for. Confident. Finished. Sometimes wrong.

Build did not do that.

It executed Phase 1. It stopped.

I reviewed. I approved. It executed Phase 2. It stopped again.

I kept expecting it to continue. It never did.

That patience was not a limitation. It was the contract working.

## The work that earns the right to be boring

This is Part 4 of The Contract. If you are starting here: Think produced a brief, Plan produced an approved sequence, and Build is where that sequence runs.

Every frontend codebase has a version of this problem. One notification on launch. Then two. Then three conditions deciding which one to show. Nobody centralises it because it is never urgent enough. Until it is.

I had let mine reach that point.

Background items resolved on app launch. Each one could trigger a notification. The logic deciding which notification to show lived at each call site. No scheduler. No priority. Just conditions stacked on conditions, each one unaware of the others. They started colliding.

I wrote a brief. I wrote a plan.

Five phases. Three to consolidate everything under one scheduler and build the queue. One to wire it into the launch sequence. One to clean up.

Brief done. Plan approved.

By the time Build started, every structural decision had already been made. Build did not need to think. It only needed to execute.

Build has entry conditions.

It checks the branch state before touching a file. It verifies the plan artifact is approved. If the branch is wrong, it stops. If scope has expanded beyond what the plan defined, it stops. Build does not interpret intent. It verifies state, then executes.

Phase 1 executed. Scheduler in place. Files where the plan said they would be. I reviewed it and approved Phase 2.

Phase 2. Phase 3. Each one scoped, reviewable, testable on its own.

That is what two phases of upstream work buys. Not code that works. Code that arrives narrow enough to be understood before it is approved.

That narrowness is what let me catch what was coming.

## Build did exactly what I asked

Phase 4 landed.

The queue was wired into the launch sequence. First run: correct. The scheduler picked up the items, ordered them, surfaced the right notification.

Second run: nothing.

The queue never reset between sessions. Items were scheduled once and never cleared. The scheduler treated the queue as durable when the system treated each session as disposable.

The brief described the scheduling logic, the priority ordering, the collision rules. It did not say anything about queue lifetime. It did not say when to flush. It did not say what a session boundary meant to the scheduler.

Build implemented exactly what the artifact said. When the artifact was silent, Build stayed silent too.

> Donald Knuth had this right: "Computers are good at following instructions, but not at reading your mind."

I went back to the brief and read it the way Build had read it. The flush condition was not there. Not buried or ambiguous. Just absent. I had written around the scheduler lifecycle without ever writing about it. In my head the reset was obvious. In the artifact it did not exist. The brief was missing the one line that would have made Phase 4 correct on the second run.

The gap was not in the code. The gap was in what I had decided was too obvious to write down.

The agent did not drift. I did.

## The gate that made the gap catchable

The moment I found it, Phase 5 had not started.

Nothing downstream had been built on top of the broken assumption. That is not luck. That is the architecture of the workflow.

Build waits between phases because a human checking partial output mid-sequence costs one review. Finding the same problem after Phase 5 costs five phases of rework.

The exit condition is not delivery. It is confirmation. Without that gate, Build is just a slower way to get a large diff.

I added the flush condition to the brief. I updated the plan. The phase re-executed. Phase 5 ran clean.

One gap. Caught at the right moment. Without a cycle of iterations to find it.

## The brief is the contract

Build executes what exists in the artifact. No more. No less.

I had expected Build to catch my oversight. That expectation was wrong. The workflow was designed to make it wrong.

Build is not a safety net for an incomplete brief. It is a precise executor of an approved one. When the brief is honest, Build produces exactly what I imagined. When the brief has a gap, Build produces exactly that too.

The five phases landed at roughly 95% of what I intended.

That number felt high at first. Then I looked at where the 5% came from.

It came from me. Every time. A brief assumption that did not make it into the artifact. A detail that seemed too obvious to write. An edge case I held in my head instead of the plan.

Build did not miss those things. I never gave them to Build.

The workflow did not fail. It showed me everything I had decided was too obvious to write down.

That is the most honest thing a tool has ever told me.

## What comes next

Build closes with a task artifact.

Every changed file is recorded. Every check that ran is recorded. Every check that did not run is recorded with a reason.

Review does not start with the code. It starts with that artifact. The question Review asks is not whether Build made a mistake. It is whether what Build executed was actually what the plan intended.

**A key takeaway:**

> This is not a template I built for this article. It is the skill I run after every feature plan.
> 
> The `build` skill executes exactly one approved plan phase at a time, preserves unrelated changes, inspects branch and repo state before edits, and records every changed file with manifest IDs and command evidence. It stops when scope expands. It waits when branch state is wrong. It produces a task artifact Review can trace back to the plan.
> 
> Download it. Give it to your agent. Drop it into a task that already has an approved brief and plan. Watch it pause instead of fill in the gaps.
> 
> The task artifact it generates is proof that Build ran inside the contract.
> 
> [build.md on GitHub Gist](https://gist.github.com/JeelVankhede/9fee08205fd303876b4e54854c6c1acf)