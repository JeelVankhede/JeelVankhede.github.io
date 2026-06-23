---
title: "The Plan Blocked Me. That Was the Correct Outcome."
seoTitle: "The Plan Blocked Me. That Was the Correct Outcome."
seoDescription: "The Plan phase blocked me before Build started. Not an error. A gate. Here is what the estimate found that the blueprint missed."
datePublished: 2026-06-23T03:59:23.071Z
cuid: cmqq47zxm00000bj6fiqbcuky
slug: the-plan-blocked-me-that-was-the-correct-outcome
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/fbc597ea-e4cb-4daf-8d44-76b973d2d259.png
tags: ai, software-development, software-engineering, developer-tools, ai-agents

---

The brief was approved. Scope defined, questions closed, acceptance criteria written. The obvious move was to start building.

I ran the Plan phase first.

Planning and the Plan phase are not the same thing.

## Planning produces direction. The Plan phase produces a gate.

Every engineer plans. Sprint boards. Jira tickets. A rough sequence before a large refactor starts. It works well enough because a human engineer carries what the plan does not say. They know what they did not write down.

An agent does not. An agent fills the gaps with its best guess. That is not inefficiency. It is drift. I covered what drift costs in the [last part of this series](https://jeelvankhede.hashnode.dev/an-ai-agent-is-a-hammer-the-think-phase-is-where-you-aim-it).

The Plan phase has one property that a sprint board does not: refusal conditions.

A plan that cannot refuse you is documentation. A plan with refusal conditions is a gate.

Nobody brings materials to a construction site and figures out the building as they go. There is a blueprint first. Then an estimate. The estimate is not the slow part. Finding out mid-build that a wall cannot go there is the slow part.

The brief is the blueprint. The Plan phase is the estimate.

## The impact map found what the brief described in one line

The refactor target was a god class. It owned too much. The brief said split it.

Most codebases have a version of this. A module that owns too much and the team has learned to work around. The brief names it in one line and moves on. The impact map cannot.

It found that the god class held the payload formatting logic. Every notification the system sent passed through it before leaving the application boundary. Split it wrong and the notification contract breaks. Which phase owns that during the transition?

I thought the brief had answered that. It had not.

The impact map could not answer it either. That required the risk register.

## The plan blocked. That was correct.

The risk register stopped me at a question I had not prepared for.

The payload format was a contract with the external notification provider. The provider expected specific field names and structure. It did not return an error when that structure changed. It silently rejected the payload. No exception. The only evidence would come downstream, weeks later, when someone noticed the silence.

That kind of failure is a time bomb.

There was no mitigation in the current plan. The plan blocked.

My first instinct was to push through. Grant myself the waiver. Flag it low risk. Sort it out during Build. That is the exact moment the Plan phase exists to intercept. Not because the risk was catastrophic. Because the question was unanswered, and an unanswered question does not disappear. It travels into Build and becomes the agent's problem.

I had always sorted things like this mid-build. This time the plan would not move until I had the answer.

That cost time I had not budgeted. It cost less than tearing down a wall mid-build.

So I answered it.

## The decision was made at plan time, not build time

I made the call. Not automatically. The simpler path was to move everything in one phase. But one ordering changed the external interface before the replacement was verified. The other preserved the notification contract through the transition and required a human to confirm the payload format before the agent could proceed.

No code was written. I made a sequencing decision. The agent would follow it.

A human engineer would have caught this mid-build. Professional instinct. Write "migrate notification dispatch" as a task and the agent migrates it. It does not know the field names are a contract. It does not know silent rejection is the failure mode. It does not know to pause before continuing.

The god class was specific to this refactor. The problem it exposed was not. Something will always look safe to move. What makes it unsafe is external, invisible to a scan, and silent when it breaks.

> Build owns code. Plan owns sequencing.

## The plan was signed. That was not the end.

Think told me what to build. Plan told me in what order. Those are not the same document and they are not the same decision.

That is not a handoff. That is a gate.

Build started with a plan the agent could not diverge from. Whether the plan was precise enough was a question only Build could answer. That is the next part.

**A key takeaway:**

> ***This is not a template I built for this article. It is the skill that I run for my plans.***
> 
> ***The*** `plan` ***skill prepares an impact map, risk registers, phases and verification gates. It enforces that all risks are known and user is acknowledged before Build begins and produces the plan as a versioned artifact.***
> 
> ***Use it in the sequence to the Think. Once the brief is generated, you prepare a plan and read how it differs from the regular plans that AI makes.***
> 
> [plan.md on GitHub Gist](https://gist.github.com/JeelVankhede/1a20ee3b11a354cfa2e123ccbee29247)