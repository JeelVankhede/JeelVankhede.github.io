---
title: "Every Requirement Gets a Verdict. I Had Been Reviewing Without One."
seoTitle: "Every Requirement Gets a Verdict, Not a Feeling"
seoDescription: "I trusted three phases without checking them. Review forced a verdict on every requirement, and one of them was not what I thought."
datePublished: 2026-07-02T17:25:45.787Z
cuid: cmr3rzo9000000aj8ammf1jp7
slug: every-requirement-gets-a-verdict-i-had-been-reviewing-without-one
cover: https://cdn.hashnode.com/uploads/covers/6a190ded78258754835f0cf3/6eec2866-f25a-47cc-81b3-6e5914099990.png
tags: code-review, software-development, engineering, developer, ai-agents

---

You merge the PR. The build passes. The code does what you expected it to do. You move on.

That is review for most engineers. A final read. A feeling that things looked right before the branch closed.

I did it the same way for years.

Three phases had already run before this one. Think had scoped the work, Plan had written the requirements, Build had shipped a diff that matched the plan exactly. I trusted that the chain held. I had never actually checked.

Then I ran the Review phase, and checking turned out to mean something specific: not does this work, but does this requirement hold up, and what is my evidence.

I went in expecting to approve it or send it back. The phase gave me three answers instead: covered, partial, missing. I found out what they meant one requirement at a time, starting with the one I almost got wrong.

## I had been giving impressions, not verdicts

The notification scheduler used a queue to manage dispatch. Every call to the external provider went through it. The provider was never exposed directly. The requirement said the provider must be notified. It was notified, exactly the way I had pictured it.

I almost called it covered and moved to the next line.

The Review phase stopped me there. But the requirement said *must be notified*, not how. The queue had introduced a call order and a timing the requirement never anticipated. Nothing was broken. Something had changed shape, quietly, and nobody had written that shape down.

I sat with that for longer than I expected to. Not because the code was wrong. Because I could not immediately tell you whether the change mattered.

The same pass gave the shim from Plan a different verdict on the same page: covered. Mapped to the requirement it existed to satisfy, no gap between what was promised and what was in the diff.

One requirement held exactly the shape it was given. The other had quietly grown a new one. Same review. Same pass. Two verdicts.

Partial is not a softer word for broken. It is the verdict for *this much, no more, and here is exactly where it stops.*

## Naming the risk I almost skipped

A partial verdict did not resolve on its own. It forced a recommendation I had never had to give before: pass, pass-with-risk, or hold. The two options I knew, approve or send back, had no room for the case that actually mattered, the one where the code worked and the requirement was still uncertain.

I had to decide, in writing, whether the queue change mattered enough to hold the work. It did not feel small in the moment. The provider was being reached. The queue was deliberate architecture, not an accident I had stumbled into. But I could not confirm the call order and timing from the diff alone, and pretending I could would have been the same thing I used to do without a name for it.

I wrote it down as pass-with-risk. Not because the risk had gone away. Because I had looked at it directly instead of letting it pass quietly, the way every requirement before this phase had been allowed to.

Pass-with-risk is handing off the baton with the crack already named.

## The contract was not three phases

Review is the first phase that looks backward and forward at the same time. Backward at everything Think, Plan, and Build produced. Forward at what Test will have to verify because Review could not finish the job alone.

*"Looks good to me"* was never a verdict. It was an impression wearing a verdict's clothes, and I had been handing those out for years without noticing the difference.

Covered. Partial. Missing.

I cannot unlearn that vocabulary now. The next time I review a diff without it, I will feel exactly what is missing, the way I never could before this phase existed.

Test runs next. It will find out whether pass-with-risk was the right call, or just a well-documented mistake.

**A key takeaway:**

> This is not a template I built for this article. It is the skill I run after every plan and build pass.
> 
> The `review` skill inspects the actual diff against the brief, plan, and task artifacts, not against intent or memory. It maps every active requirement to covered, partial, or missing, runs a blocking pass and a non-blocking pass, and forces a recommendation of pass, pass-with-risk, or hold before Test is allowed to start.
> 
> Download it. Give it to your agent. Drop it into a task that already has a diff and an approved plan. Watch it refuse to call something covered until the evidence says so.
> 
> The review artifact it generates is proof that the diff was actually checked against the contract, not just read.
> 
> [review.md on GitHub Gist](https://gist.github.com/JeelVankhede/cc253b5003dbc4b53c2c5c06f7dd9ceb)