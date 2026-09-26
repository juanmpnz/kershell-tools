# Kershell Tools

- Keep the public site coherent around the housing decision. Add a new vertical only when its purpose and audience are clear.
- Put pure numerical formulas in `packages/calculators` with meaningful boundary tests. Keep components focused on input and presentation.
- Use TypeScript strict mode; avoid `any` and hidden assumptions in calculations.
- Financial, tax and legal rules require dated primary sources, explicit geographical scope, and an update plan before release. Do not hardcode guessed rates.
- Publish only tools that explain their inputs, formula, exclusions and uncertainty. Never generate large numbers of thin SEO pages.
- Avoid storing user-entered financial information or adding external trackers without a deliberate product decision.
- Run `pnpm typecheck`, `pnpm test`, and `pnpm build` before proposing a change.
