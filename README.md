# Quant Probability Lab

A mobile-first, installable PWA for probability, expected value, statistics, market reasoning, and adaptive mental-maths practice. All lessons and questions are bundled for offline use. Progress stays in IndexedDB on the local device.

## Develop

```bash
npm install
npm run icons
npm run dev
```

## Verify

```bash
npm test
npm run build
```

The content tests enforce exactly 250 curated questions: 200 probability/EV, 25 statistics, and 25 markets. The build generates a service worker and fails if the question schemas or allocations are invalid.

## Publish and install on iOS

1. Push this directory to a GitHub repository with `main` as its default branch.
2. In repository settings, set Pages source to **GitHub Actions**.
3. Let the included workflow test and deploy the `dist` artifact.
4. Open the resulting HTTPS URL on the iPhone.
5. Tap **Share → Add to Home Screen** and launch the installed icon once while online.
6. Confirm it relaunches in airplane mode.

## Data and sources

There is no backend, account, analytics, or runtime API. Backups are explicit JSON exports. Questions use original wording and parameters; the in-app Sources screen links to the public materials used to structure the curriculum.
