# GitHub profile setup

The project collection is in `steliosv7/stelios`. To display the supplied profile text on the GitHub profile itself:

1. Create a **public** repository named exactly `steliosv7` under the `steliosv7` account.
2. Put the contents of `docs/PROFILE_README.md` into its root `README.md`.
3. Pin the `stelios` repository in the profile's Customize your pins menu.
4. Set a bio that accurately reflects your experience.
5. Add the portfolio URL as the website only after enabling public access and checking it while signed out.

The available GitHub connector can update an existing repository but cannot create a repository or change profile settings, so these profile actions require GitHub's UI. No profile changes are claimed until they have been performed.

## Explaining the work in interviews

- **Pixel Studio:** cells are a flat array; one history snapshot per stroke avoids redundant undo states. Flood fill uses a stack rather than recursive calls.
- **Air Juggler:** delta time drives the physics; downward-only paddle collision prevents double scoring. The camera is opt-in, tracks are stopped on exit, and inputs work without the model.
- **Book analysis:** schema checks, numeric ranges, full-row deduplication and explicit observational units make outputs interpretable. The fixture is fictional.
- **Pocket Rave:** `millis()` replaces `delay()` so input remains responsive; button debouncing handles noisy contacts. PWM requires suitable pins and a resistor per color.
- **Portfolio:** semantic structure, responsive grids, visible keyboard focus and reduced motion support keep the site accessible and easy to maintain.

Read and adapt the implementations before claiming independent authorship or mastery. Do not claim the physical circuit or live camera was tested until you have tested them with your own hardware.
