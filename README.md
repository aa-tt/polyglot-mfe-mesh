# Polyglot MFE Mesh (React 18 Challenge)

This project demonstrates a production-level solution for sharing state across Micro-frontends (MFEs) that may run on different React versions or completely different renderers.

## The Challenge: Cross-Version State
In a large-scale modernization (like your background at Northern Trust or Visa), you often have "Legacy" MFEs (React 16/17) and "Modern" MFEs (React 18).
Standard `React.Context` is impossible because:
1. It requires a shared React Reconciler instance.
2. Context doesn't bridge across different `node_modules` bundles in Module Federation.

## The Solution: The Reactive State Mesh
Instead of a shared memory tree, we treat the browser as a **Message Broker**.

### Key Concepts
1. **Event Bus (State Mesh)**:
   - Located in [`libs/shared/event-bus`](libs/shared/event-bus/src/lib/event-bus.ts).
   - Uses **RxJS** to provide a reactive stream (`Observable`).
   - Attaches a singleton to `window.__MFE_EVENT_BUS__` to ensure all MFEs talk to the same instance regardless of their bundle.
   - **Backpressure**: Using RxJS operators like `throttleTime(500)` or `debounceTime` in subscribers prevents UI flicker during rapid updates.

2. **Headless UI (Radix UI)**:
   - We used Radix UI primitives for the **Dialog** in `profile-mfe` and **Toast** in `shell`.
   - **Difference from Material UI**:
     - **Material UI (MUI)**: A "Design-in-a-Box" framework. It dictates the look, feel, and DOM structure. It's hard to customize deeply without CSS-in-JS hacks.
     - **Radix UI**: A "Headless" library. It provides **zero styles** but handles 100% of the accessibility (WAI-ARIA compliance, focus traps, keyboard navigation).
     - **Why it matters for MFEs**: In an MFE architecture, every team might want their own CSS/Tailwind configuration. Radix ensures the *behavior* is consistent and accessible without forcing a specific *look* (design tokens).

3. **Event Schema**:
   - Every event has `type`, `payload`, and `meta` (source, timestamp). This mimics a distributed system log (like Kafka) inside the browser.

## Project Structure
- `apps/shell`: The Host (React 18). Listens for `USER_PROFILE_UPDATED`.
- `apps/profile-mfe`: The Remote (State Producer). Edits profile and emits events.
- `libs/shared/event-bus`: The vanilla JS/TS bridge.
- `libs/shared/ui-kit`: Reusable Radix-based components.

## How to Run
1. Install dependencies: `npm install`
2. Run Shell: `npx nx serve shell`
3. Run Profile: `npx nx serve profile-mfe`

## Pointers to Code
- **The Bridge**: [event-bus.ts](libs/shared/event-bus/src/lib/event-bus.ts)
- **State Production**: [app.tsx](apps/profile-mfe/src/app/app.tsx) - Note the `mfeBus.publish`.
- **State Consumption**: [app.tsx](apps/shell/src/app/app.tsx) - Note the `mfeBus.on().subscribe()`.
- **Radix Implementation**: [toast.tsx](libs/shared/ui-kit/src/lib/toast.tsx)

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
