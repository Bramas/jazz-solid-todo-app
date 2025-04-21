import { createContext, useContext, createSignal, createEffect, onCleanup, untrack, createMemo } from 'solid-js';
import type { Accessor, JSX, Ref } from 'solid-js';
import { consumeInviteLinkFromWindowLocation } from 'jazz-browser';
import type {
  Account,
  CoValue,
  CoValueClass,
  ID,
  JazzAuthContext,
  JazzGuestContext,
  RefsToResolve,
  Resolved,
} from 'jazz-tools';
import { subscribeToCoValue } from 'jazz-tools';
import { JazzBrowserContextManager, type JazzContextManagerProps } from 'jazz-browser';
import { useJazzContext } from './contextProvider';
import { RefsToResolveStrict } from 'jazz-tools';


export { useJazzContext, useAuthStorage, JazzProvider } from './contextProvider';


export function useAccount<A extends Account>(): {
  me: Accessor<A | undefined | null>;
  logOut: () => void;
};

export function useAccount<
A extends Account,
R extends RefsToResolve<Account>
>(options?: {
  resolve?: RefsToResolveStrict<Account, R>;
}): {
  me: Accessor<Resolved<A, R> | undefined | null>;
  logOut: () => void;
} {
  const ctx = useJazzContext();

  const contextMe = (ctx() as JazzAuthContext<Account>).me;

  const me = useCoState<Account, R>(
    contextMe.constructor as CoValueClass<Account>,
    contextMe.id,
    options
  );
  return {
    me: createMemo(() => {
      if(options?.resolve === undefined) {
        return me() || contextMe;
      }
      return me();
    }),
    logOut: ctx().logOut 
  };
}

/**
 * Hook: useAccountOrGuest. */
export function useAccountOrGuest<R extends RefsToResolve<Account>>(options?: { resolve?: R }) {
  const ctx = useJazzContext();
  const isAuth = 'me' in ctx();
  if (!isAuth) {
    return { me: (ctx() as JazzGuestContext).guest };
  }
  return useAccount(options as any);
}

/**
 * Hook: useCoState for any CoValue. */
export function useCoState<V extends CoValue, const R extends RefsToResolve<V> = true>(
  Schema: CoValueClass<V>,
  id: ID<V> | undefined,
  options?: { resolve?: RefsToResolveStrict<V, R> }
): () => Resolved<V, R> | undefined | null 
{
  const ctx = useJazzContext();

  // The value we are subscribing to
  const [state, setState] = createSignal<Resolved<V, R> | undefined | null>(undefined);

  let unsub: (() => void) | undefined;

  createEffect(() => {

    setState(undefined);

    if (!id) return;

    const agent = 'me' in ctx() ? (ctx() as JazzAuthContext<Account>).me : (ctx() as JazzGuestContext).guest;

    unsub = subscribeToCoValue(
      Schema,
      id,
      { 
        resolve: options?.resolve, 
        loadAs: agent,
        onUnavailable: () => {
          setState(null);
        },
        onUnauthorized: () => {
          setState(null);
        },
        syncResolution: true 
      },
      (val) => setState(val as any)
    );

    onCleanup(() => {
      if (unsub) {
        unsub();
        unsub = undefined;
      }
    });
  });

  return state;
}

export function useAcceptInvite<V extends CoValue>({
  invitedObjectSchema,
  onAccept,
  forValueHint,
}: {
  invitedObjectSchema: CoValueClass<V>;
  onAccept: (projectID: ID<V>) => void;
  forValueHint?: string;
}): void {
  const ctx = useJazzContext();

  if (!('me' in ctx())) {
    throw new Error(
      "useAcceptInvite can only be used in a JazzAuthContext. Use useAcceptInviteForGuest in a JazzGuestContext.")
  }

  createEffect(() => {
    const handleInvite = () => {
      const result = consumeInviteLinkFromWindowLocation({
        as: ctx().me,
        invitedObjectSchema,
        forValueHint,
      });

      result
        .then((result) => result && onAccept(result?.valueID))
        .catch((e) => {
          console.error("Failed to accept invite", e);
        });
    };

    handleInvite();

    window.addEventListener("hashchange", handleInvite);
    onCleanup(() => {
      window.removeEventListener("hashchange", handleInvite);
    });
  });
}

