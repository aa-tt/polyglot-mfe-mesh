# Interview Deep Dive - Round 2 Prep

This document captures the key architectural and technical discussions from recent sessions.

## 1. Angular vs. React & React 18 vs. 16
### Quick Answer
* **Angular:** A full-featured framework (opinionated, batteries-included, built-in DI, Real DOM with zone-based change detection).
* **React:** A flexible library (vdom, one-way data flow, community-driven ecosystem).
* **React 18:** Introduces **Concurrency**. Rendering is interruptible. Features `createRoot`, Automatic Batching, and Transitions.
* **React 16:** Synchronous rendering. Introduced Hooks (16.8).

### Detailed Deep Dive
The shift to **React 18** is about **Concurrent Rendering**. In React 16, a render was a blocking unit of work. If you rendered a list of 5,000 items, the main thread was locked until finished. 
React 18 allows React to pause rendering to handle a high-priority event (like a user typing) and kemudian resume. 
* **useTransition**: Allows marking state updates as "non-urgent."
* **Suspense for SSR**: Streaming HTML to the client and hydrating components as they load, rather than waiting for the whole page.

---

## 2. UI Architect: From Scratch vs. Implementing Designs
### Quick Answer
* **Role:** Engineer-Implementer/UI Architect. Bridging the gap between Figma designs and production-ready code.
* **Approach:** Establish the design system (Radix UI/Tailwind), configure monorepo scaffolding (Nx), and ensure accessibility/A11y.

### Detailed Deep Dive
I specialize in the "Zero-to-One" phase. This involves setting up the foundation:
* **Monorepo Strategy:** Choosing Nx for scalability and code sharing across micro-frontends.
* **Component Contracts:** Defining how shared libraries (like `ui-kit`) interact with feature MFEs.
* **Atomic Design:** Building a library of reusable primitives (Buttons, Inputs, Modals) using Headless UI patterns (like Radix) to ensure logic and accessibility are decoupled from styling.

---

## 3. High Volume Data Handling
### Quick Answer
* **Virtualization:** Only rendering what is visible (React-Window).
* **Lazy Loading:** Fetching record slices (Pagination/Infinite Scroll).
* **Worker Threads:** Offloading complex sorting/filtering to Web Workers.

### Detailed Deep Dive
When dealing with "thousands of records," the bottleneck is the **DOM**. 
1. **Windowing:** Use `tanstack-virtual` or `react-window` to keep the DOM nodes constant (e.g., only 20 rows regardless of 10,000 records).
2. **Infinite Navigation:** Use `IntersectionObserver` to trigger the next API fetch as the user nears the bottom of a list.
3. **Data Mesh:** In an MFE context, handle data streams with RxJS `Subjects` to append list updates without triggering a full page re-render.

---

## 4. Securing PHI/PII (HIPAA Compliance)
### Quick Answer
* **Zero-Persistence:** Never store PHI in `localStorage`.
* **RBAC:** Backend-driven Role-Based Access Control.
* **Encryption:** AES-256 at rest, TLS 1.2+ in transit.
* **Audit Logs:** Tracking who viewed what data.

### Detailed Deep Dive
In a **React/MFE** environment, security must be part of the build:
* **Interceptors:** Automatically scrub sensitive data from any client-side logs.
* **Tokenization:** Pass unique tokens between MFEs instead of raw patient IDs.
* **Hydration/Dehydration:** Clear application memory on tab close or session timeout to prevent physical side-channel access in medical settings.

---

## 5. API Error Handling in React
### Quick Answer
* **Error Boundaries:** Catching crashes at the component level.
* **Axios/Fetch Interceptors:** Global handling for 401s (auth) or 500s.
* **Reactive Feedback:** Using an Event Bus to trigger UI notifications (Toasts).

### Detailed Deep Dive
I treat errors as **UI State**.
* **Recoverable Errors:** Form validations (422) mapped to user-facing hints.
* **Fatal Errors:** Use a global `ErrorBoundary` to show a "Friendly Fallback" rather than a white screen.
* **Decoupled Messaging:** Our `event-bus.ts` publishes `API_ERROR` events. The Shell listens and displays a Toast from the `ui-kit`. This ensures individual MFEs don't need to know *how* to show a notification.

---

## 6. Lazy Loading & Module Federation
### Quick Answer
* **Code Splitting:** Small chunks instead of one giant bundle.
* **React.lazy/Suspense:** Implementing on-demand component loading.
* **MFE Chunks:** Remote entries are only fetched when the specific route is accessed.

### Detailed Deep Dive
Lazy loading is crucial for MFEs because it prevents the user from downloading the entire organization's code on the first visit.
* **Dynamic Imports:** Using `await import()` for feature modules.
* **Selective Hydration:** (React 18) Loading the shell first and letting the interactive parts "wake up" later.
* **Prefetching:** Loading the `analytics-mfe` chunk in the background while the user is still on the `home` page to simulate "instant" navigation.

---

## 7. Performance Troubleshooting
### Quick Answer
* **Diagnosis:** React Profiler (expensive renders), Chrome Performance Tab (Jank/Scripting time), Network Tab (Payload size/TTFB).
* **Fixes:** Memoization, DTO projections (reducing JSON size), and debouncing.

### Detailed Deep Dive
1. **The "Rerender" Trap:** Finding components that re-render despite unchanged props. Resolve with `React.memo` or by moving state lower.
2. **Payload Weight:** Reducing a 10MB API response to 50KB by using Backend Projections.
3. **Event Jitter:** In a stream-based system (RxJS), use `debounceTime` or `distinctUntilChanged` to prevent the UI from trying to update faster than the browser can paint.
