---
title: "We shipped faster. The debt did too."
seoTitle: "We Shipped Faster. The Debt Did Too."
seoDescription: "AI sped up how fast I ship code. It never sped up how fast I understand it. Six months in, the debt caught up."
datePublished: 2026-07-05T16:14:44.211Z
cuid: cmr7zrw0v00000ahv8rrz5xtk
slug: we-shipped-faster-the-debt-did-too
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/7926d8b1-a4b5-4d00-8c29-9f4024205745.png
tags: ai, technical-debt, software-engineering, developer-tools, ai-agents

---

You open a file you have not touched in months and your first instinct is to read it like it belongs to someone else.

Not because it is broken. Not because the tests are failing. Just because you do not immediately know where its edges are.

You gotta believe me when I say I had that feeling recently, on a module I last touched roughly six months ago. The code ran. The logic held. But I had to re-read it like the way you re-read code you did not write: slowly, looking for the load-bearing pieces, rebuilding a picture of why it works before I could safely change it.

I had written most of it. *"With help."*

The AI agent had generated large sections. I had reviewed, adjusted, and approved the diffs. At the time, the pace felt like a genuine unlock. Six months later, the code felt like something from totally different era.

That feeling has a name. I just do not usually expect it from a six month old code.

## The deferral deal was reasonable when debt was slow

Every team I have worked on had a version of the same arrangement. Not written anywhere, just understood. Debt built up, someone said "we should clean that up" before a release or during a quiet sprint, and a few of us did.

It worked because the debt built up at a pace we could outrun. I could hold that pace in my head. A feature took a week, maybe two, and "later" meant a real date I could picture, not a vague promise.

That is what calibration actually is. Not a policy. Not a perfect system. A feel for how much debt a stretch of work adds, built from doing the work slow enough to notice.

It only needs a name now because the pace it assumed is gone.

## AI changed the input rate. Nothing else did.

The first time I generated a real feature with an agent, I was surprised by how much showed up in a short time. Not just the volume. The structure. It read like a focused week's work, done in a few hours.

I reviewed it, tested the critical paths, and shipped it. What I did not reckon with was the ratio: a few hours of review against a few days of generation, not several days of review against several days of authorship.

When I write slowly, I carry the context without trying to, I know the tradeoff I made and why, because I was the one standing in front of it. That is where ownership comes from. Not from reading the diff after.

When the agent writes it, that pacing disappears. The output arrives complete, and my review catches the obvious errors. What it cannot do is hand me the memory of a tradeoff I was never inside long enough to make myself.

> It shipped like something I authored. It arrived like something I inherited.

Six months later, nobody on the team fully "knows" that module. It is not broken. It is just so dense in a way pre-AI code of the same age rarely was.

## Six months now reads the way three years used to

This is not about "code quality" in the obvious sense. What I got back was honestly better than I could ever write; well-structured, function names held, nothing looked like a warning sign. Bad code announces itself. This did not.

I.e. The module was an integration with an external provider handling bank transactions. I followed their documentation closely. It started clean, one responsibility per file. Then requirements arrived faster than I could sit with any single one, and since most of it was AI-assisted, the smells piled up quietly under that pace. Six months in, when something broke, I could not find the reason by reading the code. The file no longer explained the behaviour it produced.

I was not holding the quality bar as tightly as I should have either. But that is the point, right? The pace made it easy not to notice I had stopped.

That kind of code used to take years to arrive at, turnover, drift, decisions made by people who had already left. I got there in six months. Not because I got worse at my job but because the code arrived faster than the ownership that comes with it.

Heuristic I keep coming back to: generation rate went up, review depth did not, so the gap between what shipped and what I actually understand widens quietly, because the code still looks fine.

That is the condition the old deferral deal was never built for.

## Deferring to a later that does not arrive

The deferral strategy breaks at a specific point: when the cleanup sprint needed is larger than the capacity available for it.

That used to be a slow-moving threshold. A team could accrue meaningful debt over a year and still pay it down in a focused month. The math worked because the input rate and the cleanup rate were in the same range.

I did not clock this until I tried to schedule the cleanup for that six-month-old module and realised the sprint I would need did not fit anywhere on the roadmap. Not because the team was slow. Because the scope had outgrown what a sprint was ever built to absorb.

The comprehension side, the reading, the refactoring, the rebuilding of shared context, still runs at the pace I run at, because it is still my work to do. Nobody had documented why the decisions were made, so there was nothing to hand the agent that would have let it re-explain its own output. The understanding I needed had never been accumulated in the first place, and there was no shortcut back to it.

Six months of AI-assisted development had carried the density of what used to take two or three years to build up. The cleanup scope I was staring at was not what "we will get to it later" had ever budgeted for.

I do not think this is a failure on my part. The old calibration was reasonable. It was just built for a pace that no longer exists.

## I do not have the answer. I have a question.

I am not sure what the new approach looks like.

I have gone looking. I have not found a team, a process, or a tool that has solved this completely, not the seeing part and not the deciding part, two different seams. Nothing tells you which modules have quietly lost their owner, or where the gap between what shipped and what anyone actually understands has drifted past what a sprint can close. And even when you can see it, there is no established way to decide what happens next that does not require a refactor window nobody can schedule.

I am working on an idea in this space. Pretty early to call it a solution. But before I shape it further, a question popped in my head: is the problem I am describing real for anyone, or just real for me?

If you have felt this: is the harder problem that you cannot see how much AI-generated debt you are carrying, or that you can see it but have no system for what to do next?

*I wanna know which one.*