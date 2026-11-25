---

name: angular-performance
description: Audit and optimise Angular application performance. Use when reviewing Angular components, templates, routes, RxJS flows, signals, rendering, change detection, bundle size, startup time, memory usage, SSR, hydration, or runtime responsiveness. Do not apply speculative rewrites without identifying the likely bottleneck and expected impact.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Angular Performance Optimisation

Analyse Angular code for measurable or strongly evidenced performance problems, then make the smallest safe improvements.

Prioritise changes that improve:

1. Runtime rendering and interaction speed
2. Network and bundle loading
3. Change-detection work
4. Memory usage and subscription cleanup
5. SSR and hydration performance
6. Maintainability without premature optimisation

## Workflow

When asked to review or optimise Angular code:

1. Inspect the Angular version, project configuration, relevant dependencies, and application architecture.
2. Establish the reported symptom:

  * slow startup
  * slow navigation
  * delayed rendering
  * repeated API calls
  * UI jank
  * high memory usage
  * excessive bundle size
  * slow tests or builds
3. Identify likely bottlenecks before editing.
4. Rank findings as:

  * Critical
  * High impact
  * Moderate impact
  * Minor or speculative
5. Prefer targeted changes over broad rewrites.
6. Preserve existing behaviour and public interfaces unless a breaking change is explicitly approved.
7. Run the project's existing lint, typecheck, tests, and production build after changes.
8. Explain what changed, why it should help, and how to measure the result.

Do not claim a performance improvement is proven unless it was measured.

## Change Detection

Prefer modern Angular reactive patterns appropriate to the project's Angular version.

Check for:

* Components using default change detection where `OnPush` would safely reduce work
* Mutable inputs that undermine `OnPush`
* Methods, getters, object creation, or expensive expressions executed from templates
* Manual `detectChanges()` or `markForCheck()` calls masking a design problem
* Large component trees updated by unrelated state changes
* Zone-triggered work caused by timers, event listeners, or third-party libraries
* Opportunities for zoneless change detection when the project and dependencies support it

Do not mechanically add `OnPush` without checking mutation patterns and view update behaviour.

## Signals

Prefer signals for local synchronous UI state when they simplify dependency tracking.

Check for:

* State copied unnecessarily between observables, component properties, and signals
* Effects used where `computed()` is sufficient
* Effects that write to their own dependencies or create update loops
* Expensive computed values recreated unnecessarily
* Signal reads spread across templates that could be grouped into meaningful computed state
* Observable-to-signal conversions created repeatedly rather than once
* Missing initial values or error handling in observable conversions

Do not convert working RxJS orchestration into signals merely for stylistic consistency.

## Templates and Rendering

Inspect templates for repeated or unnecessary work.

Prefer:

* `@for` with a stable `track` expression
* `trackBy` for projects using `*ngFor`
* `@if`, `@switch`, and modern control flow when supported
* Pure pipes for reusable deterministic transformations
* Precomputed view models for expensive presentation logic
* Virtual scrolling for genuinely large visible collections
* Pagination or incremental loading where virtual scrolling is unsuitable
* `@defer` for expensive below-the-fold or conditionally needed UI
* Appropriate image dimensions, lazy loading, and Angular image optimisation

Flag:

* Function calls in templates
* Getters performing filtering, sorting, mapping, parsing, or allocation
* Inline object or array creation passed to child components
* Missing or unstable list tracking
* Nested loops over large collections
* Re-sorting or re-filtering unchanged data
* Rendering large hidden DOM trees
* Excessive use of `ngClass` or `ngStyle` expressions with expensive calculations

Do not recommend virtual scrolling for short or simple lists.

## RxJS and Asynchronous Work

Check observable flows for:

* Sequential requests that could safely run concurrently
* Nested subscriptions
* Duplicate subscriptions causing duplicate HTTP requests
* Missing sharing or caching where the same cold observable is consumed repeatedly
* Incorrect use of `switchMap`, `mergeMap`, `concatMap`, or `exhaustMap`
* Subscriptions that outlive their component or service
* Manual subscription management where `async`, `toSignal`, or `takeUntilDestroyed` is clearer
* Repeated high-frequency emissions that need debouncing, throttling, or deduplication
* Expensive synchronous work inside operators
* Waterfalls caused by awaiting independent operations one after another

Use concurrency only when operations are independent and ordering is not required.

Avoid adding `shareReplay` without defining:

* cache lifetime
* invalidation behaviour
* error behaviour
* whether stale values are acceptable

## Dependency Injection and Services

Check for:

