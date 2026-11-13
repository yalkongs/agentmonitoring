# Project instructions

Read `DESIGN.md` before changing visual or UI decisions. Preserve DEMO DATA labeling and the distinction between time value and realized financial savings.

## Deployment

The user has authorized production deployment to Vercel after every completed project update. Do not request deployment confirmation again.

- After making updates, run the relevant checks and immediately deploy with `npm run deploy` before reporting completion.
- Use the existing Vercel project `agentmonitoring` in the `weoncheol-hwangs-projects` team. If the local link is missing, run `vercel link --yes --project agentmonitoring --scope weoncheol-hwangs-projects` first.
- Verify the production URL after deployment and report its URL and result. If checks or deployment fail, fix the issue when possible; otherwise clearly report that production was not updated.
- Never commit credentials or `.vercel/`.
- There is currently no Git remote or Git-triggered deployment pipeline. This instruction applies to agent-performed updates; it is not a background file watcher.
