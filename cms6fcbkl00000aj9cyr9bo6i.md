---
title: "Every Session Starts From Zero. I Kept Forgetting That."
seoTitle: "Every Session Starts From Zero. I Kept Forgetting That."
seoDescription: "Why correcting an AI agent never sticks like correcting a person does, and what changed once memory stopped being something I assumed it had."
datePublished: 2026-07-29T18:34:41.701Z
cuid: cms6fcbkl00000aj9cyr9bo6i
slug: every-session-starts-from-zero-i-kept-forgetting-that
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/d002d0cb-8b01-45db-9c82-b40865629a55.png
tags: software-development, developer, developer-tools, build-in-public, ai-agents

---

You correct someone once. Not perfectly, but they get it. Next time, they do not make the same mistake. That is not optimism. That is just how correction works, "with people".

I worked with agents on that assumption for a long time before I even noticed I was doing it.

## The plan that never held

Before I had a single written rule anywhere, I would open a new session and ask for a plan first. Resolve the edge cases before touching a line of code, I said. The agent would agree, in whatever way a chat window agrees, and go straight to implementation anyway.

I corrected it. Same session, it adjusted. New session, next day, same repo, same everything except the chat history: straight to implementation again. Every single time!

So I did what looked reasonable. I wrote the plan myself. I resolved the edge cases myself, the open questions, the gaps the agent skipped past on its way to code. '**Tedious**' is the polite word for it. I was doing the one task I brought the agent in to do, and calling it collaboration.

## The same recipe, again

The second correction arrived the same way. Every repo had its own shape. A recipe, a standard, a way things were supposed to be built here and not there. I would explain it. Full session, good results, the agent following the standard like it understood the standard.

New session. Same repo, sometimes the new repo. Explain it again. Word for word, close enough. It was not that the agent forgot how to code. It was that nothing from the last conversation traveled with it into this one.

## Nothing said in the chat survives it

I kept treating this like a training problem. Say it clearer. Say it earlier. Say it with an example next time. None of that was wrong exactly. It was aimed at the wrong layer.

The actual mistake was assuming correction compounds the way it does with a person. It does not. A person carries what you told them into the next conversation without being asked to. An agent starts the next session exactly where it started the first one. Zero. The correction I gave on Monday was real, useful, entirely gone by Thursday, because it never lived anywhere except the chat.

That is the whole problem in one sentence. Nothing said in the chat survives the chat.

## Correction has to live somewhere

Once I saw it that way, the fix stopped being about phrasing and started being about location. A correction that only lives in a message is a correction I will give again. A correction written into something the next session actually reads, before it does anything else, is a correction that holds.

Every agent solves the memory problem the same generic way. A rules file, a skills folder, an instruction set read before the first token of code. Nothing unusual about that part. The cost shows up later, the day I switched tools. The rules that held for one agent stopped holding for the next, not because the recipe changed but because the folder, the syntax, and the format it expected were different every time. Portability was never free. It was just deferred to the day I changed agents.

That is the reason [FARE](https://jeelvankhede.github.io/frontend-ai-starter-recipes/) and [BARE](https://jeelvankhede.github.io/backend-ai-starter-recipes/) exist. Not to make agents smarter. To move the recipe out of my memory and my typing and into a file the agent inherits instead of me repeating it. The plan-first habit, the edge case resolution, the coding standard: all of it moved off me and onto a file the next session actually opened.

## The gap it did not close

It solved the style layer. It did not solve the sequencing layer. Agents still skipped review, still shipped code no one had tested, because a rules file tells an agent how to write code, not when to stop and check its own work.

That gap is what [agentsmyth](https://jeelvankhede.github.io/agentsmyth/) is for. Not a smarter memory, not a better prompt. A record on disk that each phase has to leave behind, so the next session inherits the reasoning instead of guessing at it again.

I do not correct agents the way I correct people anymore. People remember on their own. Agents remember only what got written down where the next session can find it.

*Every session starts from zero. I just stopped forgetting that.*