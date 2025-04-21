import { createEffect, createSignal, onCleanup } from 'solid-js';
import { useAuthStorage, useJazzContext } from '../contextProvider';

/**
 * Hook: returns true if user is authenticated.
 */
// This implentation is what we want to use, but it is not working because when logging in, isAuth is updated just before the context.
// so instead the next implementation is used because isAuth is update only when the context is updated
export function useIsAuthenticatedTOOOOFAST() {
  const auth = useAuthStorage();
  const [isAuth, setIsAuth] = createSignal(auth.isAuthenticated);

  const unsub = auth.onUpdate(() => {
    setIsAuth(auth.isAuthenticated);
  });
  
  onCleanup(() => {
    unsub()
  });

  return isAuth;
}

export function useIsAuthenticated() {
  const ctx = useJazzContext();
  const auth = useAuthStorage();
  const [isAuth, setIsAuth] = createSignal(auth.isAuthenticated);

  createEffect(() => {
    ctx();
    setIsAuth(auth.isAuthenticated);
  });
  
  return isAuth;
}

