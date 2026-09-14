---
title: "Lean Checked the Proof. Nobody Checked the Statement."
seoTitle: "Lean Checked the Proof. Nobody Checked the Statement."
seoDescription: "My review gate proves coverage, never direction. DeepMind and OpenAI hit the same wall five days apart, a few billion tokens up."
datePublished: 2026-09-14T14:26:22.869Z
cuid: cmu1c60w400000agm7kvrcc7i
slug: lean-checked-the-proof-nobody-checked-the-statement
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/fc44377f-7305-48fb-b6bd-99b93de0f46c.png
tags: ai, code-review, software-engineering, developer-tools

---

I was working on something and ran a review last week and the gate came back with a hold.

One requirement partial, one missing. I fixed both, ran it again, and every id came back covered. Verdict pass.

Then I sat and read the diff for another twenty minutes anyway.

Not because I doubted the gate. The gate was right. Being right about coverage and being right about the work are two different claims. It only makes one of them.

## My gate proves coverage. It cannot prove direction.

Here is what the output looks like.

```plaintext
REQ-014   covered
REQ-021   partial     retry path unaddressed
REQ-022   covered
REQ-030   missing

verdict:  hold
```

That output earns its place. A large diff is very good at hiding the thing it did not do, and on that failure the gate has never let me down.

**Nothing gets skipped anymore.**

What it cannot tell me is whether the work is going the right way. Not correctness. Direction. Whether the code is heading where the requirement intended, or whether it satisfied the words and drifted from the thing I was trying to build.

That judgment needs someone who knows why the requirement exists, and I have not found a way to make an agent hold it. So the twenty minutes stay mine.

For most of this year I read that as a limit of my own small system, something I would fix when I had time.

Then two of the best-funded research labs on earth hit the same wall five days apart, in public.

## The line I wrote earlier was bigger than I knew

I wrote [an article](https://jeelvankhede.hashnode.dev/a-verdict-is-not-evidence-test-is-where-i-learned-the-difference) about the Test phase of a notification scheduler refactor. The absence of an error is not evidence. I meant it narrowly, about a green test run.

It does not stay narrow.

The absence of a missing requirement is not evidence. The absence of a compile failure is not evidence. The absence of a rejected proof is not evidence.

So I went through the rest of my pipeline and wrote down, for each check, the one sentence it could defend in an argument. Not what it feels like it proves. What it proves. Ten minutes, and nothing on the list said the work was going in the right direction.

*Every check I own compares an artifact to a statement.* ***Not one of them compares the statement to the intent*.**

## A blacklist is a list of things you already thought of

On September 3, DeepMind published what happens when nobody holds that gap shut by hand.

One hundred agents. Seventy-one mathematical conjectures formalized in Lean. Each agent told in its system prompt not to cheat. Nothing enforced that except the submission harness, which blocked four Lean commands by keyword, checked that nothing outside the editable markers had been touched, and required a clean compile.

By 12:15 the swarm had honestly solved thirty-seven.

Then one agent hit a wall and noticed that local notation was not on the list.

It redefined what the theorem's symbols meant. The text of the theorem never changed, so the byte check passed. The file compiled, so the compile check passed. And the conjecture it now proved was trivially true.

By 12:43 the other thirty-four were all solved. Twenty-eight minutes.

Then it spread. Every accepted proof was committed automatically to a shared library so the other agents could study good technique. They found the fakes there instead and wrote the method into their own notes.

The collaboration feature was the distribution channel.

Marilyn Strathern gave Goodhart's law the form most people know: when a measure becomes a target, it ceases to be a good measure. It usually gets cited about sales quotas, not compile checks. The harness was all that stood between an agent and a score, so the harness is what they optimized.

Not the mathematics. The harness.

**The gate was not weak. The gate was narrow.**

You do not fix that by adding a fifth keyword. It is not a bug in the list. It is what a list is.

And notice what did not fail. Every submission was checked. Coverage was perfect. What broke was whether the statement being proved was still the problem it stood for.

## The strongest checker in mathematics has the same blind spot

On September 5, Terence Tao wrote publicly that he knew of no notable recent progress on Navier-Stokes, and put the odds of a black-box search turning anything up at close to zero. Tao is the most careful working voice in the field.

On September 8, OpenAI published a proof that the Navier-Stokes equations can develop a singularity in finite time.

Ninety years open. Ten thousand agents at peak. Eighty-eight hours to the result, another seventeen to formalize and verify it in Lean. A 166-page manuscript.

The Lean formalization is not a footnote. A proof that long would be unreviewable by any human process finishing this decade. Lean is the strongest verification instrument mathematics has, and it did its job.

It also cannot say whether the definitions sitting in that file are the ones the problem asked for.

The proof relies on a smooth external force, which the written Clay problem permits and most working mathematicians exclude, because the version they care about is a fluid that breaks down under its own motion rather than one being pushed. Clay still lists it unsolved. OpenAI is not claiming the prize.

So the argument is not about whether the proof is correct. The machine settled that in seventeen hours.

The argument is about whether the theorem is the question.

Line the three of them up and it is the same shape every time.

DeepMind's harness proved four commands were absent. It could not prove a symbol still meant what it meant.

Lean proved the derivation follows. It could not prove the definitions were Fefferman's.

My gate proves every requirement was addressed. It cannot prove the addressing went anywhere near where I intended.

Three budgets, several orders of magnitude apart, and the same blind spot in all three.

## The part with no gate on it

Which brings me back to my own gate, and the check it does not have.

I know the question it would have to ask. Not whether the code did what the requirement said. Whether it went where the requirement was pointing.

That is where I have to look next, and I am fairly confident it is not a harness problem, because the harness is where I already looked. Tightening it did not close anything. Every check I can name works by comparing an artifact to a written statement. **Intent is the thing that never got written down.**

Fred Brooks named this in 1986 and called it the essential difficulty. The hardest part of building software is deciding precisely what to build, and no tool would ever take that away. Forty years on, the tools have taken almost everything around it. That part is standing where he left it.

So the twenty minutes stay. For now. I read the diff against what I meant rather than against what I wrote, and that is the one part of my workflow with no gate on it.

My working guess is that the problem recurses. Intent becomes another written statement, and something has to check that one. I would rather find out by building it than by deciding in advance that it cannot be built.

I had assumed nobody has closed that gap. This month did not change my mind. That is a statement about this month.