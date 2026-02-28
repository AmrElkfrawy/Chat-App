# Frontend Architecture — Why Every File Exists

> **Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · DaisyUI · Zustand · Axios · React Router v7

---

## Directory Map

```
frontend/src/
│
├── main.tsx                            # React entry point
├── App.tsx                             # Root component — auth gate + routing
├── index.css                           # Global styles & Tailwind layers
│
├── types/
│   └── index.ts                        # Shared TypeScript interfaces
│
├── lib/
│   ├── axios.ts                        # Pre-configured Axios instance
│   └── handleApiError.ts              # Centralised API error → toast handler
│
├── store/
│   └── useAuthStore.ts                 # Zustand authentication store
│
├── components/
│   ├── AppLayout.tsx                   # Protected-page shell (sidebar slot + Outlet)
│   ├── BackgroundDecoration.tsx        # Ambient grid + gradient blobs
│   ├── BorderAnimatedContainer.tsx     # Conic-gradient animated border card
│   ├── Loader.tsx                      # Branded full-page spinner
│   ├── ProtectedRoute.tsx             # Auth guard wrapper
│   └── auth/
│       ├── AuthFormField.tsx           # Labelled input with icon
│       ├── AuthImagePanel.tsx          # Decorative right-column image
│       └── AuthPageLayout.tsx          # Shared login / signup page shell
│
└── pages/
    ├── LoginPage.tsx                   # /login
    ├── SignupPage.tsx                  # /signup
    └── ChatPage.tsx                    # / (protected)
```

---

## File-by-File Rationale

### `main.tsx`

| Aspect                 | Decision                   | Why                                                                                                        |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **StrictMode**         | Enabled                    | Catches accidental side-effects and deprecated API usage during development.                               |
| **BrowserRouter here** | Wraps `<App />` at the top | Keeps `App.tsx` free of provider wiring — single responsibility. All route declarations live inside `App`. |
| **CSS import**         | `import "./index.css"`     | Tailwind, DaisyUI, and custom utility classes must be loaded before any component renders.                 |

---

### `App.tsx`

| Aspect                           | Decision                                           | Why                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`checkAuth()` in `useEffect`** | Runs once on mount                                 | Validates the cookie session before any route renders. Prevents flash-of-unauthenticated-content.                                                       |
| **`isCheckingAuth` gate**        | Shows `<Loader />` while true                      | The entire route tree is hidden until the auth check resolves. Without this, `ProtectedRoute` would redirect to `/login` during the network round-trip. |
| **`<BackgroundDecoration />`**   | Extracted component                                | Keeps `App.tsx` focused on routing logic. The three decorative `<div>`s (grid pattern, pink blob, cyan blob) are purely visual.                         |
| **`<Toaster />`**                | Rendered once, at root level                       | `react-hot-toast` needs a single `<Toaster>` in the tree. Placing it here means every page gets toasts without importing `Toaster` individually.        |
| **Public route pattern**         | `isAuthenticated ? <Navigate …> : <Page />` inline | Explicit, readable, and avoids an extra wrapper component for only two routes.                                                                          |

---

### `index.css`

