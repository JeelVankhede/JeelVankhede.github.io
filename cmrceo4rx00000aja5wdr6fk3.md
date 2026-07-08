---
title: "A Verdict Is Not Evidence. Test Is Where I Learned the Difference."
seoTitle: "A Verdict Is Not Evidence. Test Taught Me Why."
seoDescription: "A code review passed with a named risk. Nobody had run it. Part 6 of The Contract: why a recommendation isn't proof until something executes."
datePublished: 2026-07-08T18:22:47.887Z
cuid: cmrceo4rx00000aja5wdr6fk3
slug: a-verdict-is-not-evidence-test-is-where-i-learned-the-difference
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/1189eade-6de6-4afa-b074-811d92a76456.png
tags: code-review, software-development, software-testing, developer-tools, ai-agents

---

The call-order change came back pass-with-risk. I read the recommendation, saw it had a name and a reason, and felt the task close.

Then I looked at the row under it. How was this verified: not run.

Nobody had run the queue. I had a label. I did not have proof.

## This is Part 6 of The Contract

Think produced a brief. Plan produced a gate. Build executed inside it. Review scored every requirement against a verdict instead of an impression.

Review reads the diff and the plan and decides whether one satisfies the other. It does not run the queue. It cannot. Its whole job is judgment about what the code should do.

Test is where someone finally checks what the code actually does.

I had been treating those two as the same step. They are not.

## Test asks one question, and a verdict is not the answer

For every active requirement, Test asks how it was verified. Command run, manual QA, or a comparison against known-good output. One of those three, or a written reason none of them ran.

Not a recommendation. Not a risk level. Evidence.

I built the matrix against the plan's requirements and filled in each row. Most had a command behind them. The call-order requirement had nothing. The cell read not run, and it sat directly below a pass-with-risk that already carried a name and a reason.

That name had almost been enough for me. A named risk feels handled. It is not. It is a risk with a label on it, waiting for someone to actually look.

## So I ran the queue

Three notifications, all with a real reason to fire within the same tick. The scheduler picked them up and ordered them by priority instead of arrival.

Two landed in the sequence the requirement wanted. The third jumped ahead of a lower-priority notification that was still mid-processing.

The change worked almost every time. Under one timing condition, it did not.

That is the gap a verdict cannot see. Review had marked the requirement partial because the wording left the mechanism open. Running it found a real failure inside the mechanism the code had chosen. Same requirement, two different holes, and only one of them shows up when you execute.

The absence of an error is not evidence. I had to run the thing to learn the error was there.

## The skipped check looked exactly like the ones that passed

Here is what unsettled me. If I had left that cell at not run, the matrix would have shown three green rows and one blank, and nothing about the blank would have raised its hand.

A skipped check is a risk hiding in sheep's clothing. It sits in the same table as the passing rows, formatted the same, quiet the same. Nobody flags it, because it does not look like a gap. It looks like the others.

Done and unverified render identically on the page. The only way to tell them apart is to do the check.

## I almost deleted the failure after I fixed it

I fixed the ordering. Reran the check. It passed under the same timing condition that had broken it a minute earlier.

Then my hand went to the failure row to clear it. The bug was gone. Why keep a record of something that no longer happens?

I stopped, because the record was the point.

The matrix is not a snapshot of the final state. It is the evidence that the check ran at all. A row that only shows the passing rerun tells the next engineer nothing. A row that shows the failure, the fix, and the clean rerun tells them exactly where the edge was and how close the code came to crossing it.

I kept both rows. Deleting a fixed failure is not tidying up. It is erasing the only proof that anyone ever ran the check.

## What Test actually gates

Test does not gate on whether the code works. It gates on whether every requirement has evidence behind it. Command, manual QA, output comparison, or an explicit skip with a reason, a risk, and an owner.

Not run is not a resting state. It resolves into evidence or into a named, owned risk, and until it does, the recommendation stays at hold.

Mine resolved. The recommendation came back ship, not because the first run was clean, but because the one requirement with a crack in it now had proof under the words instead of just the words.

**A key takeaway:**

> *This is not just a template for this article. It is the skill from the workflow I run after every review pass, before anything reaches Ship.*
> 
> *To summarise,* `test` *skill builds a verification matrix against every active requirement, runs configured commands where available, records manual QA and generated-output checks, and treats every skipped or not-run check as risk with a named owner rather than a silent pass. It writes a verify artifact that Ship can trust, and it will not let a recommendation past hold or hold-with-waiver until every row is accounted for.*
> 
> *Download it. Give it to your agent. Drop it into a task with an approved plan and a completed review. Watch it refuse to call something done until it can show you the evidence.*
> 
> *The verify artifact it produces is proof that Test ran inside the contract.*
> 
> [*test.md on GitHub Gist*](https://gist.github.com/JeelVankhede/e6a16d915bb8ecd6fdaf2a4d14697fa6)