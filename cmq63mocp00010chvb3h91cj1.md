---
title: "Review the code that does not exist yet
"
seoTitle: "Review the code that does not exist yet"
datePublished: 2026-06-08T17:00:00.000Z
cuid: cmq63mocp00010chvb3h91cj1
slug: review-the-code-that-does-not-exist-yet
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/95570361-b8f1-4cf4-be70-cf6d220a31b4.svg
tags: ai, code-review, programming-blogs, best-practices, software-engineering

---

I have reviewed code for years, and for most of that time the habit was simple. Open the diff. Read every line. Find what is wrong. It worked, and it worked for a boring reason: the diffs were small because writing code by hand is slow.

The diffs are not small anymore.

A pull request now arrives with twenty files in it, built in an afternoon, more code than I could have written by hand in a week. The old habit does not fit a change that size. It bends, then it breaks. So I had to ask a question I had spent years quietly avoiding.

What is a code review actually for?

## The first thing I lost was the point

Few years ago, I was the senior reviewer on a small team. I took the role seriously. Maybe too seriously.

I opened each pull request hunting for faults. Indentation. Naming. A function that could be three lines shorter. A pattern we had agreed not to use. I found them. I was good at finding them. It felt like the job. Every comment was proof that I had been paying attention.

One day I left seventeen comments on a frontend pull request.

It was a CSS-heavy change, and CSS changes are hard to review on a diff. The developer had not followed the UI design standards we had set as a team. Almost none of them. So I went through it line by line and marked every single thing I could find. I sent it back.

I felt like a jerk afterward. But I also thought I had done the right thing.

Then I looked at what I had actually been reviewing.

I had read every line. I had not read the work.

The developer had built exactly what was asked. The feature worked. It was a clear, self-contained piece of UI. And I had spent the entire review arguing with the formatting, as if the formatting were the thing we shipped to users.

That is the day I started reviewing code for a different thing. Not for what it does the moment it lands. For what someone will do to it next.

This is not an argument for shipping mess. I still send back work that buries its intent under careless code, because code that is hard to understand is hard to change, and hard to change is where the real cost lives. The difference is that I keep room for an exception now. I do not treat every rule as a wall I am paid to defend.

A rule is a tool for protecting intent. When I started treating the rule as the point, I forgot what it was protecting.

I had been reviewing the rules. I had stopped reviewing the work.

## Then the diffs got faster than I could read

For a long time that lesson stayed quiet. Useful, but never urgent.

Most pull requests were small, because authoring was slow, and a reviewer could keep pace with an author without much strain. One person wrote for a day, another read for an hour, and the arithmetic worked. The whole practice of review was built on that arithmetic.

Then people started building with AI.

Now a change lands with twenty files. Different layers, different concerns, all in one push, all produced faster than I have ever produced anything in my life. And my first thought is almost always the same.

This is over-engineered.

Sometimes it is. Often it is not. The instinct fires not because I have judged the design, but because the sheer size of the thing is unfamiliar, and unfamiliar reads as wrong. The honest problem is mine. I could never have written that much code in a day. Reviewing it in a day was the part that unsettled me most.

The bottleneck moved.

AI made writing code cheap. It did not make reviewing it cheap.

Authoring used to be the slow and expensive step, and review was the quick sanity check at the end. That order has flipped. The code now arrives at almost no cost. The judgment about whether the code is right costs exactly what it always did, because judgment was never the part AI made faster.

The bottleneck did not disappear. It moved onto my desk.

## So I changed what I look for first

If I cannot read twenty files the way I read two, then reading every line first is the wrong opening move. It is slow. Worse than slow, it is misaimed. It spends my sharpest attention on the smallest things, early, while the largest things wait, unread.

So I stopped starting with the code.

I start with intent. What is this change trying to do, and does the shape of it match that goal? Does the structure tell the same story the description promised? Only after those questions do I care how any individual line is written.

