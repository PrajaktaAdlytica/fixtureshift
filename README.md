# FixtureShift

A local concept preview of a sports competition operations site. The homepage follows the Riverside Derby tile from a closed venue through a comparison and booking evidence.

Run `npm ci` and `npm run dev` to open the source. `npm run build` and `npm run test:sites` verify the production build and the SPA Worker.

The walkthrough uses fictional records. Approvals, notices, pilot intake and sign-in are in-browser previews. Usage events are generic and limited to the browser session.

## Deploy on Vercel

Import this repository as a new project with the Vite preset and the repository root. Use `npm run build` and publish `dist/client`. The checked-in `vercel.json` supplies those defaults and enables direct links to client routes. The concept preview requires no environment variables.

After deploying, open and reload `/demo`, `/product/fixture-rescheduler` and `/pilot` at the deployment URL. Review the simulated demo and confirm that an approved sample export identifies its records as fictional.
