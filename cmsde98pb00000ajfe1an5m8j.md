---
title: "Anyone Can Build Software Now. We Tried That Already."
seoTitle: "Anyone Can Build Software Now. We Tried That Already."
seoDescription: "Before AI, the spreadsheet let anyone build software without knowing how to code. The bill came due in billions. History is repeating, faster."
datePublished: 2026-08-03T15:38:41.633Z
cuid: cmsde98pb00000ajfe1an5m8j
slug: anyone-can-build-software-now-we-tried-that-already
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/a8f03de2-c079-4562-be95-3d106217d9ed.png
tags: ai, software-development, developer, developer-tools, build-in-public, ai-agents

---

Somewhere on your feed right now, someone is bragging about the app they built in a weekend, no engineering background, no team, just a prompt and a Saturday. The post always ends the same way. Look what I built without needing any of you.

*Anyone can build software now.* That is the whole pitch, repeated in a hundred different captions this month alone.

Here is what that post never shows you. The part where someone checks it.

Not "does it run." Checks it. Someone who did not write it, looking for the version of it that fails, the input nobody thought to try, the assumption that was wrong in a way the builder was structurally the worst person to catch, because they were too close to their own idea to see the hole in it.

That someone is not optional. It is the actual job.

None of this is theoretical. A notification icon that, instead of opening a panel, closes the entire page and drops me back on an empty tab. A video call that disconnects mid sentence for no visible reason. A video that plays with the sound simply gone, until I restart it. I do not have a chart proving reliability across the industry is getting worse. What I have is a pattern I keep running into, on products built by some of the most resourced engineering organizations on earth.

## Why software engineering has more than one person in the room

A developer writes the code. A reviewer reads it before it merges. QA tries to break it on purpose. A manager decides if it is actually ready, or just finished. None of these roles exist because engineers do not trust themselves. They exist because a single person, however good, cannot see their own blind spots. That is not a flaw in the person. It is a fact about how blind spots work.

*Ten sets of eyes exist so that the eleventh mistake gets caught before a million people hit it.*

We have already watched what happens when that layer disappears, and we did not need AI to run the experiment. We ran it with the spreadsheet.

## The spreadsheet already showed us the cost of skipping this

In 2012, JPMorgan Chase lost 6.2 billion dollars in the London Whale trade. Investigators traced part of the failure to a risk model where a formula divided by the sum of two numbers instead of their average. Someone had copied and pasted the wrong range. Nobody caught it before the number went into a report that told the bank its risk was lower than it actually was.

Raymond Panko, a University of Hawaii researcher who has spent decades studying exactly this failure, put it in nine words:

> Spreadsheet programs are not error-prone. People are error prone.

He is right, and he is making a narrower point than it sounds like. The tool did not cause the loss. **The absence of anyone checking the tool did.**

In 2010, Carmen Reinhart and Kenneth Rogoff published a paper arguing that growth slows sharply once public debt passes 90 percent of GDP. Governments cited it for years while deciding how hard to cut spending. In 2013, a graduate student trying to replicate the result found a formula that had quietly excluded five countries from the average. Corrected, growth in the high debt group went from negative 0.1 percent to positive 2.2 percent.

That error sat unreviewed for three years, informing real policy, because nobody with the standing to check the underlying spreadsheet did, until a student did it for a class assignment.

Neither of these was a skill problem. Both were a review problem. The tool made something that looked finished. Nobody treated "looks finished" as different from "is correct."

## The AI version of this is worse, because it can close the whole loop

A spreadsheet could not review itself. It could not test itself, or decide it was done, or ship itself into production. A human still had to be the one who trusted it too much.

AI coding tools are closing that gap. Not just writing the code, but reviewing it, testing it, and in some workflows, deciding it is ready, with no human required at any step. That is a different category of risk than "the code was written badly." It is the removal of the entire mechanism that would have caught JPMorgan's formula, or Reinhart and Rogoff's missing rows, before it cost anyone anything.

I am not arguing AI should stay out of engineering. I use it every day, and it makes me faster at parts of the job that used to be slow for no good reason. The argument is narrower than that, and I think it is the only argument that actually holds up: **AI has not proven it can review its own work the way a second, independent, motivated engineer does.** Not yet. It is getting better at an uncomfortable pace, and I would not bet against it eventually closing that gap. It has not closed it now, and treating the current state of the tools as if they already have is the reckless part, not using them.

## Why I build what I build

This is the reason I built agentsmyth. Not another assistant that writes code faster. A contract the agent you already use agrees to follow: seven gates, Think, Plan, Build, Review, Test, Ship, Reflect, each one leaving a real artifact behind instead of reasoning that evaporates the moment a chat scrolls off screen. One command, `npx agentsmyth init`, wires it into a repo. Skipped checks get recorded as risk, not hidden. Nothing ships on the strength of looking finished.

Its own pitch is two words. *Forge, don't vibe.*

I do not know if that is the full answer to the problem this piece describes. It is the piece of the problem I can actually put my hands on. If AI is going to keep closing more of the gap between an idea and a shipped feature, someone still has to decide where the edges of that gap are, and someone still has to check the work against them. I would rather build the scaffolding that forces that check to happen than write another post about how nobody needs it anymore.

## The reliance itself is not the problem

The completeness of it is.

Until an AI system can review its own work the way a second engineer does, at two in the morning, with their own name on the outcome and nothing personal riding on being agreeable about it, the review layer does not get to be optional. That is not an argument for keeping developers employed out of sentiment. It is the argument for making sure the next six billion dollar mistake does not ship quietly, built fast, reviewed by no one, because everyone involved assumed the tool had already checked its own work.

It had not. It still has not. Build with that in mind, and the weekend app stops being something to brag about and starts being something to be honest about.