---
title: "The Harness Converges. Rules Decide What It Converges On."
seoTitle: "The Harness Converges. Rules Decide What It Converges On"
seoDescription: "A better harness reaches the target faster. It cannot choose it. Three questions that decide when a rule loads, and a test for rules that port."
datePublished: 2026-09-29T17:10:19.925Z
cuid: cmumxmn7n00000agma11b5izf
slug: the-harness-converges-rules-decide-what-it-converges-on
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/5fb3e08c-9983-4626-b95a-ef3847d97d11.png
tags: ai, software-development, opensource, developer-tools, ai-agents

---

You point the agent at the repo. It plans. It writes. It runs the tests, reads the failures, fixes them, and hands you back something that works.

You read the diff. It is fine.

It is also not how anyone on the team would have written it.

That gap is the thing I keep coming back to, and I am aware that saying so in late 2026 sounds like relitigating an argument everybody finished having. Rule files were a 2025 conversation. Writing about them now feels like showing up to a meeting a year late with slides nobody asked for.

## It was not settled. It went out of fashion.

The harnesses got genuinely good in that year. Planning loops. Verification passes. Sub-agents that go off and come back. Context windows large enough that the old economy of what to include stopped feeling urgent.

All of that carries an implicit promise. A capable enough agent reads your project and infers your project. Pointing it at a rules directory starts to look like manual labour left over from a weaker era.

So attention moved to the interesting layer. That is a reasonable thing for attention to do.

But nobody disproved the groundwork. It just stopped being the part worth talking about.

## A harness closes the loop. It does not supply the target.

Slop is not the agent being incompetent. That is the easy explanation, and it is the wrong one.

Slop is the agent converging, competently, on the average of everything it has ever read, because nothing in the repo told it which of the plausible answers was the one you wanted.

A verification loop tests output against a target. A planning loop sequences work toward a target. Neither of them produces the target. If it does not come from you, it comes from the distribution, and the distribution's opinion about your error handling is the median of every tutorial ever written.

Which means every improvement to the harness raises the cost of skipping the groundwork rather than lowering it. A weak harness that guesses wrong wanders, and you notice. A strong harness that guesses wrong arrives somewhere quickly, confidently, with passing tests wrapped around it.

Seneca got there about two thousand years early.

> Our plans miscarry because they have no aim. When a man does not know what harbour he is making for, no wind is the right wind.
> 
> Seneca, *Letters to Lucilius*, Letter 71 (tr. Gummere)

The harness is the wind. It keeps getting stronger. The harbour is still yours to name.

## The decision is not what to write. It is when it loads.

I have twenty-two rules across the two generators I maintain. Thirteen for the frontend one, nine for the backend one.

The content of each rule is the obvious part. The part that actually shapes the output is when each one enters the model's context. That decision has exactly three shapes:

```ts
export type CursorRuleMeta =
  | { alwaysApply: true }
  | { alwaysApply: false }
  | { globs: string[] };
```

Three states is not a limitation I worked around. It is the whole design surface, and every rule I wrote had to land in one of them.

Architecture and security are always on. Anything an agent changes has to be checkable against structural intent and against known vulnerability shapes, and the cost of either being absent once is higher than the context they burn on every single turn.

Design and styling are not like that. They are irrelevant until you touch a component, at which point they matter completely. So they load on the files they govern and stay quiet otherwise.

Git conventions and pre-commit behaviour are the third kind. Following them is not mandatory on every turn. Paying for them on every turn is waste. They sit off by default and come in when the work is actually about commits.

None of those were hard calls. Once the question is asked, the answer is usually obvious. The failure is not answering it badly. The failure is never asking it, and letting a single instructions file load every rule on every turn by default.

## Every rule went through the same three questions

Does a wrong answer here cost more than the context it burns on every turn? Then it is always on.

Is it only true when the work touches particular files? Then it loads on those files and nowhere else.

Is it advisory rather than mandatory? Then it stays off until the work is about that thing.

Seven of the thirteen frontend rules, in file order:

```ts
export const RULE_CURSOR_METADATA: Record<string, CursorRuleMeta> = {
  architecture: { alwaysApply: true },
  components: {
    globs: ['**/*.tsx', '**/*.vue', '**/*.svelte', 'src/components/**/*'],
  },
  'errors-logging': { alwaysApply: true },
  security: { alwaysApply: true },
  environment: {
    globs: ['.env*', 'src/config/**/*', 'vite.config.*', 'next.config.*'],
  },
  'git-conventions': { alwaysApply: false },
  'pre-commit': { alwaysApply: false },
};
```

Across the full thirteen it comes out as three always on, eight scoped, two off. That split is the whole output of those three questions, and it is the part that never shows up in a post about writing better prompts.

## A rule that cannot be ported was never a rule

I did not write those rules for one editor. I treated the rule set as a small DSL and built adapters that emit it to five different tools, because teams do not converge on one tool.

Designing for five targets from the start forced a discipline I would recommend even to someone who only ever uses one.

A neutral rule survives translation. It lands in every target and still means the same thing. A rule that is too specific does not, and the reason is always the same. It is not encoding intent. It is encoding mechanism. A file path. A config shape. A framework's current API. Something true about the setup rather than true about the work.

Mechanism is the part that changes. It changes when you upgrade the framework, when you move a directory, when the vendor renames a field. Intent survives all of that, which is why intent is the thing worth writing down and mechanism is the thing that quietly rots in a rules folder nobody has opened since it was written.

So there is a test here you can run without my tool and without my adapters.

Take a rule and move it to a different agent. If it stops making sense, you wrote down your setup instead of your intent. Rewrite it one level up and it ports.

It also gives the harness something to converge on. Mechanism tells the agent how your project is wired. Intent tells it what you are trying to get right, and that is the only one of the two a verification loop can aim at.

## This is evidence. It is not proof.

I have not measured a quality delta. There is no benchmark where the same repo with and without rules produced a countable difference, and I am not going to construct one after the fact to make this read stronger.

What I have is a design argument and a shipped implementation of it. Twenty-two rules, three activation states, five targets, and the reasoning behind every classification sitting in a file anyone can open.

That difference matters, and I would rather name it than let the code fences imply something they do not support.

## Boring is not the same as optional

The harness is going to keep getting better. The planning will get sharper, the verification will get tighter, and the layer I am describing here will keep looking like the unglamorous part a sufficiently good agent should not need.

It will not stop needing it. Faster convergence toward an unspecified target is just a faster way to arrive somewhere you did not choose.

I do not think the interesting question is whether rules still matter. The better question is why we keep treating the part that supplies intent as the part that will eventually automate itself.

> Awaiting your feedback!  
> [**F**rontend **A**i starter **RE**cipes](https://jeelvankhede.github.io/frontend-ai-starter-recipes/)  
> [**B**ackend **A**i starter **RE**cipes](https://jeelvankhede.github.io/backend-ai-starter-recipes/)