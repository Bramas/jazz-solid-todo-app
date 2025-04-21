import { createStore } from "solid-js/store";
import {
    Accessor,
  createContext,
  createEffect,
  createSignal,
  JSX,
  Show,
  useContext,
} from "solid-js";
import {
  JazzBrowserContextManager,
  type JazzContextManagerProps,
} from "jazz-browser";
import type { Account, AuthSecretStorage, JazzContextType } from "jazz-tools";

const JazzContext = createContext<{
    ctx: Accessor<JazzContextType<Account> | undefined>,
    authStorage: AuthSecretStorage,
    contextManager: JazzBrowserContextManager<Account>,
}>(undefined);

export function useJazzContext() {
  const ctx = useContext(JazzContext);
  if (!ctx)
    throw new Error("useJazzContext must be used within a JazzProvider");
  if (!ctx.ctx())
    throw new Error(
      "useJazzContext: ctx is undefined (provider does not ensure ctx is set, which is a bug)"
    );
  return ctx.ctx as Accessor<JazzContextType<Account>>;
}

export function useAuthStorage() {
  const ctx = useContext(JazzContext);
  if (!ctx)
    throw new Error("useAuthStorage must be used within a JazzProvider");
  if (!ctx.authStorage)
    throw new Error(
      "useAuthStorage: authStorage is undefined (provider does not ensure authStorage is set, which is a bug)"
    );
  return ctx.authStorage;
}

export function JazzProvider(props: JazzContextManagerProps<Account> & {
  children: JSX.Element
}) {
  const contextManager = new JazzBrowserContextManager<Account>();

  const [ctx, setCtx] = createSignal<JazzContextType<Account> | undefined>(
    undefined
  );

  const authStorage = contextManager.getAuthSecretStorage();

  contextManager.subscribe(() => {
    setCtx(contextManager.getCurrentValue());
  });

  createEffect(() => {
    if (!props.sync) return;

    contextManager
      .createContext({
        sync: props.sync,
        storage: props.storage,
        guestMode: props.guestMode,
        AccountSchema: props.AccountSchema,
        defaultProfileName: props.defaultProfileName,
        onAnonymousAccountDiscarded: props.onAnonymousAccountDiscarded,
        onLogOut: props.onLogOut,
      })
      .catch((err) => console.error("Error creating Jazz context:", err));
  });

  return (
    <JazzContext.Provider
      value={{
        ctx,
        authStorage,
        contextManager,
      }}
    >
      <Show when={ctx()}>{props.children}</Show>
    </JazzContext.Provider>
  );
}
