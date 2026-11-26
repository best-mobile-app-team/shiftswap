# Unit 9 handoff

## Local verification before pushing

1. Copy the updated files into your existing working folder (keep node_modules and .env.local). Do not overwrite a newer teammate revision without reviewing differences.
2. Run `npm test`, `npx tsc --noEmit`, and `npm run dev`. If possible run `npm run build` separately. Full dependency installation was blocked in the editing environment; no claim of a clean full build is made.
3. Open /feed; check filters. Claim a coworker's shift and check My Shifts. Sign out, sign in as manager@example.com / demo123, approve the claim and decline the other seeded pending claim. Sign out and return to demo@example.com / demo123; check My Shifts and Profile notifications. Post a shift, switch to manager, check new-shift notification. Sign up with a new fake email, reject an invalid invite, then join with TEST123 and a role. Check profile and logout. Do not refresh during account switching because mock state is in memory.

## Board changes (manual; not applied remotely)

| Issue | Suggested status after local verification |
|---|---|
| #6, #8, #9, #13 | Done (existing preview) |
| #7, #10, #11, #14 | Done for mock preview; note live integration pending |
| #15 | Done (previously tested) |
| #12 | In progress — in-app simulation only, no device push |
| #16–19 | Todo (optional) |

Keep existing assignments where accurate; assign actual contributors, not Julian for work he did not perform. Add issues to the public project board and appropriate existing sprint/milestone; verify public access in incognito. Do not mark unverified native prototype work integrated.

## README / submission

README contains feature checkboxes and links to both supplied progress recordings. Push the progress directory along with the code; both MP4 files are below GitHub's 100 MB per-file limit. Verify links after pushing. Add your own progress recording if required. Final 2–4 minute Demo Day video is excluded from this handoff at your request. Add its URL before submitting for those points. Instructor acceptance of Next.js for the iOS capstone remains unconfirmed.

## Git integration

This archive is not a Git clone. Use GitHub Desktop to clone the team repository, select the intended base branch (Zach's seed-script branch if still appropriate), create a new branch, and copy the changed files into that clone. Review the diff before committing, push, and open a pull request. Do not commit .env.local, credentials, node_modules, or .next. Preserve newer teammate changes. No remote changes have been made.
