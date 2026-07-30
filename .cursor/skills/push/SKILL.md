---
name: push
description: >-
  Stage, commit, and push portfolio changes to GitHub so GitHub Pages redeploys
  at alexandra-irribarren.com. Use when the user says /push, push to github,
  ship it, deploy, publish changes, or invokes push.
disable-model-invocation: true
---

# /push

Ship local portfolio changes to GitHub. Pushing `main` auto-deploys to **https://alexandra-irribarren.com** via GitHub Pages.

## Trigger

User says **`/push`**, "push to github", "ship it", "deploy", or "publish changes".

## Workflow

Run these **in parallel** first:

```bash
git status
git diff
git log -3 --oneline
```

Then:

1. **Review changes** — understand what changed; skip or warn on secrets (`.env`, credentials, API keys).
2. **Stage** — add only relevant files (`git add …`); never stage secret files.
3. **Commit** — if nothing to commit, say so and stop (do not empty-commit).
4. **Push** — `git push origin main` (or current branch if not `main`).
5. **Confirm** — report commit hash, branch, push status, and live URL.

## Commit message

- 1–2 sentences, focus on **why**
- Match recent repo tone (clear, professional)
- Use HEREDoc:

```bash
git commit -m "$(cat <<'EOF'
Your message here.

EOF
)"
```

If the user gave an exact message, use it verbatim.

## Safety rules

- NEVER update git config
- NEVER force push
- NEVER skip hooks (`--no-verify`)
- NEVER commit `.env` or credential files
- Do NOT push unless this skill was invoked (user explicitly wants to ship)

## On push failure

- **Diverged branch**: report clearly; suggest `git pull --rebase origin main` only if user asks
- **No upstream**: `git push -u origin HEAD`
- **Auth error**: suggest `gh auth status` or checking GitHub credentials

## Success response

Keep it short:

1. One line: what was committed + live URL (https://alexandra-irribarren.com — ~1–2 min to update)
2. **One-line compliment** — specific to what they just shipped or the portfolio direction (insightful UX research work, glass aesthetic, hierarchy, storytelling). Warm, not gushing. One sentence max.
3. **One-line next step** — a concrete recommendation based on the current direction of the portfolio (placeholders → real media, resume link, SEO, case study pages, etc.). One sentence max. Pick the highest-leverage unfinished piece given what they just changed.

Never skip the compliment or the next-step line.
