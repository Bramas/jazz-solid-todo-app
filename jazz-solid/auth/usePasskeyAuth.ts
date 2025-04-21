import { createMemo } from 'solid-js';
import { BrowserPasskeyAuth } from 'jazz-browser';
import { useAuthStorage, useJazzContext } from '../contextProvider';
import { useIsAuthenticated } from './useIsAuthenticated';

export type PasskeyAuthHook = {
  current: BrowserPasskeyAuth;
  state: () => 'anonymous' | 'signedIn';
  logIn: () => Promise<void>;
  signUp: (name: string) => Promise<void>;
};

export function usePasskeyAuth({ appName, appHostname }: { appName: string; appHostname?: string }) {
  const ctx = useJazzContext();
  if ('guest' in ctx()) throw new Error('Passkey auth is not supported in guest mode');
  const storage = useAuthStorage();
  const auth = createMemo(() => new BrowserPasskeyAuth(
    ctx().node.crypto,
    ctx().authenticate,
    storage,
    appName,
    appHostname
  ));
  const isAuth = useIsAuthenticated();
  const state = () => (isAuth() ? 'signedIn' : 'anonymous');

  return {
    current: auth(),
    state,
    logIn: auth().logIn.bind(auth()),
    signUp: auth().signUp.bind(auth()),
  };
}