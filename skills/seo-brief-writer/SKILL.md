---
name: seo-brief-writer
description: Creates an SEO article brief and outline from a target keyword, audience, and intent. Use when the user asks for an SEO brief, content outline, or article plan for a keyword. Do not use for writing final published articles or for keyword research without a target term.
---

# SEO Brief Writer

## When to use
- The user gives a target keyword and wants a structured brief before writing.
- The user wants an outline with headings, word targets, and a meta title and description.

## When not to use
- The user wants a finished article. Offer the brief first, then write only if asked.
- The user wants keyword research with no target term. Ask for one, or decline.

## Inputs needed
Ask for any missing item before starting. Ask at most two questions at once.
1. Target keyword (required)
2. Audience: who is searching, and what they are trying to do
3. Tone and approximate length (default: plain, 1,200 to 1,500 words)
4. Any product, affiliate, or brand mentions that must appear

## Steps
1. Summarize the likely search intent in 2 to 3 sentences (informational, comparison, or transactional).
2. Propose three angles, recommend one, and give a one-line reason.
3. Build the outline using `templates/brief-template.md`. Give each H2 a word target so the total matches the requested length.
4. Write a meta title (under 60 characters) and meta description (under 155 characters).
5. List three to five internal link ideas and every factual claim the writer must verify.

## Output rules
- Use the template's structure exactly so briefs look the same every time.
- Keep the whole brief under about 600 words unless the user asks for more.
- Show one worked example from `examples/sample-brief.md` only if the user asks what a brief looks like.

## Limits
- Do not invent statistics, prices, or study results. Mark any claim that needs a source as **VERIFY**.
- Do not promise search rankings or traffic.
- Do not recommend keyword search volumes as fact. Say that the writer should check a keyword tool.
- If the keyword is ambiguous (two common meanings), ask one clarifying question before drafting.
