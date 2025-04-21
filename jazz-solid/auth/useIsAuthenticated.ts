import { createEffect, createSignal, onCleanup } from 'solid-js';
import { useAuthStorage, useJazzContext } from '../contextProvider';

/**
 * Hook: returns true if user is authenticated.
 */
// Hacky implementation to get the authentication status
// the weird case is when the auth says it is authenticated
// but the context is not yet updated, so we need to wait a little bit

export function useIsAuthenticated() {
  const auth = useAuthStorage();
  const [isAuth, setIsAuth] = createSignal(auth.isAuthenticated);

  let hackyWaiting: null | number = null;

  const unsub = auth.onUpdate(() => {
    if(!auth.isAuthenticated) { // do not wait because we need to stop the sync right now
      setIsAuth(false);
      return;
    }
    // otherwise we wait a little bit because the context may be updating now
    // and we do not want to update the context before the auth
    hackyWaiting = setTimeout(() => {
        setIsAuth(auth.isAuthenticated);
        hackyWaiting = null;
      }
      , 300);
  });

  const ctx = useJazzContext();
  createEffect(() => {
    ctx();
    // the context is updated, we do not need to wait anymore
    if (hackyWaiting) { 
      clearTimeout(hackyWaiting);
      hackyWaiting = null;
    }
    setIsAuth(auth.isAuthenticated);
  });
  
  onCleanup(() => {
    unsub()
  });

  return isAuth;
}

