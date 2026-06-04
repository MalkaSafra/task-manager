# TaskClient — Angular Frontend for Task Manager

An elegant, modern Angular (v21) frontend for the Task Manager application. This README focuses on the `TaskClient` folder only — installation, development, architecture and contribution notes for the client app.

---

## Quick highlights

- Angular 21 with standalone components (no NgModule boilerplate).
- Angular Material for UI and theming.
- NgRx + Angular Signals for predictable client state.
- Modern HTTP stack: `provideHttpClient` with `withFetch()` and layered interceptors (`api-interceptor`, `token-interceptor`).
- Server-Side Rendering (SSR) ready via `@angular/ssr` and `main.server.ts`.
- Guarded routing for public/authenticated flows (`auth.guard`, `guest.guard`).

---

## Quick start (developer)

Prerequisites
- Node.js (recommended v18+)
- npm (project uses npm@10.x per `package.json`)

From the `TaskClient` folder:

```powershell
# install dependencies
npm install

# run dev server (hot reloads on file changes)
npm start
```

Open http://localhost:4200 in your browser.

### Important scripts

- `npm start` — `ng serve` (development server)
- `npm run build` — `ng build` (production build)
- `npm run watch` — `ng build --watch --configuration development`
- `npm test` — unit tests (Vitest via Angular test pipeline)
- `npm run serve:ssr:client` — run SSR server bundle from `dist` (`node dist/client/server/server.mjs`)

Note: SSR serving requires producing server-side build artifacts first (Angular Universal build). This project already includes `@angular/ssr` in dependencies.

---

## What you'll find in this app (concise)

- `src/main.ts` — client bootstrap using `bootstrapApplication(App, appConfig)`.
- `src/main.server.ts` — SSR entrypoint that exports a `bootstrap` for server rendering.
- `src/app/app.ts` and `src/app/app.routes.ts` — App root and route definitions.
- `src/app/app.config.ts` — wires `provideRouter`, `provideHttpClient(withFetch(), withInterceptors([...]))`, Material date adapter and optimized change detection.
- `src/app/interceptors/` — `api-interceptor` (prefixes requests with API base) and `token-interceptor` (attaches auth token).
- `src/environments/` — environment config with local and production `apiUrl` values.

---

## Routing snapshot (from `src/app/app.routes.ts`)

- `/` -> redirects to `/dashboard`
- `/login` -> login page (guarded as guest-only)
- `/register` -> registration (guest-only)
- `/dashboard` -> user dashboard (auth-only)
- `/teams` -> manage teams (auth-only)
- `/projects` and `/projects/:teamId` -> projects (auth-only)
- `/tasks` and `/tasks/:projectId` -> tasks (auth-only)

Unknown routes redirect to `/dashboard`.

---

## API configuration

The client reads the API base URL from `src/environments/*.ts`:

- `src/environments/environment.ts` (development)
  - `apiUrl: 'http://localhost:3000/api'`
- `src/environments/environment.prod.ts` (production)
  - `apiUrl: 'https://wolftasksserver-rmti.onrender.com/api'`

The `api-interceptor` automatically prefixes outgoing HTTP requests with the configured `apiUrl`. The `token-interceptor` is responsible for attaching authentication tokens when available.

---

## Architecture notes (why this is nice)

- Standalone components and `bootstrapApplication` reduce ceremony and speed startup.
- `provideHttpClient(withFetch(), withInterceptors([...]))` gives a modern, testable HTTP stack and centralizes cross-cutting concerns (base URL, auth tokens).
- Zone change detection is configured with `provideZoneChangeDetection({ eventCoalescing: true })` to reduce unnecessary CD cycles and improve performance.
- SSR support is wired via `provideServerRendering` in server config, so the app can be rendered on the server for faster first paint and improved SEO.

---

## Developer checklist

Before opening a PR:

- [ ] Pull from `main` and rebase/merge
- [ ] Run `npm install`
- [ ] Run `npm test` and keep tests green
- [ ] Verify the new UI with `npm start` and test key flows (login, create team, create project, create task)
- [ ] Add/update unit tests for new logic

Style & conventions:
- Prefer standalone components and lean services for API integration.
- Keep features in `src/app/components/<feature>` and shared UI in `src/app/components/shared`.
- Use state (`src/app/state`) for cross-component data and side effects.

---

## Testing & CI suggestions

- Unit tests: `npm test` (Vitest via Angular test runner in this project).
- Add integration/e2e tests (Cypress/Playwright) for critical flows: auth, task CRUD, project/team workflows.
- Add a GitHub Actions workflow that runs `npm ci`, `npm test`, and a basic `ng build --configuration production`.

---

## Security and environment practices

- Never commit secrets or production environment files.
- Use environment variables in CI for production secrets and API endpoints.
- Ensure the API server enforces CORS, CSRF protections, and token expiry/refresh flows.

---

## Nice-to-have improvements

- Storybook for isolated component dev and visual tests.
- Playwright tests for cross-browser flows.
- Dockerfile and devcontainer for reproducible development environments.
- A short demo video or screenshots in this README to make it visually compelling.

---

## Contributing

Contributions are very welcome. Please open issues for bugs/feature requests and create small, well-documented PRs. Follow the developer checklist above.

If you want me to:

- add a screenshot/GIF section, I can prepare a placeholder and instructions for capturing screenshots;
- add GitHub Actions CI config, I can scaffold a minimal workflow to run tests and build;
- create a CONTRIBUTING.md with PR templates and issue templates.

Tell me which of the above you'd like next and I will implement it.

---

Thank you for building and improving TaskClient — a focused, modern Angular frontend ready for production and collaboration.