This is what I mean by reviewing the code that does not exist yet.

The diff in front of me is temporary. It is the least permanent thing in the whole exchange. Someone will change it in six months. Someone will debug it at two in the morning with half the context I have right now. Someone will push it past the scale the author ever imagined, and watch it fail in a way nobody designed for.

Those people are who the review is really for. Not the author, who already understands the change. Not me, who will forget it by next week. The stranger who inherits it.

The diff is what changed. The future is what I am approving.

## The order is the method

Over time my questions settled into an order, and the order turned out to be the whole point. It is not a list to tick off until every box is full. It is a path, and most of it happens before I judge a single line.

It runs like this.

What is this trying to do? → How did they solve it, and would I have solved it differently? → What trade-offs or unknowns are sitting in plain sight? → Does this actually improve the thing, or is it added weight, a time bomb waiting for the day nobody is watching? → Am I sure?

Each question guards against a different failure.

The first keeps me from reviewing a change I do not understand. The second keeps me honest about the difference between a real problem and my personal taste. The third is where most of the danger hides, because the dangerous parts of a change are rarely the loud ones. The fourth is the one that only gets answered in production, usually later than you wanted. And the last question, am I sure, is the one I added for myself, because the worst approvals I have given were the confident ones.

Only after all of that do I open the files and read them line by line, with no mercy.

Look at where the strict part lives. At the very end.

Everything before it is about understanding the work and arguing with my own judgment. The line-level pass is not the review. It is the last step of the review, and it only earns its place once the rest has cleared.

You earn the right to nitpick. You do not start there.

## This is not permission to ship slop

I can hear the objection, because I would raise it myself. Does intent-first mean a lower bar? Does it mean waving through sloppy code as long as the idea behind it is clear enough?

No.

The strict pass still happens. It happens last instead of first, but it happens, and nothing on the list above is a substitute for it. Intent-first is not standards-free. It is the same standards in a better order.

And there is a newer risk that makes the order matter more, not less.

Volume hides intent.

A twenty-file change can be correct in every single file and still be dangerous, because no one person can hold the whole of it in their head at once. The failure is not in any one line. It lives in the space between the files, in an assumption made in one place and quietly broken in another.

About nine months ago a pull request landed on my desk with forty-five files in it. I was lenient. I skimmed the parts that looked safe, approved what looked obvious, and moved on.

Six months later the APIs started creating duplicate transactions in production. We could not find the root cause. The file at the center of the problem had grown to over five thousand lines of code, and the issue was buried inside of it.

It took a long time to dig out. That change had looked fine in every file I checked. I had just never asked whether it was wise.

Reading for intent is how I catch that before it merges. A checklist cannot — it looks at each file alone.

A checklist can tell me the code is correct. It cannot tell me the code is wise.

The fear I started this with never left me. I have just stopped fighting it, and started letting it sharpen the right questions.

I did not learn to read faster. I learned to read in the right order.

## What I actually approve

This is what I think a review is.

I am not the spell-checker. I am not the gate that catches a missing semicolon or an unused import. I am the person asking what this change will do to whoever inherits it, long after the author and I have both moved on.

That question works at every level of experience, because it is a question and not a rule. A new engineer can ask it on their very first review. A senior engineer asks it on their thousandth. Nobody is too junior to wonder what happens to this code in a year. Seniority does not exempt you from the question.

And it has a limit I have started to feel.

A reviewer can only do so much when the pull request is fighting them. If the intent is buried, if twenty files arrive with no story to tie them together, if the risky change is hidden in the middle of a dozen safe ones, then no amount of patient reading will rescue the review. The reader cannot supply a clarity the author refused to provide.

Which means half of this problem was never the reviewer's at all. It belongs to the person opening the pull request. That is the other [half of the story](https://jeelvankhede.hashnode.dev/open-the-pr-your-reviewer-has-not-met-yet), and it deserves its own piece.

Review is not about the code in front of you. It is about the code that comes after.