# Jazz Solid Todo App

Jazz example of a simple Todo app built with SolidJS.

The `jazz-solid` folder contains what can become the Jazz Solid wrapper.

It exports the following functions:

- `useJazzContext` – Hook to access the Jazz context provided by `JazzProvider`.
- `useAuthStorage` – Hook to manage authentication storage.
- `JazzProvider` – Component to provide Jazz authentication context to your app.
- `useAccount` – Hook to get the authenticated account and a logout function.
- `useAccountOrGuest` – (untested) Hook to get either an authenticated account or guest context.
- `useCoState` – Generic hook to subscribe to any CoValue in Jazz.
- `useAcceptInvite` – Hook to automatically handle invite links and accept invites.
- `useIsAuthenticated` – Hook to check whether the user is authenticated.
- `usePassphraseAuth` – Hook for passphrase-based authentication flows.
- `PassphraseAuthBasicUI` – Basic UI component for passphrase authentication.
- `usePasskeyAuth` – Hook for passkey-based (WebAuthn) authentication flows.
- `PasskeyAuthBasicUI` – Basic UI component for passkey authentication.
- `createInviteLink` – Utility to generate invite links for inviting other users.
- `parseInviteLink` – Utility to parse invite links from a URL.

Installation

```bash
pnpm install
pnpm run dev
```

Usage

1. Wrap your SolidJS app with `JazzProvider`:

```tsx
import { JazzProvider } from 'jazz-solid';

function App() {
  return (
    <JazzProvider>
      {/* ...your application... */}
    </JazzProvider>
  );
}
```

2. Use hooks in your components:

```tsx
import { useAccount, useCoState, createInviteLink } from 'jazz-solid';

function TodoList() {
  const { me, logOut } = useAccount();
  const todos = useCoState(TodoSchema, me()?.id);

  // ...render todos...
}
```

Demo App

This demo application is built with:
- SolidJS
- Vite
- Jazz state management (via `jazz-solid` wrapper)

Explore the `src/` directory to see how the hooks and components are used to build a simple Todo app.

For more details on the core Jazz tools, visit https://jazz.tools

## License

This project is MIT licensed.