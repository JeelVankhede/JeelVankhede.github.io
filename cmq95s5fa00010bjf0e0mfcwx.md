---
title: "Open the PR your reviewer has not met yet"
seoTitle: "Open the PR your reviewer has not met yet"
seoDescription: "When AI writes the code, the PR description is the only proof you understood what you shipped. A template that holds, and the habit that builds it."
datePublished: 2026-06-11T02:30:00.000Z
cuid: cmq95s5fa00010bjf0e0mfcwx
slug: open-the-pr-your-reviewer-has-not-met-yet
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/69dde9d7-8acc-402b-b8f4-5a25730f1527.png
tags: ai, code-review, productivity, programming-blogs, git, best-practices, software-engineering, developer-tools

---

I got a PR to review recently. Large diff, AI-assisted, touching a module three other features depended on. The description was one sentence. It named the file, not the reason.

I spent fifteen minutes just mapping the change before I could start reviewing. What the intent was. Where the risk was. Which files mattered and which were noise.

Somewhere in the middle of that fifteen minutes, I thought: I have done this to someone else.

* * *

## The author forgets what the reviewer does not know

When you write the code, you carry everything.

You know why the module was split. You know what you tried before landing here. You know which section you shipped with a quiet doubt. You know the edge case that is technically handled but not properly tested.

Then you open the PR.

And you write the description from that place. From inside the full context, for the version of you who already knows. Not for the reviewer who is about to walk in without any of it.

*"Refactored service layer."*

*"Updated config handling."*

*"Fixed issue with auth module."*

These are descriptions written from memory, not for someone without it.

* * *

## AI widened the gap before I noticed

There is a specific unease I have felt looking at my own PRs a couple of days after raising them.

The code is fine. The tests pass. But I cannot reconstruct why I made the choices I made. The work was AI-assisted, the diff was large, and I had moved fast. Moving fast and understanding deeply are not the same thing.

I opened one of those PRs recently. A refactoring pass. I tried to read it as a reviewer. I had a question I could not answer from the description. The answer existed. It was in my head when I wrote the code. It never made it into the PR.

That was the moment I realized *the description was not a summary.* ***It was a test*.**

* * *

## Write it for the version of you who will review this in three days

That realization changed how I write descriptions.

Not a template first. A question first: if I came back to this PR in three days knowing nothing, what would I need to read before opening the diff?

I sat with that question long enough to realize I needed a structure. Not something I could skip when moving fast. A concrete template I would follow before any non-trivial PR opens. I built it, tested it across refactoring passes, AI-assisted features, and larger architectural changes, and refined it until it held.

It has six parts.

**Intent** - not what changed, but why this PR exists and what problem it is solving. One paragraph. If you cannot write it clearly, stop. The PR is not ready to open.

**Major changes** - the decisions that touch architecture, existing behavior, or anything a downstream system depends on. This is where the reviewer needs to slow down.

**Minor changes** - the cleanup, the renames, the noise. Named separately, so they do not sit next to structural changes and get equal weight.

**Impact** - what features, modules, or systems this PR touches. The blast radius, stated plainly. Not documentation. A map.

**Evidence** - what was run, what was walked through manually, what coverage looked like. Not to satisfy a process. Proof that the author did the work before asking someone else to do it.

And the one most descriptions never reach: what I was uncertain about.

* * *

## Naming uncertainty is not weakness. It is direction.

When something works but I cannot fully explain why, I say so. Directly, in the description.

For the reviewer, it is a targeting signal. They know where to read closely and where to move. Without it, they distribute attention evenly across a diff that does not deserve even attention.

Writing it is a checkpoint. If I cannot name what I am uncertain about, I have not thought carefully enough about my own code. That line has stopped me from opening PRs that were not ready.

The description is not the last step before review. It is the last step before I know whether the PR should open at all.

* * *

## The reviewer who opens this has not met your code yet

When I compare the PRs I was proud of shipping against the ones that came back with questions, the difference is rarely the code.

It is the description.

A reviewer who understands your intent from the first read spends their time on the hard questions. A reviewer who has to reconstruct your intent spends it on the easy ones. Asking what things are instead of whether they are right.

[Part 1](https://jeelvankhede.hashnode.dev/review-the-code-that-does-not-exist-yet) of this series argues the reviewer's side of the same problem. If you arrived here first, it is worth the detour. The argument there: reviewers now need to look past surface correctness and find intent. But intent does not appear on its own. Someone has to put it there before the review begins.

> Write it for the reviewer who has not met your code yet.
> 
> Write it as if you will not be there to answer questions.
> 
> Write it as if the next person to read it is you, three days from now, with no memory of writing it.

If it holds up, the PR is ready.