| Aspect                                                          | Decision                             | Why                                                                                                                                                                         |
| --------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@import "tailwindcss"` + `@plugin "daisyui"`**               | Tailwind v4 syntax                   | v4 uses `@import` / `@plugin` instead of `tailwind.config.js`.                                                                                                              |
| **`@property --border-angle`**                                  | CSS Houdini custom property          | Required for the conic-gradient border animation in `BorderAnimatedContainer`. Declaring it as a `<angle>` allows CSS to interpolate it smoothly.                           |
| **`@theme` block**                                              | Defines `--animate-border` keyframes | The `animate-border` utility class used in `BorderAnimatedContainer` is backed by this keyframe.                                                                            |
| **Utility classes** (`.input`, `.auth-btn`, `.auth-link`, etc.) | `@apply` composites                  | These classes are shared across multiple auth components. Defining them here avoids repeating 5–6 Tailwind utilities in every JSX file and keeps component markup readable. |

---

### `types/index.ts`

| Aspect                         | Decision                                   | Why                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`User` interface**           | Mirrors backend `IUser` (minus `password`) | Gives the frontend a single source of truth for user shape. `authUser` in the store and any future profile UI all reference this.                                             |
| **`SignupData` / `LoginData`** | Separate interfaces                        | Each form has its own payload shape. Typing them explicitly means the store methods, page forms, and validators all share the same contract.                                  |
| **`AuthState`**                | Full store shape                           | Zustand's `create<AuthState>` catches misspellings and missing fields at compile time. Making every method **non-optional** guarantees pages can call `login()` without `?.`. |

---

### `lib/axios.ts`

| Aspect                             | Decision                                  | Why                                                                                                                                                                                         |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`axiosInstance`**                | Single pre-configured instance            | Base URL, credentials flag, and any future interceptors (token refresh, 401 redirect) only need to be set once. Every store action and future API call imports this instead of raw `axios`. |
| **`MODE === "development"` check** | Dev → `localhost:3000/api`, Prod → `/api` | During dev the Vite dev-server runs on `:5173` while the backend runs on `:3000`. In production the frontend is served by the same origin, so a relative path suffices.                     |
| **`withCredentials: true`**        | Always                                    | The backend uses HTTP-only cookies for the JWT. Without this flag the browser strips the cookie from cross-origin requests during development.                                              |

---

### `lib/handleApiError.ts`

| Aspect                         | Decision                                | Why                                                                                                                                                                                                                                      |
| ------------------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single utility**             | `handleApiError(error, fallback)`       | The exact same error → toast pattern was duplicated in `signup`, `login`, and `logout`. Extracting it into a function means every future store action reuses the same logic and the raw `axios` import is no longer needed in the store. |
| **`axios.isAxiosError` guard** | Checks before accessing `response.data` | Non-Axios errors (network failures, thrown strings) don't have a `.response` property. The guard prevents a runtime crash.                                                                                                               |

---

### `store/useAuthStore.ts`

| Aspect                           | Decision                                                       | Why                                                                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zustand**                      | Over `useContext` + `useReducer`                               | Zero boilerplate — no providers, no reducers, no dispatch. The store is a plain function that returns state + actions. Selectors are built-in, so re-renders are minimal. |
| **`is…` boolean flags**          | `isCheckingAuth`, `isSigningUp`, `isLoggingIn`, `isLoggingOut` | Each action has its own loading flag so the UI can disable the correct button and show the correct spinner without a generic `isLoading`.                                 |
| **`set()` in `finally`**         | Resets the loading flag                                        | Guarantees the flag is cleared whether the request succeeds or fails.                                                                                                     |
| **`checkAuth` silently catches** | `console.error` instead of toast                               | A failed auth check just means the user isn't logged in — no need to show an error toast on the very first page load.                                                     |
| **`logout` is `async`**          | Awaits the API call                                            | Previously `logout` was synchronous and fire-and-forgot the POST. Making it `async` + `await` ensures the cookie is actually invalidated before the UI resets.            |

---

### `components/Loader.tsx`

| Aspect              | Decision                                                                   | Why                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **`children` prop** | Default `"Loading…"`                                                       | Allows callers to override the label (`<Loader>Signing in…</Loader>`) while the bare `<Loader />` works out of the box. |
| **Gradient text**   | `bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent` | Matches the app's pink ↔ cyan colour theme. The `animate-pulse` gives a breathing effect.                               |
| **Used by**         | `App.tsx` (initial auth check), `ProtectedRoute` (route-level guard)       | Consistent loading UX across the app.                                                                                   |

---

### `components/BackgroundDecoration.tsx`

| Aspect                 | Decision                           | Why                                                                                                                                       |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Separate component** | Extracted from `App.tsx`           | `App.tsx` was mixing decorative DOM with routing logic. This keeps the root component focused on structure.                               |
| **Fragment `<>…</>`**  | Returns three siblings             | No wrapper div needed — these are absolutely-positioned and stack under the page content via z-index.                                     |
| **Three layers**       | Grid lines + pink blob + cyan blob | The grid gives a subtle tech aesthetic; the two blurred colour blobs create the ambient glow visible behind auth cards and the chat page. |

---

### `components/BorderAnimatedContainer.tsx`

| Aspect                                   | Decision                                                    | Why                                                                                                                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Conic gradient + padding-box trick**   | `padding-box` for the fill, `border-box` for the gradient   | This CSS technique makes the border itself animated while the background behind children remains solid. The `--border-angle` variable is interpolated by the keyframe in `index.css`. |
| **Named `BorderAnimatedContainerProps`** | `{ children: ReactNode }`                                   | Replacing the inline `{ children }` destructure with a named interface improves readability and enables future extension (e.g. `className`, `as`).                                    |
| **Used by**                              | `AuthPageLayout` (which wraps `LoginPage` and `SignupPage`) | Gives auth cards a premium animated-border feel.                                                                                                                                      |

---

### `components/ProtectedRoute.tsx`

| Aspect                     | Decision                     | Why                                                                                                                                                   |
| -------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout route**           | Wraps `<Outlet />`           | Used as a React Router layout route (`<Route element={<ProtectedRoute />}>`). Child routes render inside the outlet only after the auth check passes. |
| **Reuses `<Loader />`**    | Instead of an ad-hoc spinner | Keeps loading UX consistent with the rest of the app.                                                                                                 |
| **`Navigate to="/login"`** | With `replace`               | `replace` avoids pushing the guarded URL onto the history stack, so the browser back button doesn't loop.                                             |

---

### `components/AppLayout.tsx`

| Aspect                     | Decision              | Why                                                                                                                                                         |
| -------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`relative z-10`**        | Stacking context      | Ensures page content renders **above** the absolutely-positioned `BackgroundDecoration` blobs. Without this, the gradient blurs cover interactive elements. |
| **`flex h-screen w-full`** | Sets up the app shell | Provides a flex container so future sidebar or header components can be added alongside `<Outlet />`.                                                       |

---

### `components/auth/AuthFormField.tsx`

| Aspect                                | Decision                                | Why                                                                                                                                                                                            |
| ------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reusable field**                    | `label + icon + input` in one component | Both `LoginPage` and `SignupPage` repeated the same 8-line label → relative-div → icon → input block for every field. This component reduces each field to a single `<AuthFormField …/>` call. |
| **`icon` prop typed as `LucideIcon`** | Accepts any Lucide icon component       | The caller passes `MailIcon`, `LockIcon`, `UserIcon`, etc. The component renders it with consistent positioning classes.                                                                       |
| **Defaults**                          | `type="text"`, `required=false`         | Sensible defaults reduce prop noise for the common case.                                                                                                                                       |

---

### `components/auth/AuthImagePanel.tsx`

| Aspect                      | Decision                 | Why                                                                                                                                                                               |
| --------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Right-column decoration** | Image + tagline + badges | Both auth pages showed the same right-side panel (image, "Start Your Journey Today!", Free / Secure / Fast badges). Extracting it means changing the design happens in one place. |
| **`hidden md:flex`**        | Mobile-first             | The image panel is hidden on small screens — the form takes priority. On `md+` it appears as a 50% column.                                                                        |

---

### `components/auth/AuthPageLayout.tsx`

| Aspect                                 | Decision                                                                                 | Why                                                                                                                                                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shared page shell**                  | Wrapper → `BorderAnimatedContainer` → two-column flex → heading + children + image panel | `LoginPage` and `SignupPage` were 95% identical in structure — only the heading text, form fields, and image differed. This layout accepts `title`, `subtitle`, `imageSrc`, `imageAlt`, and renders `children` (the form + footer link) inside the left column. |
| **`MessageCircleCodeIcon` lives here** | Not in each page                                                                         | The brand icon above the heading is the same on both pages.                                                                                                                                                                                                     |
| **Pages shrink dramatically**          | LoginPage: 102 → 72 lines, SignupPage: 129 → 97 lines                                    | Each page now only declares what's unique: the form fields and the submit handler.                                                                                                                                                                              |

---

### `pages/LoginPage.tsx`

| Aspect                                   | Decision           | Why                                                                                                                 |
| ---------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **`useState<LoginData>`**                | Typed form state   | The generic argument ensures `formData` only has `email` and `password` — no accidental extra keys.                 |
| **`handleChange` via `[e.target.name]`** | Dynamic key update | A single handler covers all inputs. The `name` attribute on each `<AuthFormField>` must match the `LoginData` keys. |
| **No validation beyond `required`**      | Server validates   | The backend already runs Zod validators. Client-side we just ensure fields are non-empty via HTML `required`.       |

---

### `pages/SignupPage.tsx`

| Aspect                               | Decision                                         | Why                                                                                                                 |
| ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Client-side password match check** | `formData.password !== formData.confirmPassword` | This is the one validation worth doing on the client — the backend never sees `confirmPassword`, so it can't check. |
| **Toast for mismatch**               | `toast.error("Passwords do not match.")`         | Uses the same notification system as the rest of the app.                                                           |

---

### `pages/ChatPage.tsx`

| Aspect                | Decision                    | Why                                                                                                                                                |
| --------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Minimal stub**      | Just a logout button        | This page will be fleshed out with the chat UI. Currently it proves the auth flow works end-to-end.                                                |
| **`relative z-10`**   | Sits above background blobs | Inherits the stacking context from `AppLayout` but also sets its own `z-10` for future absolutely-positioned chat elements.                        |
| **No `bg-slate-900`** | Removed                     | `App.tsx` already applies the background colour to the entire viewport. Duplicating it here created an opaque layer that hid the decorative blobs. |

---

## Design Principles Applied

| Principle                  | Where Applied                                                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single source of truth** | Types live in `types/index.ts`; the store is the only place auth state is mutated.                                                                                              |
| **DRY**                    | `AuthFormField`, `AuthImagePanel`, `AuthPageLayout`, `handleApiError` each eliminated 3–4 copies of the same code.                                                              |
| **Colocation**             | Auth-specific UI components live in `components/auth/`; pages own only their unique logic.                                                                                      |
| **Separation of concerns** | Visual decoration (`BackgroundDecoration`, `BorderAnimatedContainer`) is split from structural layout (`AppLayout`, `AuthPageLayout`) and from business logic (`useAuthStore`). |
| **Fail-safe defaults**     | `Loader` defaults to "Loading…", `AuthFormField` defaults to `type="text"`, Zustand flags start `false`.                                                                        |
| **Consistent UX**          | Every loading state uses `<Loader />`, every API error goes through `handleApiError`, every toast comes from `react-hot-toast`.                                                 |