* Services accidentally provided multiple times
* Heavy services instantiated eagerly
* Repeated construction of clients, formatters, parsers, or configuration objects
* Component-level providers that prevent intended sharing
* Large global stores causing unrelated updates
* State duplicated across multiple services
* Side effects performed during service construction

Prefer lazy creation when it materially reduces startup work.

## Routing and Lazy Loading

Inspect routing for:

* Eagerly loaded feature areas
* Components that can use `loadComponent`
* Routes that can use `loadChildren`
* Large guards or resolvers delaying navigation
* Unnecessary resolver waterfalls
* Preloading strategies that download too much too early
* Shared modules that accidentally pull large dependencies into the initial bundle

Preserve route behaviour and access control.

## Bundle Size

Use the production build and available bundle statistics before drawing conclusions.

Check for:

* Large third-party dependencies
* Whole-library imports where supported subpath imports exist
* Barrel exports that accidentally widen dependency graphs
* Duplicate packages or incompatible dependency versions
* Locale data loaded globally
* Heavy editor, charting, PDF, mapping, or date libraries in the initial bundle
* Development-only packages included in production paths
* Polyfills no longer required by supported browsers
* CommonJS dependencies reducing optimisation
* Assets significantly larger than necessary

Prefer lazy imports for expensive optional functionality.

Do not replace a dependency solely because another package has a smaller advertised size. Consider functionality, tree-shaking, maintenance, compatibility, and migration cost.

## Server-Side Rendering and Hydration

For SSR applications, inspect:

* Duplicate browser and server data requests
* Missing transfer-state usage
* Hydration mismatches
* Browser-only APIs accessed during server rendering
* Large serialised application state
* Blocking route resolvers
* Expensive synchronous server rendering
* Components that should use incremental hydration or deferred loading
* Event replay and hydration configuration appropriate to the Angular version

Do not disable hydration merely to hide a mismatch. Find the mismatched state or markup.

## Memory and Resource Management

Check for:

* Unreleased subscriptions
* Event listeners not removed
* Timers or intervals not cleared
* Long-lived references to components or DOM nodes
* Unbounded caches
* Large replay buffers
* Blob URLs not revoked
* Observers not disconnected
* Repeated registration of global handlers
* Detached DOM retained by third-party libraries

Prefer `DestroyRef` and `takeUntilDestroyed` when supported.

## Network Performance

Inspect:

* Duplicate HTTP requests
* APIs called during every change-detection or navigation cycle
* Requests that fetch substantially more data than needed
* Missing pagination
* Waterfalls between independent requests
* Polling without sensible intervals or visibility handling
* Missing request cancellation
* Large JSON transformations on the main thread
* Cache behaviour that does not match data freshness requirements

Do not introduce client caching without defining invalidation and consistency expectations.

## Event Performance

For frequent browser events such as scroll, pointer movement, resize, input, or drag:

* Avoid triggering full application change detection unnecessarily
* Use passive listeners where appropriate
* Throttle or debounce only according to the interaction requirements
* Move non-UI work outside Angular's change-detection context when safe
* Re-enter Angular only when view state needs updating
* Prefer `requestAnimationFrame` for visual updates tied to frames

Do not debounce controls where every input event is semantically required.

## Code Review Output

For review-only requests, respond with:

### Summary

A brief assessment of the dominant performance risks.

### Findings

For each finding include:

* Severity
* File and relevant code
* Why it may be slow
* Likely impact
* Recommended change
* Any behavioural risk
* How to verify it

### Suggested order

List fixes in expected impact-to-effort order.

Avoid presenting minor stylistic preferences as performance findings.

## Editing Behaviour

When making changes:

* Follow the repository's existing formatting and architecture
* Avoid unrelated cleanup
* Do not silently change API contracts
* Add or update tests where behaviour could regress
* Use framework APIs available in the installed Angular version
* Do not install dependencies unless there is a clear benefit
* Keep changes reviewable
* Include before-and-after code only where useful

## Verification

Use the project's own commands where available.

Common checks include:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Also consider:

* Angular production build output
* Bundle statistics
* Angular DevTools profiler
* Browser Performance panel
* Network request counts
* Lighthouse
* Web Vitals
* Memory heap snapshots
* Rendering and scripting time
* Change-detection counts

Do not optimise solely against a synthetic score when it worsens real user behaviour.

## Performance Principles

Follow these principles:

* Measure before and after when practical
* Optimise the actual hot path
* Fix architecture before adding micro-optimisations
* Avoid repeated work
* Avoid unnecessary rendering
* Avoid unnecessary network sequencing
* Load expensive functionality only when needed
* Keep state ownership clear
* Prefer stable object identities where they reduce downstream work
* Balance performance, correctness, accessibility, and maintainability
