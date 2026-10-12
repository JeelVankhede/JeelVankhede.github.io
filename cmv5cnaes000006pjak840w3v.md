---
title: "AI Slop Is the Second Ship"
seoTitle: "AI Slop Is the Second Ship of Theseus"
seoDescription: "Athens replaced every plank of Theseus's ship and kept sailing it. Hobbes built a second ship from the old planks. AI builds it daily."
datePublished: 2026-10-12T14:30:35.399Z
cuid: cmv5cnaes000006pjak840w3v
slug: ai-slop-is-the-second-ship
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/25a2adef-f72e-48fb-8e95-7dde9384650a.png
tags: ai, software-development, philosophy, ai-agents

---

As the story goes, Theseus sailed to Crete, killed the Minotaur, and brought home the young Athenians who had been sent there to be fed to it. The ship that carried them had thirty oars. Athens decided it was too important to lose.

So the city kept it. Every year it sailed to Delos on a sacred voyage, and that voyage mattered so much that Athens paused all executions until the ship came back. Socrates spent his last month alive waiting for it.

Your ship is less glamorous. It is a "retry module for the payments service". It wraps calls to the payment provider, waits a little longer after each failure, and gives up after a few retries.

One line in it matters more than the rest. It refuses to retry a charge unless the request carries an idempotent key, a tag that lets the provider spot a repeat. Someone added that line after a bad week, when a flaky network turned one payment into two.

The module works. The team builds on it. It becomes too important to lose.

## The first plank rots

Wood does not last forever. When a plank on Theseus's ship rotted, the shipwrights pulled it out and fitted a new one. Plutarch describes them "putting in new and stronger timber in their place." The crew knew which plank had gone, and why.

Your module gets its first rotten plank too. An agent refactors the backoff into something cleaner. You read the diff. You understand it. You approve it.

Then the logging. Then the tests. Then the part you were proudest of, because the agent's version reads better. Each change is small, and each one is reviewed. A year later, almost nothing you typed is left.

*Every plank replaced, one sensible change at a time.*

Is it still your module?

The philosophers asked the same thing about the ship. I think the answer is the same in both cases. **Yes.** The ship never stopped sailing, and every plank was replaced by people who knew what the ship was for. Your module never stopped running, and every change passed through someone who knew why the idempotent line was there, and kept it.

**Replacing planks was never the problem.**

Scott Robinson has named the version of this that goes wrong, [Theseus Slop](https://unstack.io/theseus-slop): a codebase replaced until you own it without understanding it. That failure is real. But the old story has a stranger second half.

## Someone collects the old planks

In 1655, Thomas Hobbes added a character to the paradox.

Suppose someone followed the shipwrights and kept every plank they threw away. Suppose he fitted those planks back together, in the same order, and built a ship out of them.

Now Athens has two ships.

**One has the voyage. The other has the wood.**

Your codebase gets its second ship too.

A new service needs to call the same payment provider. A teammate, short on time, asks an agent for "a retry wrapper like the one in payments." The agent does not copy your module. It assembles one from the planks it learned on: thousands of retry wrappers from public code, tutorials and answers. None of them were there for your team's bad week.

The new module compiles. It has exponential backoff, a maximum attempt count, clean logging. From the dock it looks exactly like yours. The tests pass, because nobody wrote a test for a line nobody knew should exist.

It has no check on idempotency. Not because anyone removed it. Because nobody aboard ever knew it belonged there.

## The second ship goes to sea

Hobbes's second ship never sailed anywhere. It did not need to. Its whole problem was that it claimed to be the ship that had been to Delos.

Your second ship does sail. The first afternoon the provider is slow, it retries every charge that timed out. Some of those had already gone through. Customers get billed twice. The team opens the file. Nobody can say why it retries charges, because nobody ever decided that it should.

That is how I have started to think about the word slop.

> AI slop is not the ship with every plank replaced. It is the second ship.

John David Pressman has a line in his essay [On Slop](https://minihf.com/posts/2025-10-02-on-slop/) that fits it exactly: "Slop is generated from the authors prior without new thinking or evidence."

"AI wrote it" is not the test. Your original module was also rewritten by an agent, plank by plank, and it is still your ship. The Athenians did not grow their own timber either. New wood always comes from somewhere.

The difference is the voyage. One module was changed by people who knew what each plank was holding up. The other was assembled from the average of every retry wrapper on the internet, and it shipped because it looked like a ship.

## The plank test

Both ships look identical from the dock. You cannot tell them apart by reading the wood. You can tell them apart by asking about it.

**Point at any plank and ask why it is there.**

If someone can answer without reverse-engineering it, the plank belongs to Theseus's ship. If the only honest answer is "the model put it there," it belongs to the second ship.

|  | Theseus's ship | The second ship |
| --- | --- | --- |
| Who chose each plank | The crew that sails it | Nobody |
| Where it has been | To Delos and back, every year | Nowhere |
| *In the codebase* |  |  |
| Backoff between attempts | Rewritten by an agent, reviewed, understood | Generated, never questioned |
| Idempotency check | Added after the bad week, kept through every rewrite | Missing |
| "Why is this here?" | Someone can answer | "The model put it there" |

The test does not care how many planks were replaced, or who cut them. It only cares whether somebody chose each one.

A few second-ship planks will slip into any codebase. The trouble starts when they stop being rare, because each one is a part nobody knows how to repair when it cracks at sea.

## Somebody has to keep sailing it

The Athenians never answered the philosophers. They kept sailing the ship to Delos every year, and that was answer enough.

I think it is the only answer available to us too. The model will keep supplying planks faster than any of us can cut them. A codebase stays ours as long as someone aboard knows why each one went in.

*Replace as many planks as you like. Just do not let one in that nobody can explain.*