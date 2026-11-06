---
title: "I Review the Work Now. I Stopped Reviewing the Code."
seoTitle: "AI Writes More Code Than One Mind Can Hold"
seoDescription: "AI generates code faster than we can understand it, in review, the codebases we own. Reading harder does not fix it. Changing what reaches us does."
datePublished: 2026-11-06T15:34:53.468Z
cuid: cmw54ya04000202n9d3zgfzxk
slug: i-review-the-work-now-i-stopped-reviewing-the-code
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/caf8be90-648f-4651-9091-b973ce5122b6.png
tags: ai, code-review, software-engineering, developer-tools, ai-agents

---

The agent finishes. The feature works. I could not tell you how.

I did not stop caring. There is just too much code, and not enough brain.

## Typing Was the Slow Part. Now Reading Is.

Software always had a quiet safety limit, and nobody designed it.

**The writer was slow.**

A person could only type so much in a day. So whatever anyone had to understand afterwards, the reviewer, the next engineer, the author a month later, was capped by how fast someone could write it.

AI removed that cap. Generating code is almost free now. Understanding it is not. Every line still costs the person reading it exactly what it always did.

Nothing about the bottleneck went away. It landed on the one part of the process a better model does not speed up, at least it never did so far!

The human.

## It Looks Right. That Is the Problem.

The code I get back is fluent. Clean names, consistent structure, familiar patterns. Nothing looks wrong, so I skim, and skimming feels safe.

And when something does look odd, there is no author to ask. The reasoning was never kept anywhere. I have to rebuild it from the code itself, which means even more reading.

## I Can Focus. Just Not for That Much.

Understanding is not reading. To understand a change, I have to hold it: what calls what, what depends on what, what breaks if this one line is wrong.

That picture has a size.

It shows most clearly when I review. A PR lands with more than fifty files. My focus holds for about ten. After that, the review gets thinner with every file, and I never decide that it should. Maybe two times out of ten, something makes me scroll back up and ask why it was done that way. The other eight, I check that the change does what it should, and move on.

*I review the work now. I stopped reviewing the code.*

## The Code Is Mine. The Understanding Is Not.

The review is only where this shows first.

If I did not understand the code when it went in, I do not hold it afterwards either. The change merges, the next one arrives, and my picture of the system falls one more step behind the system itself.

That is the quieter cost. I still own the codebase. I am still the one expected to answer for it. But more and more of it is code I would have to read before I could reason about it.

Losing grip on a review is one bad afternoon. Losing grip on a system I own is a slow drift I do not notice until I need it.

## Fast Is What Everyone Expects

Some of the work I have shipped went out like this. Checked for intent. Loosely understood for everything else.

Nobody pushed back, because it worked. Shipping fast is exactly what AI promised, and asking for another day to understand a change starts to feel like I am the one slowing the work down.

That is what makes this dangerous.

The cost does not show up in the release. It shows up later, in how hard the next change is.

## The Brain Does Not Scale. The Pipeline Has To.

Trying harder does not fix this. I tried. Attention is not a setting I can turn up for that much code, written by something other than me.

What helped was changing what reaches my head. Every change now goes through five steps, and each one takes something off my plate before I have to understand it.

```markdown
BEFORE CODE
┌──────────────────────────────────────┐
│ 1. Size the ask by what I can hold   │
│  *takes off: the size of the change* │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ 2. Agree on the plan before the code │
│  *takes off: guessing the intent*    │
└──────────────────┬───────────────────┘
MACHINES           ▼
┌──────────────────────────────────────┐
│ 3. Let tools own the rules           │
│  *takes off: conventions*            │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ 4. Let an AI read first              │
│  *takes off: the obvious mistakes*   │
└──────────────────┬───────────────────┘
ME                 ▼
┌──────────────────────────────────────┐
│ 5. Read with a guide, in risk order  │
│  *left for me: intent and risk*      │
└──────────────────────────────────────┘
```

### 1\. Size the ask by what I can hold

> If I cannot understand it in one pass, the ask was too big.

I used to size an ask by the feature. Now I size it by what I can hold in my head in one sitting, and ship it as small commits or stacked PRs.

### 2\. Agree on the plan before the code

> Agree on what should change before reading what did.

The agent explains what it intends to change before it writes anything. The plan becomes my picture of the change first. The code then fills in a shape I already understand, instead of me reverse-engineering one from it.

### 3\. Let tools own the rules

> Every convention a tool enforces is one I never read for again.

Lint, type strictness, architecture boundaries. This is the cheapest layer, and the one most teams underuse.

### 4\. Let an AI read first

> It narrows the review. It does not sign it off.

A second agent reads before I do and catches a lot of the obvious. It is AI checking AI, so it shares blind spots with the code it checks.

### 5\. Read with a guide, in risk order

> Read first where a mistake would fail quietly.

Without a guide, my attention goes in whatever order the files arrive. Now the agent that wrote the change hands me a short guide: what it was for, which files carry risk, which decisions it made on its own. This is the risk note from one of my own agentsmyth PRs, [#72](https://github.com/JeelVankhede/agentsmyth/pull/72), word for word:

```text
This was AI-driven throughout, and a manual pass matters most in two places:
the containment fences (symlink and path-traversal handling in
atomicWriteFileSync / writeBackup), and the backup-retention rules, since
both decide whether a user's file survives.
```

Two places, named before I start. Then my focus goes in one order: data writes and migrations, external contracts, auth, business logic, then everything generated around it.

A bad write does not throw. A broken contract surfaces in someone else's system. A permissive auth path passes every test. Business logic fails loudly, so tests catch most of it.

None of this makes the agent slower. It makes the output fit the mind that has to own it.

## What None of This Catches

Even with every layer in place, one thing still slips through.

Design.

Tools enforce conventions, not judgement. They cannot tell that a name is misleading, that an abstraction has the wrong shape, or that a pattern will make the next change harder. The AI first pass catches some of it, unevenly. And my focus is spent on intent and risk.

So design quality ends up owned by nobody. It does not break anything today. It drifts, one fast approval at a time.

> Tools review the code. I review the work. Nobody reviews the design.

I do not think the answer is to go back to reading every line. That is not coming back.

The agent will keep getting faster. My brain will not.

The question is not how to understand more code. It is how much of it a human actually needs to understand, and who is looking after the rest.